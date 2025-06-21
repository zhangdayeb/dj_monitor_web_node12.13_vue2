/**
 * 骰宝投注项目映射关系
 * 定义投注ID与数据库字段、显示名称、赔率等的映射关系
 */

// 基础投注区域映射 (304-307)
export const BASIC_MAPPING = {
  small: {
    id: 304,
    prop: 'sum_bet_amt_304',
    label: '小',
    name: '小',
    fullName: '小(4-10)',
    description: '三颗骰子点数总和4-10',
    odds: '1:1',
    payout: 1,
    probability: 48.61,
    houseEdge: 2.78,
    category: 'basic',
    group: '基础区域',
    color: '#67c23a',
    bgColor: '#f0f9ff',
    icon: 'el-icon-bottom',
    order: 1,
    range: { min: 4, max: 10 },
    excludeTriples: true
  },
  
  big: {
    id: 305,
    prop: 'sum_bet_amt_305',
    label: '大',
    name: '大',
    fullName: '大(11-17)',
    description: '三颗骰子点数总和11-17',
    odds: '1:1',
    payout: 1,
    probability: 48.61,
    houseEdge: 2.78,
    category: 'basic',
    group: '基础区域',
    color: '#409eff',
    bgColor: '#ecf5ff',
    icon: 'el-icon-top',
    order: 2,
    range: { min: 11, max: 17 },
    excludeTriples: true
  },
  
  odd: {
    id: 306,
    prop: 'sum_bet_amt_306',
    label: '单',
    name: '单',
    fullName: '单数',
    description: '三颗骰子点数总和为单数',
    odds: '1:1',
    payout: 1,
    probability: 48.61,
    houseEdge: 2.78,
    category: 'basic',
    group: '基础区域',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    icon: 'el-icon-minus',
    order: 3,
    excludeTriples: true
  },
  
  even: {
    id: 307,
    prop: 'sum_bet_amt_307',
    label: '双',
    name: '双',
    fullName: '双数',
    description: '三颗骰子点数总和为双数',
    odds: '1:1',
    payout: 1,
    probability: 48.61,
    houseEdge: 2.78,
    category: 'basic',
    group: '基础区域',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    icon: 'el-icon-plus',
    order: 4,
    excludeTriples: true
  }
}

// 总和投注区域映射 (308-321) 对应总和4-17
export const TOTAL_MAPPING = (() => {
  const mapping = {}
  
  // 总和4-17的详细配置
  const totalConfigs = {
    4: { 
      odds: '60:1', payout: 60, probability: 1.39, combinations: 3,
      diceCombo: [[1,1,2], [1,2,1], [2,1,1]], icon: 'el-icon-star-on'
    },
    5: { 
      odds: '30:1', payout: 30, probability: 2.78, combinations: 6,
      diceCombo: [[1,1,3], [1,2,2], [1,3,1], [2,1,2], [2,2,1], [3,1,1]], icon: 'el-icon-star-on'
    },
    6: { 
      odds: '17:1', payout: 17, probability: 4.63, combinations: 10,
      icon: 'el-icon-star-off'
    },
    7: { 
      odds: '12:1', payout: 12, probability: 6.94, combinations: 15,
      icon: 'el-icon-star-off'
    },
    8: { 
      odds: '8:1', payout: 8, probability: 9.72, combinations: 21,
      icon: 'el-icon-circle-check'
    },
    9: { 
      odds: '6:1', payout: 6, probability: 11.57, combinations: 25,
      icon: 'el-icon-circle-check'
    },
    10: { 
      odds: '6:1', payout: 6, probability: 12.50, combinations: 27,
      icon: 'el-icon-circle-check'
    },
    11: { 
      odds: '6:1', payout: 6, probability: 12.50, combinations: 27,
      icon: 'el-icon-circle-check'
    },
    12: { 
      odds: '6:1', payout: 6, probability: 12.50, combinations: 25,
      icon: 'el-icon-circle-check'
    },
    13: { 
      odds: '6:1', payout: 6, probability: 11.57, combinations: 21,
      icon: 'el-icon-circle-check'
    },
    14: { 
      odds: '8:1', payout: 8, probability: 9.72, combinations: 15,
      icon: 'el-icon-star-off'
    },
    15: { 
      odds: '12:1', payout: 12, probability: 6.94, combinations: 10,
      icon: 'el-icon-star-off'
    },
    16: { 
      odds: '17:1', payout: 17, probability: 4.63, combinations: 6,
      icon: 'el-icon-star-off'
    },
    17: { 
      odds: '30:1', payout: 30, probability: 2.78, combinations: 3,
      diceCombo: [[5,6,6], [6,5,6], [6,6,5]], icon: 'el-icon-star-on'
    }
  }
  
  for (let sum = 4; sum <= 17; sum++) {
    const betId = 308 + (sum - 4)
    const config = totalConfigs[sum]
    
    // 计算庄家优势
    const houseEdge = ((216 - config.combinations * (config.payout + 1)) / 216 * 100).toFixed(2)
    
    // 确定风险等级
    let riskLevel = 'low'
    if (config.payout >= 50) riskLevel = 'extreme'
    else if (config.payout >= 15) riskLevel = 'high'
    else if (config.payout >= 8) riskLevel = 'medium'
    
    // 确定颜色
    let color = '#67c23a' // 低风险绿色
    if (riskLevel === 'extreme') color = '#f56c6c'
    else if (riskLevel === 'high') color = '#e6a23c'
    else if (riskLevel === 'medium') color = '#409eff'
    
    mapping[`total_${sum}`] = {
      id: betId,
      prop: `sum_bet_amt_${betId}`,
      label: `和${sum}`,
      name: `总和${sum}`,
      fullName: `点数总和${sum}`,
      description: `三颗骰子点数总和为${sum}`,
      totalSum: sum,
      odds: config.odds,
      payout: config.payout,
      probability: config.probability,
      combinations: config.combinations,
      houseEdge: parseFloat(houseEdge),
      category: 'total',
      group: '总和区域',
      riskLevel,
      color,
      bgColor: riskLevel === 'extreme' ? '#fef0f0' : '#f0f9ff',
      icon: config.icon,
      order: sum,
      diceCombo: config.diceCombo || [],
      isHighOdds: config.payout >= 10,
      isExtremeOdds: config.payout >= 30
    }
  }
  
  return mapping
})()

// 单骰投注区域映射 (322-327) 对应单骰1-6
export const SINGLE_MAPPING = (() => {
  const mapping = {}
  
  for (let num = 1; num <= 6; num++) {
    const betId = 322 + (num - 1)
    
    mapping[`single_${num}`] = {
      id: betId,
      prop: `sum_bet_amt_${betId}`,
      label: `单${num}`,
      name: `单骰${num}`,
      fullName: `单骰点数${num}`,
      description: `至少有一颗骰子显示${num}`,
      diceNumber: num,
      odds: '1:1',
      payout: 1,
      probability: 42.13,
      houseEdge: 7.87,
      category: 'single',
      group: '单骰区域',
      color: '#409eff',
      bgColor: '#ecf5ff',
      icon: 'el-icon-circle-check',
      order: num,
      combinations: 91, // 216个组合中的91个
      winConditions: [
        `出现一个${num}`,
        `出现两个${num}`,
        `出现三个${num}`
      ]
    }
  }
  
  return mapping
})()

// 对子投注区域映射 (328-333) 对应对子1-6
export const PAIR_MAPPING = (() => {
  const mapping = {}
  
  for (let num = 1; num <= 6; num++) {
    const betId = 328 + (num - 1)
    
    mapping[`pair_${num}`] = {
      id: betId,
      prop: `sum_bet_amt_${betId}`,
      label: `对${num}`,
      name: `对子${num}`,
      fullName: `${num}${num}对子`,
      description: `至少有两颗骰子显示${num}`,
      diceNumber: num,
      odds: '10:1',
      payout: 10,
      probability: 7.41,
      houseEdge: 18.52,
      category: 'pair',
      group: '对子区域',
      riskLevel: 'medium',
      color: '#e6a23c',
      bgColor: '#fdf6ec',
      icon: 'el-icon-copy-document',
      order: num,
      combinations: 16, // 包含对子和三连的情况
      isHighOdds: true,
      winConditions: [
        `出现两个${num}`,
        `出现三个${num}`
      ]
    }
  }
  
  return mapping
})()

// 三连投注区域映射 (334-340) 对应三连1-6 + 任意三连
export const TRIPLE_MAPPING = (() => {
  const mapping = {}
  
  // 具体三连 1-6
  for (let num = 1; num <= 6; num++) {
    const betId = 334 + (num - 1)
    
    mapping[`triple_${num}`] = {
      id: betId,
      prop: `sum_bet_amt_${betId}`,
      label: `三${num}`,
      name: `三连${num}`,
      fullName: `${num}${num}${num}三连`,
      description: `三颗骰子都显示${num}`,
      diceNumber: num,
      odds: '180:1',
      payout: 180,
      probability: 0.46,
      houseEdge: 16.67,
      category: 'triple',
      group: '三连区域',
      riskLevel: 'extreme',
      color: '#f56c6c',
      bgColor: '#fef0f0',
      icon: 'el-icon-star-on',
      order: num,
      combinations: 1,
      isHighOdds: true,
      isExtremeOdds: true,
      winConditions: [`三颗骰子都是${num}`]
    }
  }
  
  // 任意三连
  mapping['triple_any'] = {
    id: 340,
    prop: 'sum_bet_amt_340',
    label: '任意三连',
    name: '任意三连',
    fullName: '任意数字三连',
    description: '任意数字的三连组合',
    odds: '30:1',
    payout: 30,
    probability: 2.78,
    houseEdge: 13.89,
    category: 'triple',
    group: '三连区域',
    riskLevel: 'high',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    icon: 'el-icon-star-off',
    order: 7,
    combinations: 6,
    isHighOdds: true,
    winConditions: [
      '三颗骰子都是1',
      '三颗骰子都是2',
      '三颗骰子都是3',
      '三颗骰子都是4',
      '三颗骰子都是5',
      '三颗骰子都是6'
    ]
  }
  
  return mapping
})()

// 组合映射 - 将所有投注类型合并
export const SICBO_MAPPING = {
  basic: BASIC_MAPPING,
  total: TOTAL_MAPPING,
  single: SINGLE_MAPPING,
  pair: PAIR_MAPPING,
  triple: TRIPLE_MAPPING
}

// 投注ID映射表 - 快速查找
export const BET_ID_MAPPING = (() => {
  const idMapping = {}
  
  Object.values(SICBO_MAPPING).forEach(category => {
    Object.values(category).forEach(bet => {
      idMapping[bet.id] = bet
    })
  })
  
  return idMapping
})()

// 属性名映射表 - 根据数据库字段名查找
export const PROP_MAPPING = (() => {
  const propMapping = {}
  
  Object.values(SICBO_MAPPING).forEach(category => {
    Object.values(category).forEach(bet => {
      propMapping[bet.prop] = bet
    })
  })
  
  return propMapping
})()

// 投注类别配置
export const BETTING_CATEGORIES = {
  basic: {
    name: '基础投注',
    description: '大小单双基础投注区域',
    color: '#409eff',
    order: 1,
    riskLevel: 'low',
    averageOdds: '1:1',
    popularity: 'high'
  },
  
  total: {
    name: '总和投注',
    description: '三颗骰子点数总和投注',
    color: '#67c23a',
    order: 2,
    riskLevel: 'varied',
    averageOdds: '6:1-60:1',
    popularity: 'medium'
  },
  
  single: {
    name: '单骰投注',
    description: '单个骰子点数投注',
    color: '#e6a23c',
    order: 3,
    riskLevel: 'low',
    averageOdds: '1:1',
    popularity: 'medium'
  },
  
  pair: {
    name: '对子投注',
    description: '两个相同点数投注',
    color: '#f56c6c',
    order: 4,
    riskLevel: 'medium',
    averageOdds: '10:1',
    popularity: 'low'
  },
  
  triple: {
    name: '三连投注',
    description: '三个相同点数投注',
    color: '#c45656',
    order: 5,
    riskLevel: 'high',
    averageOdds: '30:1-180:1',
    popularity: 'low'
  }
}

// 风险等级配置
export const RISK_LEVELS = {
  low: {
    name: '低风险',
    color: '#67c23a',
    bgColor: '#f0f9ff',
    description: '赔率较低，胜率较高',
    maxPayout: 1,
    minProbability: 40
  },
  
  medium: {
    name: '中风险',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    description: '赔率适中，胜率一般',
    maxPayout: 15,
    minProbability: 5
  },
  
  high: {
    name: '高风险',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    description: '赔率较高，胜率较低',
    maxPayout: 50,
    minProbability: 1
  },
  
  extreme: {
    name: '极高风险',
    color: '#c45656',
    bgColor: '#fdf2f2',
    description: '赔率极高，胜率极低',
    maxPayout: 180,
    minProbability: 0.5
  }
}

// 工具函数
export const getBetById = (betId) => {
  return BET_ID_MAPPING[betId] || null
}

export const getBetByProp = (propName) => {
  return PROP_MAPPING[propName] || null
}

export const getBetsByCategory = (category) => {
  return SICBO_MAPPING[category] || {}
}

export const getAllBets = () => {
  const allBets = []
  Object.values(SICBO_MAPPING).forEach(category => {
    allBets.push(...Object.values(category))
  })
  return allBets.sort((a, b) => a.order - b.order)
}

export const getHighOddsBets = () => {
  return getAllBets().filter(bet => bet.isHighOdds)
}

export const getBetsByRiskLevel = (riskLevel) => {
  return getAllBets().filter(bet => bet.riskLevel === riskLevel)
}

export const calculateTotalPayout = (bets, amounts) => {
  let totalPayout = 0
  bets.forEach(bet => {
    const amount = amounts[bet.prop] || 0
    if (amount > 0) {
      totalPayout += amount * bet.payout
    }
  })
  return totalPayout
}

// 验证投注组合
export const validateBetCombination = (betAmounts) => {
  const warnings = []
  const conflicts = []
  
  // 检查冲突投注（如大小同时投注）
  if (betAmounts.sum_bet_amt_305 > 0 && betAmounts.sum_bet_amt_304 > 0) {
    conflicts.push('不能同时投注大和小')
  }
  
  if (betAmounts.sum_bet_amt_306 > 0 && betAmounts.sum_bet_amt_307 > 0) {
    conflicts.push('不能同时投注单和双')
  }
  
  return { warnings, conflicts }
}

// 默认导出
export default {
  SICBO_MAPPING,
  BET_ID_MAPPING,
  PROP_MAPPING,
  BETTING_CATEGORIES,
  RISK_LEVELS,
  getBetById,
  getBetByProp,
  getBetsByCategory,
  getAllBets,
  getHighOddsBets,
  getBetsByRiskLevel,
  calculateTotalPayout,
  validateBetCombination
}