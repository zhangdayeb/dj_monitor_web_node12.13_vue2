/**
 * 龙虎3个投注项映射配置
 * 基于数据库表 ntp_dianji_game_peilv (game_type_id = 2)
 */

// 投注类型映射
export const DRAGON_BET_MAPPING = {
  // 基础区域 (3项)
  20: {
    name: '龙',
    shortName: '龙',
    category: 'basic',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 1,
    odds: '0.97:1',
    description: '龙牌获胜'
  },
  21: {
    name: '虎',
    shortName: '虎',
    category: 'basic',
    color: '#409eff',
    bgColor: '#ecf5ff',
    order: 2,
    odds: '0.97:1',
    description: '虎牌获胜'
  },
  22: {
    name: '和',
    shortName: '和',
    category: 'basic',
    color: '#67c23a',
    bgColor: '#f0f9ff',
    order: 3,
    odds: '8:1',
    description: '龙虎平局'
  }
}

// 投注类别配置 (龙虎只有一个基础类别)
export const DRAGON_CATEGORIES = {
  basic: {
    name: '基础区域',
    shortName: '基础',
    description: '龙、虎、和基础投注',
    color: '#409eff',
    order: 1,
    items: [20, 21, 22]
  }
}

// 状态映射 (与其他游戏相同)
export const STATUS_MAPPING = {
  1: { text: '待开牌', type: 'warning', color: '#e6a23c' },
  2: { text: '已结算', type: 'success', color: '#67c23a' },
  3: { text: '台面作废', type: 'danger', color: '#f56c6c' },
  4: { text: '修改结果', type: 'info', color: '#909399' }
}

// 龙虎特有的结果映射
export const DRAGON_RESULTS = {
  dragon: { text: '龙赢', color: '#f56c6c' },
  tiger: { text: '虎赢', color: '#409eff' },
  tie: { text: '和局', color: '#67c23a' }
}