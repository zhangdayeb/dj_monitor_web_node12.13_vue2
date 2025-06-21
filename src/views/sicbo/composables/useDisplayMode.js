import { ref, computed, watch } from 'vue'

/**
 * 显示模式管理 Composable
 * 负责管理骰宝监控的显示模式切换
 */
export function useDisplayMode() {
  // 当前显示模式
  const currentMode = ref('overview')
  
  // 模式历史记录
  const modeHistory = ref(['overview'])
  
  // 自动模式切换
  const autoSwitchEnabled = ref(false)
  const autoSwitchInterval = ref(30000) // 30秒
  
  // 模式配置
  const modeConfigs = ref({
    overview: {
      name: '概览模式',
      key: 'overview',
      label: '概览',
      shortLabel: '概览',
      icon: 'el-icon-view',
      description: '显示基础投注区域，适合快速监控',
      columnCount: 8,
      maxWidth: 1200,
      columns: [
        'user_name',
        'table_name', 
        'count',
        'sum_bet_amt_305', // 大
        'sum_bet_amt_304', // 小
        'sum_bet_amt_306', // 单
        'sum_bet_amt_307', // 双
        'close_status'
      ],
      features: ['realtime', 'basic_amounts'],
      color: '#409eff'
    },
    
    detailed: {
      name: '详细模式',
      key: 'detailed',
      label: '详细',
      shortLabel: '详细',
      icon: 'el-icon-tickets',
      description: '显示基础+总和区域，平衡详细度和可读性',
      columnCount: 18,
      maxWidth: 1800,
      columns: [
        'user_name',
        'table_name',
        'count',
        // 基础区域
        'sum_bet_amt_305', 'sum_bet_amt_304', 
        'sum_bet_amt_306', 'sum_bet_amt_307',
        // 总和区域 (部分热门)
        'sum_bet_amt_308', 'sum_bet_amt_309', 'sum_bet_amt_310', // 4,5,6
        'sum_bet_amt_318', 'sum_bet_amt_319', 'sum_bet_amt_320', // 14,15,16
        'sum_bet_amt_321', // 17
        'close_status'
      ],
      features: ['realtime', 'basic_amounts', 'popular_totals'],
      color: '#67c23a'
    },
    
    complete: {
      name: '完整模式',
      key: 'complete',
      label: '完整',
      shortLabel: '完整',
      icon: 'el-icon-full-screen',
      description: '显示所有投注区域，完整数据视图',
      columnCount: 35,
      maxWidth: 2400,
      columns: [
        'user_name',
        'table_name',
        'count',
        // 基础区域
        'sum_bet_amt_305', 'sum_bet_amt_304', 
        'sum_bet_amt_306', 'sum_bet_amt_307',
        // 总和区域 (4-17)
        'sum_bet_amt_308', 'sum_bet_amt_309', 'sum_bet_amt_310', 'sum_bet_amt_311',
        'sum_bet_amt_312', 'sum_bet_amt_313', 'sum_bet_amt_314', 'sum_bet_amt_315',
        'sum_bet_amt_316', 'sum_bet_amt_317', 'sum_bet_amt_318', 'sum_bet_amt_319',
        'sum_bet_amt_320', 'sum_bet_amt_321',
        // 单骰区域 (1-6)
        'sum_bet_amt_322', 'sum_bet_amt_323', 'sum_bet_amt_324',
        'sum_bet_amt_325', 'sum_bet_amt_326', 'sum_bet_amt_327',
        // 对子区域 (1-6)
        'sum_bet_amt_328', 'sum_bet_amt_329', 'sum_bet_amt_330',
        'sum_bet_amt_331', 'sum_bet_amt_332', 'sum_bet_amt_333',
        'close_status'
      ],
      features: ['realtime', 'all_amounts', 'advanced_analysis'],
      color: '#e6a23c'
    }
  })
  
  // 计算属性 - 当前模式配置
  const currentModeConfig = computed(() => {
    return modeConfigs.value[currentMode.value] || modeConfigs.value.overview
  })
  
  // 计算属性 - 可用模式列表
  const availableModes = computed(() => {
    return Object.values(modeConfigs.value)
  })
  
  // 计算属性 - 是否为移动端模式
  const isMobileMode = computed(() => {
    return window.innerWidth < 768
  })
  
  // 计算属性 - 推荐模式（基于屏幕宽度）
  const recommendedMode = computed(() => {
    const width = window.innerWidth
    
    if (width < 1200) return 'overview'
    if (width < 1800) return 'detailed'
    return 'complete'
  })
  
  // 设置显示模式
  const setMode = (mode) => {
    if (!modeConfigs.value[mode]) {
      console.warn(`未知的显示模式: ${mode}`)
      return false
    }
    
    const oldMode = currentMode.value
    currentMode.value = mode
    
    // 记录模式历史
    if (!modeHistory.value.includes(mode)) {
      modeHistory.value.push(mode)
    }
    
    // 保存到本地存储
    try {
      localStorage.setItem('sicbo_display_mode', mode)
    } catch (error) {
      console.warn('无法保存显示模式到本地存储:', error)
    }
    
    console.log(`显示模式已切换: ${oldMode} -> ${mode}`)
    return true
  }
  
  // 切换到下一个模式
  const nextMode = () => {
    const modes = Object.keys(modeConfigs.value)
    const currentIndex = modes.indexOf(currentMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setMode(modes[nextIndex])
  }
  
  // 切换到上一个模式
  const prevMode = () => {
    const modes = Object.keys(modeConfigs.value)
    const currentIndex = modes.indexOf(currentMode.value)
    const prevIndex = currentIndex === 0 ? modes.length - 1 : currentIndex - 1
    setMode(modes[prevIndex])
  }
  
  // 自动切换到推荐模式
  const switchToRecommended = () => {
    setMode(recommendedMode.value)
  }
  
  // 根据数据量智能切换
  const smartSwitch = (dataCount) => {
    let targetMode = 'overview'
    
    if (dataCount > 100) {
      targetMode = 'detailed'
    } else if (dataCount > 50) {
      targetMode = 'overview'
    }
    
    // 考虑屏幕尺寸
    if (isMobileMode.value && targetMode === 'complete') {
      targetMode = 'detailed'
    }
    
    setMode(targetMode)
  }
  
  // 获取模式信息
  const getModeInfo = (mode = null) => {
    const targetMode = mode || currentMode.value
    const config = modeConfigs.value[targetMode]
    
    if (!config) return null
    
    return {
      ...config,
      isCurrent: targetMode === currentMode.value,
      isRecommended: targetMode === recommendedMode.value
    }
  }
  
  // 检查模式可用性
  const isModeAvailable = (mode) => {
    const config = modeConfigs.value[mode]
    if (!config) return false
    
    // 检查屏幕宽度是否支持
    return window.innerWidth >= (config.maxWidth * 0.6)
  }
  
  // 获取模式切换建议
  const getSwitchSuggestion = () => {
    const current = currentMode.value
    const recommended = recommendedMode.value
    
    if (current === recommended) {
      return null
    }
    
    const currentConfig = modeConfigs.value[current]
    const recommendedConfig = modeConfigs.value[recommended]
    
    return {
      current: {
        mode: current,
        name: currentConfig.name
      },
      recommended: {
        mode: recommended,
        name: recommendedConfig.name
      },
      reason: window.innerWidth < 1200 ? '屏幕较小，建议使用简化模式' : '屏幕较大，可使用详细模式'
    }
  }
  
  // 启动自动切换
  const startAutoSwitch = () => {
    if (autoSwitchEnabled.value) return
    
    autoSwitchEnabled.value = true
    
    const switchTimer = setInterval(() => {
      nextMode()
    }, autoSwitchInterval.value)
    
    // 返回清理函数
    return () => {
      clearInterval(switchTimer)
      autoSwitchEnabled.value = false
    }
  }
  
  // 停止自动切换
  const stopAutoSwitch = () => {
    autoSwitchEnabled.value = false
  }
  
  // 重置模式配置
  const resetModeConfig = (mode) => {
    // 这里可以重置特定模式的配置
    console.log(`重置模式配置: ${mode}`)
  }
  
  // 监听窗口大小变化
  const handleResize = () => {
    // 可以选择是否自动切换到推荐模式
    // switchToRecommended()
  }
  
  // 从本地存储恢复模式
  const restoreMode = () => {
    try {
      const savedMode = localStorage.getItem('sicbo_display_mode')
      if (savedMode && modeConfigs.value[savedMode]) {
        setMode(savedMode)
      }
    } catch (error) {
      console.warn('无法从本地存储恢复显示模式:', error)
    }
  }
  
  // 监听模式变化
  watch(currentMode, (newMode, oldMode) => {
    console.log(`显示模式变化: ${oldMode} -> ${newMode}`)
    
    // 可以在这里添加模式切换的副作用
    // 比如发送分析事件等
  })
  
  // 初始化
  const initialize = () => {
    // 恢复保存的模式
    restoreMode()
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    
    // 返回清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      stopAutoSwitch()
    }
  }
  
  return {
    // 状态
    currentMode,
    currentModeConfig,
    availableModes,
    modeHistory,
    isMobileMode,
    recommendedMode,
    autoSwitchEnabled,
    
    // 方法
    setMode,
    nextMode,
    prevMode,
    switchToRecommended,
    smartSwitch,
    getModeInfo,
    isModeAvailable,
    getSwitchSuggestion,
    startAutoSwitch,
    stopAutoSwitch,
    resetModeConfig,
    initialize,
    
    // 配置
    modeConfigs
  }
}