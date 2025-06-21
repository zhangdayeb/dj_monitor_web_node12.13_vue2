/**
 * 抢庄牛牛投注项映射配置
 * 基于数据库表 ntp_dianji_game_peilv (game_type_id = 5)
 */

// 投注类型映射
export const QZNN_BET_MAPPING = {
  // 基础区域 (6项)
  70: {
    name: '庄家',
    shortName: '庄',
    category: 'basic',
    color: '#409eff',
    bgColor: '#ecf5ff',
    order: 1,
    odds: '1:1',
    description: '庄家获胜'
  },
  71: {
    name: '闲家1',
    shortName: '闲1',
    category: 'basic',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 2,
    odds: '1:1',
    description: '闲家1获胜'
  },
  72: {
    name: '闲家2',
    shortName: '闲2',
    category: 'basic',
    color: '#67c23a',
    bgColor: '#f0f9ff',
    order: 3,
    odds: '1:1',
    description: '闲家2获胜'
  },
  73: {
    name: '闲家3',
    shortName: '闲3',
    category: 'basic',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    order: 4,
    odds: '1:1',
    description: '闲家3获胜'
  },
  74: {
    name: '闲家4',
    shortName: '闲4',
    category: 'basic',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 5,
    odds: '1:1',
    description: '闲家4获胜'
  },
  75: {
    name: '闲家5',
    shortName: '闲5',
    category: 'basic',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 6,
    odds: '1:1',
    description: '闲家5获胜'
  },

  // 抢庄区域 (6项)
  76: {
    name: '庄家抢庄',
    shortName: '庄抢庄',
    category: 'grab',
    color: '#1890ff',
    bgColor: '#f0f5ff',
    order: 1,
    odds: '2:1',
    description: '庄家抢庄成功'
  },
  77: {
    name: '闲1抢庄',
    shortName: '闲1抢庄',
    category: 'grab',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    order: 2,
    odds: '2:1',
    description: '闲家1抢庄成功'
  },
  78: {
    name: '闲2抢庄',
    shortName: '闲2抢庄',
    category: 'grab',
    color: '#52c41a',
    bgColor: '#f6ffed',
    order: 3,
    odds: '2:1',
    description: '闲家2抢庄成功'
  },
  79: {
    name: '闲3抢庄',
    shortName: '闲3抢庄',
    category: 'grab',
    color: '#eb2f96',
    bgColor: '#fff0f6',
    order: 4,
    odds: '2:1',
    description: '闲家3抢庄成功'
  },
  80: {
    name: '闲4抢庄',
    shortName: '闲4抢庄',
    category: 'grab',
    color: '#2f54eb',
    bgColor: '#f0f5ff',
    order: 5,
    odds: '2:1',
    description: '闲家4抢庄成功'
  },
  81: {
    name: '闲5抢庄',
    shortName: '闲5抢庄',
    category: 'grab',
    color: '#08979c',
    bgColor: '#e6fffb',
    order: 6,
    odds: '2:1',
    description: '闲家5抢庄成功'
  },

  // 特殊投注区域 (12项)
  82: {
    name: '庄牛牛',
    shortName: '庄牛牛',
    category: 'special',
    color: '#1890ff',
    bgColor: '#f0f5ff',
    order: 1,
    odds: '4:1',
    description: '庄家牛牛'
  },
  83: {
    name: '闲1牛牛',
    shortName: '闲1牛牛',
    category: 'special',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    order: 2,
    odds: '4:1',
    description: '闲家1牛牛'
  },
  84: {
    name: '闲2牛牛',
    shortName: '闲2牛牛',
    category: 'special',
    color: '#52c41a',
    bgColor: '#f6ffed',
    order: 3,
    odds: '4:1',
    description: '闲家2牛牛'
  },
  85: {
    name: '闲3牛牛',
    shortName: '闲3牛牛',
    category: 'special',
    color: '#eb2f96',
    bgColor: '#fff0f6',
    order: 4,
    odds: '4:1',
    description: '闲家3牛牛'
  },
  86: {
    name: '闲4牛牛',
    shortName: '闲4牛牛',
    category: 'special',
    color: '#2f54eb',
    bgColor: '#f0f5ff',
    order: 5,
    odds: '4:1',
    description: '闲家4牛牛'
  },
  87: {
    name: '闲5牛牛',
    shortName: '闲5牛牛',
    category: 'special',
    color: '#08979c',
    bgColor: '#e6fffb',
    order: 6,
    odds: '4:1',
    description: '闲家5牛牛'
  },
  88: {
    name: '庄对子',
    shortName: '庄对',
    category: 'special',
    color: '#cf1322',
    bgColor: '#fff1f0',
    order: 7,
    odds: '11:1',
    description: '庄家对子'
  },
  89: {
    name: '闲1对子',
    shortName: '闲1对',
    category: 'special',
    color: '#fa541c',
    bgColor: '#fff2e8',
    order: 8,
    odds: '11:1',
    description: '闲家1对子'
  },
  90: {
    name: '闲2对子',
    shortName: '闲2对',
    category: 'special',
    color: '#389e0d',
    bgColor: '#f6ffed',
    order: 9,
    odds: '11:1',
    description: '闲家2对子'
  },
  91: {
    name: '闲3对子',
    shortName: '闲3对',
    category: 'special',
    color: '#c41d7f',
    bgColor: '#fff0f6',
    order: 10,
    odds: '11:1',
    description: '闲家3对子'
  },
  92: {
    name: '闲4对子',
    shortName: '闲4对',
    category: 'special',
    color: '#1d39c4',
    bgColor: '#f0f5ff',
    order: 11,
    odds: '11:1',
    description: '闲家4对子'
  },
  93: {
    name: '闲5对子',
    shortName: '闲5对',
    category: 'special',
    color: '#096dd9',
    bgColor: '#e6f7ff',
    order: 12,
    odds: '11:1',
    description: '闲家5对子'
  }
}

// 投注类别配置
export const QZNN_CATEGORIES = {
  basic: {
    name: '基础区域',
    shortName: '基础',
    description: '庄家和5个闲家基础投注',
    color: '#409eff',
    order: 1,
    items: [70, 71, 72, 73, 74, 75]
  },
  grab: {
    name: '抢庄区域',
    shortName: '抢庄',
    description: '各位置抢庄投注',
    color: '#722ed1',
    order: 2,
    items: [76, 77, 78, 79, 80, 81]
  },
  special: {
    name: '特殊区域',
    shortName: '特殊',
    description: '牛牛和对子特殊投注',
    color: '#fa8c16',
    order: 3,
    items: [82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93]
  }
}

// 状态映射 (与其他游戏相同)
export const STATUS_MAPPING = {
  1: { text: '待开牌', type: 'warning', color: '#e6a23c' },
  2: { text: '已结算', type: 'success', color: '#67c23a' },
  3: { text: '台面作废', type: 'danger', color: '#f56c6c' },
  4: { text: '修改结果', type: 'info', color: '#909399' }
}

// 抢庄牛牛特有的结果映射
export const QZNN_RESULTS = {
  banker: { text: '庄赢', color: '#409eff' },
  player1: { text: '闲1赢', color: '#f56c6c' },
  player2: { text: '闲2赢', color: '#67c23a' },
  player3: { text: '闲3赢', color: '#e6a23c' },
  player4: { text: '闲4赢', color: '#722ed1' },
  player5: { text: '闲5赢', color: '#13c2c2' },
  banker_grab: { text: '庄抢庄', color: '#1890ff' },
  player_grab: { text: '闲抢庄', color: '#fa8c16' },
  banker_bull: { text: '庄牛牛', color: '#1890ff' },
  player_bull: { text: '闲牛牛', color: '#fa8c16' },
  pair: { text: '对子', color: '#52c41a' }
}