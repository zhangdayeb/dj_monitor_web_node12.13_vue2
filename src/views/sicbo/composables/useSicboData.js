import { ref, reactive, computed, watch, nextTick } from 'vue'
import apiService from '@/service/apiService'

/**
 * 骰宝数据管理 Composable
 * 负责数据获取、缓存、实时更新等功能
 */
export function useSicboData() {
  // 主要数据
  const tableData = ref([])
  const personalData = ref({})
  const statisticsData = ref({})
  
  // 状态管理
  const loading = ref(false)
  const refreshing = ref(false)
  const error = ref(null)
  const lastUpdateTime = ref(null)
  
  // 自动刷新相关
  const autoRefreshTimer = ref(null)
  const autoRefreshEnabled = ref(true)
  const refreshInterval = ref(3000) // 3秒
  
  // 数据缓存
  const dataCache = reactive({
    overview: new Map(),
    personal: new Map(),
    statistics: new Map()
  })
  
  // 缓存配置
  const cacheConfig = {
    maxAge: 30000, // 30秒缓存
    maxSize: 100,  // 最大缓存条目数
    enabled: true
  }
  
  // WebSocket连接状态
  const wsConnected = ref(false)
  const wsReconnecting = ref(false)
  const wsReconnectCount = ref(0)
  const maxReconnectAttempts = 5
  
  // 数据统计
  const dataStats = reactive({
    totalRecords: 0,
    lastFetchTime: null,
    fetchCount: 0,
    errorCount: 0,
    cacheHitRate: 0
  })

  // 计算属性 - 在线用户数
  const onlineUserCount = computed(() => {
    return new Set(tableData.value.map(item => item.user_id)).size
  })

  // 计算属性 - 总投注金额
  const totalBetAmount = computed(() => {
    return tableData.value.reduce((sum, item) => sum + (item.count || 0), 0)
  })

  // 计算属性 - 活跃台桌数
  const activeTableCount = computed(() => {
    return new Set(tableData.value.map(item => item.table_name)).size
  })

  // 计算属性 - 数据健康状态
  const dataHealth = computed(() => {
    const now = Date.now()
    const lastUpdate = lastUpdateTime.value
    
    if (!lastUpdate) return 'unknown'
    
    const timeDiff = now - lastUpdate
    if (timeDiff < 10000) return 'excellent'  // 10秒内
    if (timeDiff < 30000) return 'good'       // 30秒内
    if (timeDiff < 60000) return 'warning'    // 1分钟内
    return 'critical'                         // 超过1分钟
  })

  // 获取骰宝总览数据
  const fetchOverviewData = async (forceRefresh = false) => {
    const cacheKey = 'overview_data'
    
    // 检查缓存
    if (!forceRefresh && cacheConfig.enabled) {
      const cached = getCachedData('overview', cacheKey)
      if (cached) {
        tableData.value = cached.data
        return cached.data
      }
    }
    
    try {
      loading.value = true
      error.value = null
      
      const response = await apiService.post('/sicbo/data', {
        action: 'getOverviewData',
        timestamp: Date.now()
      })
      
      if (response.data && response.data.list) {
        const processedData = processRawData(response.data.list)
        tableData.value = processedData
        
        // 缓存数据
        setCachedData('overview', cacheKey, processedData)
        
        // 更新统计
        updateDataStats(processedData.length)
        
        return processedData
      } else {
        throw new Error('数据格式错误')
      }
    } catch (err) {
      console.error('获取总览数据失败:', err)
      error.value = err.message || '获取数据失败'
      dataStats.errorCount++
      throw err
    } finally {
      loading.value = false
      lastUpdateTime.value = Date.now()
    }
  }

  // 获取个人数据
  const fetchPersonalData = async (userId, options = {}) => {
    const cacheKey = `personal_${userId}`
    
    // 检查缓存
    if (!options.forceRefresh && cacheConfig.enabled) {
      const cached = getCachedData('personal', cacheKey)
      if (cached) {
        return cached.data
      }
    }
    
    try {
      loading.value = true
      
      const response = await apiService.post('/sicbo/personal', {
        user_id: userId,
        include_history: options.includeHistory || false,
        date_range: options.dateRange || 'today'
      })
      
      if (response.data) {
        const processedData = processPersonalData(response.data)
        
        // 缓存数据
        setCachedData('personal', cacheKey, processedData)
        
        // 更新个人数据状态
        personalData.value[userId] = processedData
        
        return processedData
      }
    } catch (err) {
      console.error('获取个人数据失败:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取统计数据
  const fetchStatisticsData = async (timeRange = 'today') => {
    const cacheKey = `statistics_${timeRange}`
    
    // 检查缓存
    if (cacheConfig.enabled) {
      const cached = getCachedData('statistics', cacheKey)
      if (cached) {
        statisticsData.value = cached.data
        return cached.data
      }
    }
    
    try {
      loading.value = true
      
      const response = await apiService.post('/sicbo/statistics', {
        time_range: timeRange,
        include_heat: true,
        include_ranking: true
      })
      
      if (response.data) {
        const processedData = processStatisticsData(response.data)
        statisticsData.value = processedData
        
        // 缓存数据
        setCachedData('statistics', cacheKey, processedData)
        
        return processedData
      }
    } catch (err) {
      console.error('获取统计数据失败:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // 处理原始数据
  const processRawData = (rawData) => {
    if (!Array.isArray(rawData)) return []
    
    return rawData.map(item => {
      // 基础数据处理
      const processed = {
        ...item,
        user_id: item.user_id?.toString() || '',
        user_name: item.user_name || `用户${item.user_id}`,
        table_name: item.table_name || '未知台桌',
        count: parseFloat(item.count) || 0,
        close_status: parseInt(item.close_status) || 1,
        created_at: item.created_at || Date.now()
      }
      
      // 处理投注金额字段
      for (let i = 304; i <= 340; i++) {
        const propName = `sum_bet_amt_${i}`
        if (item[propName] !== undefined) {
          processed[propName] = parseFloat(item[propName]) || 0
        }
      }
      
      // 计算总投注额
      processed.totalBetAmount = calculateTotalBetAmount(processed)
      
      // 计算投注项目数
      processed.betItemCount = calculateBetItemCount(processed)
      
      // 风险评估
      processed.riskLevel = calculateRiskLevel(processed)
      
      return processed
    })
  }

  // 处理个人数据
  const processPersonalData = (rawData) => {
    return {
      userInfo: {
        id: rawData.user_id,
        name: rawData.user_name || `用户${rawData.user_id}`,
        totalBet: rawData.total_bet || 0,
        betCount: rawData.bet_count || 0,
        winAmount: rawData.win_amount || 0,
        lastBetTime: rawData.last_bet_time || null
      },
      betHistory: Array.isArray(rawData.bet_history) ? rawData.bet_history : [],
      groupedBets: groupBetsByCategory(rawData),
      statistics: calculatePersonalStats(rawData)
    }
  }

  // 处理统计数据
  const processStatisticsData = (rawData) => {
    return {
      overview: {
        totalAmount: rawData.total_amount || 0,
        totalUsers: rawData.total_users || 0,
        totalBets: rawData.total_bets || 0,
        activeTables: rawData.active_tables || 0
      },
      heatMap: processHeatMapData(rawData.heat_data),
      ranking: {
        topUsers: rawData.top_users || [],
        topTables: rawData.top_tables || [],
        hotBets: rawData.hot_bets || []
      },
      trends: rawData.trends || {}
    }
  }

  // 计算总投注金额
  const calculateTotalBetAmount = (data) => {
    let total = 0
    for (let i = 304; i <= 340; i++) {
      const amount = data[`sum_bet_amt_${i}`]
      if (amount && amount > 0) {
        total += amount
      }
    }
    return total
  }

  // 计算投注项目数
  const calculateBetItemCount = (data) => {
    let count = 0
    for (let i = 304; i <= 340; i++) {
      const amount = data[`sum_bet_amt_${i}`]
      if (amount && amount > 0) {
        count++
      }
    }
    return count
  }

  // 计算风险等级
  const calculateRiskLevel = (data) => {
    const totalBet = data.totalBetAmount || 0
    const betCount = data.betItemCount || 0
    
    let risk = 0
    
    // 基于投注金额
    if (totalBet > 100000) risk += 40
    else if (totalBet > 50000) risk += 25
    else if (totalBet > 10000) risk += 10
    
    // 基于投注分散度
    if (betCount > 10) risk += 20
    else if (betCount > 5) risk += 10
    
    // 基于高赔率投注
    const highOddsBets = countHighOddsBets(data)
    if (highOddsBets > 0) risk += highOddsBets * 15
    
    return Math.min(risk, 100)
  }

  // 统计高赔率投注
  const countHighOddsBets = (data) => {
    let count = 0
    
    // 三连投注 (334-340)
    for (let i = 334; i <= 340; i++) {
      if (data[`sum_bet_amt_${i}`] > 0) count++
    }
    
    // 对子投注 (328-333)
    for (let i = 328; i <= 333; i++) {
      if (data[`sum_bet_amt_${i}`] > 0) count++
    }
    
    return count
  }

  // 按类别分组投注
  const groupBetsByCategory = (data) => {
    const grouped = {
      basic: { amount: 0, items: [] },
      total: { amount: 0, items: [] },
      single: { amount: 0, items: [] },
      pair: { amount: 0, items: [] },
      triple: { amount: 0, items: [] }
    }
    
    // 基础区域 (304-307)
    for (let i = 304; i <= 307; i++) {
      const amount = data[`sum_bet_amt_${i}`] || 0
      if (amount > 0) {
        grouped.basic.amount += amount
        grouped.basic.items.push({ id: i, amount })
      }
    }
    
    // 总和区域 (308-321)
    for (let i = 308; i <= 321; i++) {
      const amount = data[`sum_bet_amt_${i}`] || 0
      if (amount > 0) {
        grouped.total.amount += amount
        grouped.total.items.push({ id: i, amount })
      }
    }
    
    // 单骰区域 (322-327)
    for (let i = 322; i <= 327; i++) {
      const amount = data[`sum_bet_amt_${i}`] || 0
      if (amount > 0) {
        grouped.single.amount += amount
        grouped.single.items.push({ id: i, amount })
      }
    }
    
    // 对子区域 (328-333)
    for (let i = 328; i <= 333; i++) {
      const amount = data[`sum_bet_amt_${i}`] || 0
      if (amount > 0) {
        grouped.pair.amount += amount
        grouped.pair.items.push({ id: i, amount })
      }
    }
    
    // 三连区域 (334-340)
    for (let i = 334; i <= 340; i++) {
      const amount = data[`sum_bet_amt_${i}`] || 0
      if (amount > 0) {
        grouped.triple.amount += amount
        grouped.triple.items.push({ id: i, amount })
      }
    }
    
    return grouped
  }

  // 计算个人统计
  const calculatePersonalStats = (data) => {
    return {
      avgBetAmount: data.total_bet / Math.max(data.bet_count, 1),
      maxSingleBet: Math.max(...Object.values(data).filter(v => typeof v === 'number')),
      favoriteCategory: findFavoriteCategory(data),
      riskScore: calculateRiskLevel(data)
    }
  }

  // 找出最喜欢的投注类别
  const findFavoriteCategory = (data) => {
    const grouped = groupBetsByCategory(data)
    let maxAmount = 0
    let favorite = 'basic'
    
    Object.entries(grouped).forEach(([category, info]) => {
      if (info.amount > maxAmount) {
        maxAmount = info.amount
        favorite = category
      }
    })
    
    return favorite
  }

  // 处理热力图数据
  const processHeatMapData = (heatData) => {
    if (!heatData) return {}
    
    return {
      basic: heatData.basic || {},
      total: heatData.total || {},
      single: heatData.single || {},
      pair: heatData.pair || {},
      triple: heatData.triple || {}
    }
  }

  // 缓存相关方法
  const getCachedData = (type, key) => {
    if (!cacheConfig.enabled) return null
    
    const cache = dataCache[type]
    const cached = cache.get(key)
    
    if (!cached) return null
    
    const now = Date.now()
    if (now - cached.timestamp > cacheConfig.maxAge) {
      cache.delete(key)
      return null
    }
    
    // 更新缓存命中率
    dataStats.cacheHitRate = (dataStats.cacheHitRate * 0.9) + (1 * 0.1)
    
    return cached
  }

  const setCachedData = (type, key, data) => {
    if (!cacheConfig.enabled) return
    
    const cache = dataCache[type]
    
    // 清理过期缓存
    if (cache.size >= cacheConfig.maxSize) {
      const oldestKey = cache.keys().next().value
      cache.delete(oldestKey)
    }
    
    cache.set(key, {
      data: JSON.parse(JSON.stringify(data)), // 深拷贝
      timestamp: Date.now()
    })
  }

  // 清理缓存
  const clearCache = (type = null) => {
    if (type) {
      dataCache[type].clear()
    } else {
      Object.values(dataCache).forEach(cache => cache.clear())
    }
  }

  // 更新数据统计
  const updateDataStats = (recordCount) => {
    dataStats.totalRecords = recordCount
    dataStats.lastFetchTime = Date.now()
    dataStats.fetchCount++
  }

  // 启动自动刷新
  const startAutoRefresh = () => {
    if (autoRefreshTimer.value) return
    
    autoRefreshEnabled.value = true
    autoRefreshTimer.value = setInterval(async () => {
      if (!document.hidden) { // 页面可见时才刷新
        try {
          await fetchOverviewData(true)
        } catch (error) {
          console.warn('自动刷新失败:', error)
        }
      }
    }, refreshInterval.value)
  }

  // 停止自动刷新
  const stopAutoRefresh = () => {
    if (autoRefreshTimer.value) {
      clearInterval(autoRefreshTimer.value)
      autoRefreshTimer.value = null
    }
    autoRefreshEnabled.value = false
  }

  // 全局刷新
  const startGlobalAutoRefresh = () => {
    startAutoRefresh()
  }

  const stopGlobalAutoRefresh = () => {
    stopAutoRefresh()
  }

  // 手动刷新
  const refresh = async () => {
    refreshing.value = true
    try {
      await fetchOverviewData(true)
    } finally {
      refreshing.value = false
    }
  }

  // 监听页面可见性变化
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // 页面隐藏时暂停刷新
      if (autoRefreshTimer.value) {
        stopAutoRefresh()
      }
    } else {
      // 页面显示时恢复刷新
      if (autoRefreshEnabled.value) {
        startAutoRefresh()
      }
    }
  }

  // 初始化
  const initialize = () => {
    // 监听页面可见性
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // 初始数据加载
    fetchOverviewData()
    
    // 启动自动刷新
    if (autoRefreshEnabled.value) {
      startAutoRefresh()
    }
  }

  // 清理
  const cleanup = () => {
    stopAutoRefresh()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    clearCache()
  }

  return {
    // 数据状态
    tableData,
    personalData,
    statisticsData,
    loading,
    refreshing,
    error,
    lastUpdateTime,
    
    // 连接状态
    wsConnected,
    wsReconnecting,
    
    // 计算属性
    onlineUserCount,
    totalBetAmount,
    activeTableCount,
    dataHealth,
    
    // 统计信息
    dataStats,
    
    // 数据获取方法
    fetchOverviewData,
    fetchPersonalData,
    fetchStatisticsData,
    
    // 刷新控制
    refresh,
    startAutoRefresh,
    stopAutoRefresh,
    startGlobalAutoRefresh,
    stopGlobalAutoRefresh,
    
    // 缓存管理
    clearCache,
    
    // 配置
    autoRefreshEnabled,
    refreshInterval,
    
    // 生命周期
    initialize,
    cleanup
  }
}