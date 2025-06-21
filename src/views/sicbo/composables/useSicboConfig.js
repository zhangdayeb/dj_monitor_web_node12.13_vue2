import { ref, reactive, computed } from 'vue'
import { SICBO_MAPPING } from '../constants/sicboMapping.js'

/**
 * 骰宝配置管理 Composable
 * 负责管理骰宝游戏的配置、映射关系和业务规则
 */
export function useSicboConfig() {
  // 投注分组配置
  const betGroups = ref([
    {
      key: 'basic',
      name: '基础区域',
      shortName: '基础',
      description: '大小单双基础投注',
      icon: 'el-icon-grid',
      collapsible: false,
      defaultExpanded: true,
      color: '#409eff',
      order: 1,
      items: [
        { key: 'big', name: '大', id: 305, odds: '1:1', probability: '48.61%' },
        { key: 'small', name: '小', id: 304, odds: '1:1', probability: '48.61%' },
        { key: 'odd', name: '单', id: 306, odds: '1:1', probability: '48.61%' },
        { key: 'even', name: '双', id: 307, odds: '1:1', probability: '48.61%' }
      ]
    },
    {
      key: 'total',
      name: '总和区域',
      shortName: '总和',
      description: '三颗骰子点数总和投注',
      icon: 'el-icon-plus',
      collapsible: true,
      defaultExpanded: false,
      color: '#67c23a',
      order: 2,
      items: generateTotalItems()
    },
    {
      key: 'single',
      name: '单骰区域',
      shortName: '单骰',
      description: '单个骰子点数投注',
      icon: 'el-icon-circle-check',
      collapsible: true,
      defaultExpanded: false,
      color: '#e6a23c',
      order: 3,
      items: [
        { key: 'single_1', name: '单骰1', id: 322, odds: '1:1', probability: '42.13%' },
        { key: 'single_2', name: '单骰2', id: 323, odds: '1:1', probability: '42.13%' },
        { key: 'single_3', name: '单骰3', id: 324, odds: '1:1', probability: '42.13%' },
        { key: 'single_4', name: '单骰4', id: 325, odds: '1:1', probability: '42.13%' },
        { key: 'single_5', name: '单骰5', id: 326, odds: '1:1', probability: '42.13%' },
        { key: 'single_6', name: '单骰6', id: 327, odds: '1:1', probability: '42.13%' }
      ]
    },
    {
      key: 'pair',
      name: '对子区域',
      shortName: '对子',
      description: '两个相同点数投注',
      icon: 'el-icon-copy-document',
      collapsible: true,
      defaultExpanded: false,
      color: '#f56c6c',
      order: 4,
      items: [
        { key: 'pair_1', name: '对子1', id: 328, odds: '10:1', probability: '7.41%' },
        { key: 'pair_2', name: '对子2', id: 329, odds: '10:1', probability: '7.41%' },
        { key: 'pair_3', name: '对子3', id: 330, odds: '10:1', probability: '7.41%' },
        { key: 'pair_4', name: '对子4', id: 331, odds: '10:1', probability: '7.41%' },
        { key: 'pair_5', name: '对子5', id: 332, odds: '10:1', probability: '7.41%' },
        { key: 'pair_6', name: '对子6', id: 333, odds: '10:1', probability: '7.41%' }
      ]
    },
    {
      key: 'triple',
      name: '三连区域',
      shortName: '三连',
      description: '三个相同点数投注',
      icon: 'el-icon-star-on',
      collapsible: true,
      defaultExpanded: false,
      color: '#909399',
      order: 5,
      items: [
        { key: 'triple_1', name: '三连1', id: 334, odds: '180:1', probability: '0.46%' },
        { key: 'triple_2', name: '三连2', id: 335, odds: '180:1', probability: '0.46%' },
        { key: 'triple_3', name: '三连3', id: 336, odds: '180:1', probability: '0.46%' },
        { key: 'triple_4', name: '三连4', id: 337, odds: '180:1', probability: '0.46%' },
        { key: 'triple_5', name: '三连5', id: 338, odds: '180:1', probability: '0.46%' },
        { key: 'triple_6', name: '三连6', id: 339, odds: '180:1', probability: '0.46%' },
        { key: 'triple_any', name: '任意三连', id: 340, odds: '30:1', probability: '2.78%' }
      ]
    }
  ])

  // 系统配置
  const systemConfig = reactive({
    // 刷新配置
    refresh: {
      interval: 3000, // 3秒刷新一次
      autoRefresh: true,
      maxRetries: 3,
      retryDelay: 1000
    },
    
    // 显示配置
    display: {
      defaultMode: 'overview',
      animationEnabled: true,
      highlightThreshold: 1000, // 高亮显示的金额阈值
      compactMode: false
    },
    
    // 告警配置
    alerts: {
      enabled: true,
      highAmountThreshold: 50000, // 大额投注告警
      riskUserThreshold: 100000, // 风险用户告警
      rapidBettingThreshold: 20, // 快速投注告警(次数)
      timeWindow: 300000 // 5分钟时间窗口
    },
    
    // 数据配置
    data: {
      maxRecords: 1000, // 最大记录数
      cacheTimeout: 30000, // 缓存超时时间
      batchSize: 100 // 批量处理大小
    },
    
    // 权限配置
    permissions: {
      canExport: true,
      canViewPersonal: true,
      canViewStatistics: true,
      canModifySettings: false
    }
  })

  // 台桌配置
  const tableConfig = ref({
    tables: [
      { id: 'A', name: '台桌A', type: 'normal', maxPlayers: 8, status: 'active' },
      { id: 'B', name: '台桌B', type: 'normal', maxPlayers: 8, status: 'active' },
      { id: 'C', name: '台桌C', type: 'normal', maxPlayers: 8, status: 'active' },
      { id: 'D', name: '台桌D', type: 'normal', maxPlayers: 8, status: 'maintenance' },
      { id: 'VIP1', name: 'VIP台桌1', type: 'vip', maxPlayers: 6, status: 'active' },
      { id: 'VIP2', name: 'VIP台桌2', type: 'vip', maxPlayers: 6, status: 'active' }
    ],
    limits: {
      normal: { min: 10, max: 50000 },
      vip: { min: 100, max: 500000 }
    }
  })

  // 计算属性 - 活跃台桌
  const activeTables = computed(() => {
    return tableConfig.value.tables.filter(table => table.status === 'active')
  })

  // 计算属性 - VIP台桌
  const vipTables = computed(() => {
    return tableConfig.value.tables.filter(table => table.type === 'vip')
  })

  // 计算属性 - 投注项目映射
  const betItemMapping = computed(() => {
    const mapping = {}
    
    betGroups.value.forEach(group => {
      group.items.forEach(item => {
        mapping[item.id] = {
          ...item,
          groupKey: group.key,
          groupName: group.name,
          propName: `sum_bet_amt_${item.id}`
        }
      })
    })
    
    return mapping
  })

  // 计算属性 - 按分组的投注项目
  const itemsByGroup = computed(() => {
    const result = {}
    
    betGroups.value.forEach(group => {
      result[group.key] = group.items
    })
    
    return result
  })

  // 生成总和投注项目
  function generateTotalItems() {
    const items = []
    const oddsMap = {
      4: '60:1', 5: '30:1', 6: '17:1', 7: '12:1', 8: '8:1',
      9: '6:1', 10: '6:1', 11: '6:1', 12: '6:1', 13: '6:1',
      14: '8:1', 15: '12:1', 16: '17:1', 17: '30:1'
    }
    
    const probabilityMap = {
      4: '1.39%', 5: '2.78%', 6: '4.63%', 7: '6.94%', 8: '9.72%',
      9: '11.57%', 10: '12.50%', 11: '12.50%', 12: '12.50%', 13: '11.57%',
      14: '9.72%', 15: '6.94%', 16: '4.63%', 17: '2.78%'
    }
    
    for (let i = 4; i <= 17; i++) {
      items.push({
        key: `total_${i}`,
        name: `总和${i}`,
        id: 308 + (i - 4),
        odds: oddsMap[i],
        probability: probabilityMap[i]
      })
    }
    
    return items
  }

  // 获取投注项目信息
  const getBetItemInfo = (itemId) => {
    return betItemMapping.value[itemId] || null
  }

  // 获取分组信息
  const getGroupInfo = (groupKey) => {
    return betGroups.value.find(group => group.key === groupKey) || null
  }

  // 获取投注项目的属性名
  const getBetPropName = (itemId) => {
    const item = getBetItemInfo(itemId)
    return item ? item.propName : null
  }

  // 获取赔率
  const getOdds = (itemId) => {
    const item = getBetItemInfo(itemId)
    return item ? item.odds : '1:1'
  }

  // 获取概率
  const getProbability = (itemId) => {
    const item = getBetItemInfo(itemId)
    return item ? item.probability : '0%'
  }

  // 检查是否为高赔率投注
  const isHighOddsItem = (itemId) => {
    const item = getBetItemInfo(itemId)
    if (!item) return false
    
    const odds = item.odds.split(':')
    const ratio = parseInt(odds[0]) / parseInt(odds[1])
    return ratio >= 10 // 10倍以上算高赔率
  }

  // 获取风险等级
  const getRiskLevel = (itemId) => {
    const item = getBetItemInfo(itemId)
    if (!item) return 'unknown'
    
    const odds = item.odds.split(':')
    const ratio = parseInt(odds[0]) / parseInt(odds[1])
    
    if (ratio >= 50) return 'extreme' // 极高风险
    if (ratio >= 10) return 'high'    // 高风险
    if (ratio >= 5) return 'medium'   // 中风险
    return 'low'                      // 低风险
  }

  // 更新系统配置
  const updateSystemConfig = (newConfig) => {
    Object.assign(systemConfig, newConfig)
    
    // 保存到本地存储
    try {
      localStorage.setItem('sicbo_system_config', JSON.stringify(systemConfig))
    } catch (error) {
      console.warn('无法保存系统配置:', error)
    }
  }

  // 恢复系统配置
  const restoreSystemConfig = () => {
    try {
      const saved = localStorage.getItem('sicbo_system_config')
      if (saved) {
        const config = JSON.parse(saved)
        Object.assign(systemConfig, config)
      }
    } catch (error) {
      console.warn('无法恢复系统配置:', error)
    }
  }

  // 重置系统配置
  const resetSystemConfig = () => {
    // 重置为默认值
    systemConfig.refresh.interval = 3000
    systemConfig.refresh.autoRefresh = true
    systemConfig.display.defaultMode = 'overview'
    systemConfig.alerts.enabled = true
    
    try {
      localStorage.removeItem('sicbo_system_config')
    } catch (error) {
      console.warn('无法清除系统配置:', error)
    }
  }

  // 获取台桌信息
  const getTableInfo = (tableId) => {
    return tableConfig.value.tables.find(table => table.id === tableId) || null
  }

  // 检查台桌是否可用
  const isTableAvailable = (tableId) => {
    const table = getTableInfo(tableId)
    return table && table.status === 'active'
  }

  // 获取台桌限额
  const getTableLimits = (tableId) => {
    const table = getTableInfo(tableId)
    if (!table) return null
    
    return tableConfig.value.limits[table.type] || tableConfig.value.limits.normal
  }

  // 验证投注金额
  const validateBetAmount = (amount, tableId) => {
    const limits = getTableLimits(tableId)
    if (!limits) return { valid: false, message: '台桌不存在' }
    
    if (amount < limits.min) {
      return { valid: false, message: `最小投注额为 ¥${limits.min}` }
    }
    
    if (amount > limits.max) {
      return { valid: false, message: `最大投注额为 ¥${limits.max}` }
    }
    
    return { valid: true, message: '投注金额有效' }
  }

  // 获取全局配置
  const getGlobalConfig = () => {
    return {
      betGroups: betGroups.value,
      systemConfig,
      tableConfig: tableConfig.value,
      mapping: SICBO_MAPPING
    }
  }

  // 导出配置
  const exportConfig = () => {
    return {
      betGroups: betGroups.value,
      systemConfig,
      tableConfig: tableConfig.value,
      timestamp: Date.now()
    }
  }

  // 导入配置
  const importConfig = (config) => {
    try {
      if (config.betGroups) {
        betGroups.value = config.betGroups
      }
      if (config.systemConfig) {
        Object.assign(systemConfig, config.systemConfig)
      }
      if (config.tableConfig) {
        tableConfig.value = config.tableConfig
      }
      return { success: true, message: '配置导入成功' }
    } catch (error) {
      return { success: false, message: '配置导入失败: ' + error.message }
    }
  }

  // 初始化配置
  const initializeConfig = () => {
    // 恢复保存的配置
    restoreSystemConfig()
    
    console.log('骰宝配置已初始化')
  }

  return {
    // 数据
    betGroups,
    systemConfig,
    tableConfig,
    
    // 计算属性
    activeTables,
    vipTables,
    betItemMapping,
    itemsByGroup,
    
    // 方法
    getBetItemInfo,
    getGroupInfo,
    getBetPropName,
    getOdds,
    getProbability,
    isHighOddsItem,
    getRiskLevel,
    updateSystemConfig,
    restoreSystemConfig,
    resetSystemConfig,
    getTableInfo,
    isTableAvailable,
    getTableLimits,
    validateBetAmount,
    getGlobalConfig,
    exportConfig,
    importConfig,
    initializeConfig
  }
}