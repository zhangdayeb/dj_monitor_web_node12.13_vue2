/**
 * 百家乐10个投注项映射配置
 * 基于数据库表 ntp_dianji_game_peilv (game_type_id = 3)
 */

// 投注类型映射
export const BACCARAT_BET_MAPPING = {
  // 基础区域 (3项)
  8: {
    name: '庄',
    shortName: '庄',
    category: 'basic',
    color: '#409eff',
    bgColor: '#ecf5ff',
    order: 1,
    odds: '1:1/0.95:1',
    description: '庄家获胜'
  },
  6: {
    name: '闲',
    shortName: '闲',
    category: 'basic',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 2,
    odds: '1:1',
    description: '闲家获胜'
  },
  7: {
    name: '和',
    shortName: '和',
    category: 'basic',
    color: '#67c23a',
    bgColor: '#f0f9ff',
    order: 3,
    odds: '8:1',
    description: '庄闲平局'
  },

  // 对子区域 (2项)
  4: {
    name: '庄对',
    shortName: '庄对',
    category: 'pair',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 1,
    odds: '11:1',
    description: '庄家前两张牌为对子'
  },
  2: {
    name: '闲对',
    shortName: '闲对',
    category: 'pair',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    order: 2,
    odds: '11:1',
    description: '闲家前两张牌为对子'
  },

  // 特殊区域 (5项)
  3: {
    name: '幸运6',
    shortName: '幸运6',
    category: 'special',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    order: 1,
    odds: '12:1/20:1',
    description: '庄家以6点获胜'
  },
  9: {
    name: '龙7',
    shortName: '龙7',
    category: 'special',
    color: '#cf1322',
    bgColor: '#fff1f0',
    order: 2,
    odds: '40:1',
    description: '特殊组合龙7'
  },
  10: {
    name: '熊8',
    shortName: '熊8',
    category: 'special',
    color: '#1890ff',
    bgColor: '#f0f5ff',
    order: 3,
    odds: '25:1',
    description: '特殊组合熊8'
  },
  11: {
    name: '大老虎',
    shortName: '大虎',
    category: 'special',
    color: '#52c41a',
    bgColor: '#f6ffed',
    order: 4,
    odds: '50:1',
    description: '特殊组合大老虎'
  },
  12: {
    name: '小老虎',
    shortName: '小虎',
    category: 'special',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 5,
    odds: '22:1',
    description: '特殊组合小老虎'
  }
}

// 投注类别配置
export const BACCARAT_CATEGORIES = {
  basic: {
    name: '基础区域',
    shortName: '基础',
    description: '庄、闲、和基础投注',
    color: '#409eff',
    order: 1,
    items: [8, 6, 7]
  },
  pair: {
    name: '对子区域',
    shortName: '对子',
    description: '庄对、闲对投注',
    color: '#722ed1',
    order: 2,
    items: [4, 2]
  },
  special: {
    name: '特殊区域',
    shortName: '特殊',
    description: '幸运6、龙虎、老虎等特殊投注',
    color: '#fa8c16',
    order: 3,
    items: [3, 9, 10, 11, 12]
  }
}

// 状态映射 (与骰宝相同)
export const STATUS_MAPPING = {
  1: { text: '待开牌', type: 'warning', color: '#e6a23c' },
  2: { text: '已结算', type: 'success', color: '#67c23a' },
  3: { text: '台面作废', type: 'danger', color: '#f56c6c' },
  4: { text: '修改结果', type: 'info', color: '#909399' }
}

// 百家乐特有的结果映射
export const BACCARAT_RESULTS = {
  banker: { text: '庄赢', color: '#409eff' },
  player: { text: '闲赢', color: '#f56c6c' },
  tie: { text: '和局', color: '#67c23a' },
  banker_pair: { text: '庄对', color: '#722ed1' },
  player_pair: { text: '闲对', color: '#e6a23c' }
}