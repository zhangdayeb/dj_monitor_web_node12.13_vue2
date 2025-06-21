/**
 * 显示模式配置常量
 * 定义各种显示模式的详细配置信息
 */

// 显示模式枚举
export const DISPLAY_MODE_TYPES = {
  COMPACT: 'compact',
  OVERVIEW: 'overview',
  DETAILED: 'detailed',
  COMPLETE: 'complete',
  ANALYSIS: 'analysis',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
}

// 主要显示模式配置
export const DISPLAY_MODES = {
  [DISPLAY_MODE_TYPES.COMPACT]: {
    key: 'compact',
    name: '紧凑模式',
    shortName: '紧凑',
    label: '紧凑',
    shortLabel: '紧凑',
    icon: 'el-icon-minus',
    description: '最精简的信息显示，适合小屏幕设备',
    
    // 列配置
    columns: [
      'user_name',
      'table_name', 
      'count',
      'close_status'
    ],
    columnCount: 4,
    
    // 尺寸配置
    minWidth: 400,
    maxWidth: 600,
    idealWidth: 500,
    
    // 视觉配置
    color: '#909399',
    bgColor: '#f4f4f5',
    borderColor: '#dcdfe6',
    
    // 功能特性
    features: {
      realtime: true,
      sorting: true,
      filtering: false,
      export: false,
      pagination: true,
      search: true
    },
    
    // 适用场景
    usage: {
      screenSize: 'small',
      deviceType: 'mobile',
      networkSpeed: 'slow',
      dataVolume: 'any'
    },
    
    // 性能优化
    performance: {
      virtualScrolling: true,
      lazyLoading: true,
      cacheEnabled: true,
      batchSize: 50
    },
    
    order: 1,
    isDefault: false,
    isRecommended: false
  },

  [DISPLAY_MODE_TYPES.OVERVIEW]: {
    key: 'overview',
    name: '概览模式',
    shortName: '概览',
    label: '概览',
    shortLabel: '概览',
    icon: 'el-icon-view',
    description: '显示基础投注区域，适合日常监控',
    
    // 列配置
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
    columnCount: 8,
    
    // 分组配置
    columnGroups: [
      {
        title: '基础信息',
        columns: ['user_name', 'table_name', 'count']
      },
      {
        title: '基础投注',
        columns: ['sum_bet_amt_305', 'sum_bet_amt_304', 'sum_bet_amt_306', 'sum_bet_amt_307']
      },
      {
        title: '状态',
        columns: ['close_status']
      }
    ],
    
    // 尺寸配置
    minWidth: 700,
    maxWidth: 1000,
    idealWidth: 850,
    
    // 视觉配置
    color: '#409eff',
    bgColor: '#ecf5ff',
    borderColor: '#b3d8ff',
    
    // 功能特性
    features: {
      realtime: true,
      sorting: true,
      filtering: true,
      export: true,
      pagination: true,
      search: true,
      highlighting: true,
      tooltips: true
    },
    
    // 适用场景
    usage: {
      screenSize: 'medium',
      deviceType: 'tablet',
      networkSpeed: 'normal',
      dataVolume: 'medium'
    },
    
    // 性能优化
    performance: {
      virtualScrolling: false,
      lazyLoading: false,
      cacheEnabled: true,
      batchSize: 100
    },
    
    order: 2,
    isDefault: true,
    isRecommended: true
  },

  [DISPLAY_MODE_TYPES.DETAILED]: {
    key: 'detailed',
    name: '详细模式',
    shortName: '详细',
    label: '详细',
    shortLabel: '详细',
    icon: 'el-icon-tickets',
    description: '显示基础+热门总和区域，平衡信息量和可读性',
    
    // 列配置
    columns: [
      'user_name',
      'table_name',
      'count',
      // 基础区域
      'sum_bet_amt_305', 'sum_bet_amt_304', 
      'sum_bet_amt_306', 'sum_bet_amt_307',
      // 热门总和区域
      'sum_bet_amt_308', 'sum_bet_amt_309', 'sum_bet_amt_310', // 和4,5,6
      'sum_bet_amt_318', 'sum_bet_amt_319', 'sum_bet_amt_320', 'sum_bet_amt_321', // 和14,15,16,17
      'close_status'
    ],
    columnCount: 15,
    
    // 分组配置
    columnGroups: [
      {
        title: '基础信息',
        columns: ['user_name', 'table_name', 'count']
      },
      {
        title: '基础投注',
        columns: ['sum_bet_amt_305', 'sum_bet_amt_304', 'sum_bet_amt_306', 'sum_bet_amt_307']
      },
      {
        title: '总和投注(低概率)',
        columns: ['sum_bet_amt_308', 'sum_bet_amt_309', 'sum_bet_amt_310']
      },
      {
        title: '总和投注(高概率)',
        columns: ['sum_bet_amt_318', 'sum_bet_amt_319', 'sum_bet_amt_320', 'sum_bet_amt_321']
      },
      {
        title: '状态',
        columns: ['close_status']
      }
    ],
    
    // 尺寸配置
    minWidth: 1100,
    maxWidth: 1500,
    idealWidth: 1300,
    
    // 视觉配置
    color: '#67c23a',
    bgColor: '#f0f9ff',
    borderColor: '#95de64',
    
    // 功能特性
    features: {
      realtime: true,
      sorting: true,
      filtering: true,
      export: true,
      pagination: true,
      search: true,
      highlighting: true,
      tooltips: true,
      grouping: true,
      summary: true
    },
    
    // 适用场景
    usage: {
      screenSize: 'large',
      deviceType: 'desktop',
      networkSpeed: 'fast',
      dataVolume: 'high'
    },
    
    // 性能优化
    performance: {
      virtualScrolling: false,
      lazyLoading: false,
      cacheEnabled: true,
      batchSize: 200
    },
    
    order: 3,
    isDefault: false,
    isRecommended: true
  },

  [DISPLAY_MODE_TYPES.COMPLETE]: {
    key: 'complete',
    name: '完整模式',
    shortName: '完整',
    label: '完整',
    shortLabel: '完整',
    icon: 'el-icon-full-screen',
    description: '显示所有投注区域，完整的数据视图',
    
    // 列配置 - 包含所有投注区域
    columns: 'all', // 特殊标记，表示所有列
    columnCount: 35,
    
    // 分组配置
    columnGroups: [
      {
        title: '基础信息',
        columns: ['user_name', 'table_name', 'count']
      },
      {
        title: '基础投注',
        columns: ['sum_bet_amt_305', 'sum_bet_amt_304', 'sum_bet_amt_306', 'sum_bet_amt_307']
      },
      {
        title: '总和投注',
        columns: Array.from({length: 14}, (_, i) => `sum_bet_amt_${308 + i}`) // 308-321
      },
      {
        title: '单骰投注',
        columns: Array.from({length: 6}, (_, i) => `sum_bet_amt_${322 + i}`) // 322-327
      },
      {
        title: '对子投注',
        columns: Array.from({length: 6}, (_, i) => `sum_bet_amt_${328 + i}`) // 328-333
      },
      {
        title: '三连投注',
        columns: Array.from({length: 7}, (_, i) => `sum_bet_amt_${334 + i}`) // 334-340
      },
      {
        title: '状态',
        columns: ['close_status']
      }
    ],
    
    // 尺寸配置
    minWidth: 2000,
    maxWidth: 3000,
    idealWidth: 2400,
    
    // 视觉配置
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    borderColor: '#f7ba2a',
    
    // 功能特性
    features: {
      realtime: true,
      sorting: true,
      filtering: true,
      export: true,
      pagination: true,
      search: true,
      highlighting: true,
      tooltips: true,
      grouping: true,
      summary: true,
      columnResize: true,
      columnSort: true,
      freeze: true
    },
    
    // 适用场景
    usage: {
      screenSize: 'extraLarge',
      deviceType: 'desktop',
      networkSpeed: 'fast',
      dataVolume: 'massive',
      expertise: 'professional'
    },
    
    // 性能优化
    performance: {
      virtualScrolling: true,
      lazyLoading: true,
      cacheEnabled: true,
      batchSize: 500,
      debounceMs: 300
    },
    
    order: 4,
    isDefault: false,
    isRecommended: false
  },

  [DISPLAY_MODE_TYPES.ANALYSIS]: {
    key: 'analysis',
    name: '分析模式',
    shortName: '分析',
    label: '分析',
    shortLabel: '分析',
    icon: 'el-icon-data-analysis',
    description: '专注于数据分析，显示统计信息和关键指标',
    
    // 列配置
    columns: [
      'user_name',
      'table_name',
      'totalBetAmount',
      'betItemCount',
      'riskLevel',
      'sum_bet_amt_305', // 大
      'sum_bet_amt_304', // 小
      'sum_bet_amt_340', // 任意三连
      'created_at',
      'close_status'
    ],
    columnCount: 10,
    
    // 分组配置
    columnGroups: [
      {
        title: '基础信息',
        columns: ['user_name', 'table_name']
      },
      {
        title: '统计分析',
        columns: ['totalBetAmount', 'betItemCount', 'riskLevel']
      },
      {
        title: '关键投注',
        columns: ['sum_bet_amt_305', 'sum_bet_amt_304', 'sum_bet_amt_340']
      },
      {
        title: '时间状态',
        columns: ['created_at', 'close_status']
      }
    ],
    
    // 尺寸配置
    minWidth: 900,
    maxWidth: 1200,
    idealWidth: 1050,
    
    // 视觉配置
    color: '#722ed1',
    bgColor: '#f9f0ff',
    borderColor: '#d3adf7',
    
    // 功能特性
    features: {
      realtime: true,
      sorting: true,
      filtering: true,
      export: true,
      pagination: true,
      search: true,
      highlighting: true,
      tooltips: true,
      analytics: true,
      charts: true,
      statistics: true
    },
    
    // 适用场景
    usage: {
      screenSize: 'large',
      deviceType: 'desktop',
      networkSpeed: 'fast',
      dataVolume: 'high',
      purpose: 'analysis'
    },
    
    // 性能优化
    performance: {
      virtualScrolling: false,
      lazyLoading: false,
      cacheEnabled: true,
      batchSize: 150
    },
    
    order: 5,
    isDefault: false,
    isRecommended: false
  }
}

// 响应式显示模式配置
export const RESPONSIVE_MODES = {
  mobile: {
    maxWidth: 767,
    recommendedMode: DISPLAY_MODE_TYPES.COMPACT,
    fallbackMode: DISPLAY_MODE_TYPES.COMPACT,
    features: {
      touchOptimized: true,
      swipeSupport: true,
      largerButtons: true,
      simplifiedUI: true
    }
  },
  
  tablet: {
    minWidth: 768,
    maxWidth: 1023,
    recommendedMode: DISPLAY_MODE_TYPES.OVERVIEW,
    fallbackMode: DISPLAY_MODE_TYPES.COMPACT,
    features: {
      touchOptimized: true,
      mediumDensity: true
    }
  },
  
  desktop: {
    minWidth: 1024,
    maxWidth: 1439,
    recommendedMode: DISPLAY_MODE_TYPES.DETAILED,
    fallbackMode: DISPLAY_MODE_TYPES.OVERVIEW,
    features: {
      fullFeatures: true,
      highDensity: true
    }
  },
  
  largeDesktop: {
    minWidth: 1440,
    recommendedMode: DISPLAY_MODE_TYPES.COMPLETE,
    fallbackMode: DISPLAY_MODE_TYPES.DETAILED,
    features: {
      maxFeatures: true,
      ultraHighDensity: true,
      multiColumn: true
    }
  }
}

// 显示模式切换规则
export const MODE_SWITCH_RULES = {
  // 自动切换规则
  auto: {
    enabled: false,
    conditions: {
      screenResize: true,
      dataVolumeChange: false,
      performanceIssue: true
    }
  },
  
  // 用户偏好保存
  userPreference: {
    saveToLocalStorage: true,
    key: 'sicbo_display_mode_preference',
    respectSystemSettings: true
  },
  
  // 性能优化切换
  performance: {
    enabled: true,
    thresholds: {
      dataCount: 1000,
      renderTime: 2000, // ms
      memoryUsage: 100 // MB
    },
    fallbackMode: DISPLAY_MODE_TYPES.COMPACT
  }
}

// 显示模式功能映射
export const MODE_FEATURES = {
  realtime: {
    description: '实时数据更新',
    impact: 'performance',
    supportedModes: ['compact', 'overview', 'detailed', 'complete', 'analysis']
  },
  
  sorting: {
    description: '列排序功能',
    impact: 'usability',
    supportedModes: ['compact', 'overview', 'detailed', 'complete', 'analysis']
  },
  
  filtering: {
    description: '数据筛选功能',
    impact: 'usability',
    supportedModes: ['overview', 'detailed', 'complete', 'analysis']
  },
  
  export: {
    description: '数据导出功能',
    impact: 'functionality',
    supportedModes: ['overview', 'detailed', 'complete', 'analysis']
  },
  
  highlighting: {
    description: '数据高亮显示',
    impact: 'visual',
    supportedModes: ['overview', 'detailed', 'complete', 'analysis']
  },
  
  grouping: {
    description: '列分组功能',
    impact: 'organization',
    supportedModes: ['detailed', 'complete']
  },
  
  analytics: {
    description: '数据分析功能',
    impact: 'intelligence',
    supportedModes: ['analysis']
  }
}

// 模式切换动画配置
export const MODE_TRANSITIONS = {
  duration: 300,
  easing: 'ease-in-out',
  effects: {
    columnResize: true,
    fadeInOut: true,
    slideEffect: false
  }
}

// 导出配置工具函数
export const getModeConfig = (modeKey) => {
  return DISPLAY_MODES[modeKey] || DISPLAY_MODES[DISPLAY_MODE_TYPES.OVERVIEW]
}

export const getResponsiveMode = (screenWidth) => {
  if (screenWidth <= 767) return RESPONSIVE_MODES.mobile
  if (screenWidth <= 1023) return RESPONSIVE_MODES.tablet
  if (screenWidth <= 1439) return RESPONSIVE_MODES.desktop
  return RESPONSIVE_MODES.largeDesktop
}

export const getRecommendedMode = (screenWidth, context = {}) => {
  const responsive = getResponsiveMode(screenWidth)
  
  // 考虑特殊上下文
  if (context.purpose === 'analysis') {
    return DISPLAY_MODE_TYPES.ANALYSIS
  }
  
  if (context.dataVolume === 'low') {
    return DISPLAY_MODE_TYPES.COMPACT
  }
  
  return responsive.recommendedMode
}

// 验证模式是否可用
export const isModeAvailable = (modeKey, context = {}) => {
  const mode = getModeConfig(modeKey)
  if (!mode) return false
  
  // 检查屏幕宽度要求
  if (context.screenWidth && context.screenWidth < mode.minWidth) {
    return false
  }
  
  // 检查设备类型要求
  if (context.deviceType && mode.usage.deviceType !== context.deviceType) {
    return false
  }
  
  return true
}

// 默认导出
export default {
  DISPLAY_MODES,
  DISPLAY_MODE_TYPES,
  RESPONSIVE_MODES,
  MODE_SWITCH_RULES,
  MODE_FEATURES,
  MODE_TRANSITIONS,
  getModeConfig,
  getResponsiveMode,
  getRecommendedMode,
  isModeAvailable
}