/**
 * 三公9个投注项映射配置
 * 基于数据库表 ntp_dianji_game_peilv (game_type_id = 8)
 */

// 投注类型映射
export const THREE_BET_MAPPING = {
  // 翻倍区域 (3项)
  40: {
    name: '三公翻倍闲1',
    shortName: '翻倍闲1',
    category: 'double',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 1,
    odds: '0.95:1',
    description: '三公翻倍闲1位置'
  },
  42: {
    name: '三公翻倍闲2',
    shortName: '翻倍闲2',
    category: 'double',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 2,
    odds: '0.95:1',
    description: '三公翻倍闲2位置'
  },
  44: {
    name: '三公翻倍闲3',
    shortName: '翻倍闲3',
    category: 'double',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 3,
    odds: '0.95:1',
    description: '三公翻倍闲3位置'
  },

  // 平倍区域 (3项)
  41: {
    name: '三公平倍闲1',
    shortName: '平倍闲1',
    category: 'normal',
    color: '#409eff',
    bgColor: '#ecf5ff',
    order: 1,
    odds: '1:1',
    description: '三公平倍闲1位置'
  },
  43: {
    name: '三公平倍闲2',
    shortName: '平倍闲2',
    category: 'normal',
    color: '#409eff',
    bgColor: '#ecf5ff',
    order: 2,
    odds: '1:1',
    description: '三公平倍闲2位置'
  },
  45: {
    name: '三公平倍闲3',
    shortName: '平倍闲3',
    category: 'normal',
    color: '#409eff',
    bgColor: '#ecf5ff',
    order: 3,
    odds: '1:1',
    description: '三公平倍闲3位置'
  },

  // 超级区域 (3项)
  46: {
    name: '三公超级闲1',
    shortName: '超级闲1',
    category: 'super',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 1,
    odds: '0.95:1',
    description: '三公超级闲1位置'
  },
  47: {
    name: '三公超级闲2',
    shortName: '超级闲2',
    category: 'super',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 2,
    odds: '0.95:1',
    description: '三公超级闲2位置'
  },
  48: {
    name: '三公超级闲3',
    shortName: '超级闲3',
    category: 'super',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 3,
    odds: '0.95:1',
    description: '三公超级闲3位置'
  }
}

// 投注类别配置
export const THREE_CATEGORIES = {
  double: {
    name: '翻倍区域',
    shortName: '翻倍',
    description: '三公翻倍投注区域',
    color: '#f56c6c',
    order: 1,
    items: [40, 42, 44]
  },
  normal: {
    name: '平倍区域',
    shortName: '平倍',
    description: '三公平倍投注区域',
    color: '#409eff',
    order: 2,
    items: [41, 43, 45]
  },
  super: {
    name: '超级区域',
    shortName: '超级',
    description: '三公超级投注区域',
    color: '#722ed1',
    order: 3,
    items: [46, 47, 48]
  }
}

// 状态映射 (与其他游戏相同)
export const STATUS_MAPPING = {
  1: { text: '待开牌', type: 'warning', color: '#e6a23c' },
  2: { text: '已结算', type: 'success', color: '#67c23a' },
  3: { text: '台面作废', type: 'danger', color: '#f56c6c' },
  4: { text: '修改结果', type: 'info', color: '#909399' }
}

// 三公特有的结果映射
export const THREE_RESULTS = {
  banker: { text: '庄赢', color: '#f56c6c' },
  player1: { text: '闲1赢', color: '#409eff' },
  player2: { text: '闲2赢', color: '#67c23a' },
  player3: { text: '闲3赢', color: '#722ed1' }
}