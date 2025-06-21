/**
 * 表格列配置常量
 * 定义各种显示模式下的列配置
 */

// 固定列配置 - 始终显示的基础信息列
export const FIXED_COLUMNS = {
  user_name: {
    prop: 'user_name',
    label: '用户名',
    width: 120,
    fixed: 'left',
    type: 'user',
    sortable: true,
    resizable: true,
    showOverflowTooltip: true,
    required: true,
    category: 'base',
    order: 1
  },
  
  table_name: {
    prop: 'table_name',
    label: '台桌',
    width: 100,
    fixed: 'left',
    type: 'table',
    sortable: true,
    showOverflowTooltip: true,
    required: true,
    category: 'base',
    order: 2,
    filters: [
      { text: '台桌A', value: 'A' },
      { text: '台桌B', value: 'B' },
      { text: '台桌C', value: 'C' },
      { text: '台桌D', value: 'D' },
      { text: 'VIP台桌1', value: 'VIP1' },
      { text: 'VIP台桌2', value: 'VIP2' }
    ]
  },
  
  count: {
    prop: 'count',
    label: '总投注',
    width: 100,
    type: 'amount',
    sortable: true,
    align: 'right',
    headerAlign: 'center',
    required: true,
    category: 'base',
    order: 3,
    format: 'currency'
  },
  
  close_status: {
    prop: 'close_status',
    label: '状态',
    width: 80,
    fixed: 'right',
    type: 'status',
    sortable: true,
    required: true,
    category: 'base',
    order: 999,
    filters: [
      { text: '待开牌', value: 1 },
      { text: '已结算', value: 2 },
      { text: '台面作废', value: 3 },
      { text: '修改结果', value: 4 }
    ]
  }
}

// 扩展信息列配置
export const EXTENDED_COLUMNS = {
  user_id: {
    prop: 'user_id',
    label: '用户ID',
    width: 100,
    type: 'text',
    sortable: true,
    showOverflowTooltip: true,
    category: 'extended',
    order: 1.5
  },
  
  created_at: {
    prop: 'created_at',
    label: '投注时间',
    width: 140,
    type: 'time',
    sortable: true,
    category: 'extended',
    order: 10,
    format: 'datetime'
  },
  
  updated_at: {
    prop: 'updated_at',
    label: '更新时间',
    width: 140,
    type: 'time',
    sortable: true,
    category: 'extended',
    order: 11,
    format: 'datetime'
  },
  
  totalBetAmount: {
    prop: 'totalBetAmount',
    label: '投注总额',
    width: 110,
    type: 'amount',
    sortable: true,
    align: 'right',
    headerAlign: 'center',
    category: 'statistics',
    order: 4,
    format: 'currency'
  },
  
  betItemCount: {
    prop: 'betItemCount',
    label: '投注项数',
    width: 90,
    type: 'number',
    sortable: true,
    align: 'center',
    headerAlign: 'center',
    category: 'statistics',
    order: 5
  },
  
  riskLevel: {
    prop: 'riskLevel',
    label: '风险等级',
    width: 90,
    type: 'risk',
    sortable: true,
    align: 'center',
    headerAlign: 'center',
    category: 'statistics',
    order: 6
  },
  
  winAmount: {
    prop: 'win_amount',
    label: '输赢金额',
    width: 110,
    type: 'win_amount',
    sortable: true,
    align: 'right',
    headerAlign: 'center',
    category: 'statistics',
    order: 7,
    format: 'currency'
  }
}

// 基础投注区域列配置 (304-307)
export const BASIC_BET_COLUMNS = {
  sum_bet_amt_305: {
    prop: 'sum_bet_amt_305',
    label: '大',
    width: 80,
    type: 'amount',
    sortable: true,
    align: 'right',
    headerAlign: 'center',
    category: 'basic',
    betId: 305,
    betKey: 'big',
    odds: '1:1',
    probability: '48.61%',
    color: '#409eff',
    group: '基础区域',
    order: 20,
    description: '三颗骰子点数总和11-17'
  },
  
  sum_bet_amt_304: {
    prop: 'sum_bet_amt_304',
    label: '小',
    width: 80,
    type: 'amount',
    sortable: true,
    align: 'right',
    headerAlign: 'center',
    category: 'basic',
    betId: 304,
    betKey: 'small',
    odds: '1:1',
    probability: '48.61%',
    color: '#67c23a',
    group: '基础区域',
    order: 21,
    description: '三颗骰子点数总和4-10'
  },
  
  sum_bet_amt_306: {
    prop: 'sum_bet_amt_306',
    label: '单',
    width: 80,
    type: 'amount',
    sortable: true,
    align: 'right',
    headerAlign: 'center',
    category: 'basic',
    betId: 306,
    betKey: 'odd',
    odds: '1:1',
    probability: '48.61%',
    color: '#e6a23c',
    group: '基础区域',
    order: 22,
    description: '三颗骰子点数总和为单数'
  },
  
  sum_bet_amt_307: {
    prop: 'sum_bet_amt_307',
    label: '双',
    width: 80,
    type: 'amount',
    sortable: true,
    align: 'right',
    headerAlign: 'center',
    category: 'basic',
    betId: 307,
    betKey: 'even',
    odds: '1:1',
    probability: '48.61%',
    color: '#f56c6c',
    group: '基础区域',
    order: 23,
    description: '三颗骰子点数总和为双数'
  }
}

// 总和投注区域列配置 (308-321) 对应总和4-17
export const TOTAL_BET_COLUMNS = (() => {
  const columns = {}
  
  // 总和4-17的赔率和概率配置
  const totalConfig = {
    4: { odds: '60:1', probability: '1.39%', isHighOdds: true, isExtremeOdds: true },
    5: { odds: '30:1', probability: '2.78%', isHighOdds: true },
    6: { odds: '17:1', probability: '4.63%', isHighOdds: true },
    7: { odds: '12:1', probability: '6.94%', isHighOdds: true },
    8: { odds: '8:1', probability: '9.72%', isHighOdds: false },
    9: { odds: '6:1', probability: '11.57%', isHighOdds: false },
    10: { odds: '6:1', probability: '12.50%', isHighOdds: false },
    11: { odds: '6:1', probability: '12.50%', isHighOdds: false },
    12: { odds: '6:1', probability: '12.50%', isHighOdds: false },
    13: { odds: '6:1', probability: '11.57%', isHighOdds: false },
    14: { odds: '8:1', probability: '9.72%', isHighOdds: false },
    15: { odds: '12:1', probability: '6.94%', isHighOdds: true },
    16: { odds: '17:1', probability: '4.63%', isHighOdds: true },
    17: { odds: '30:1', probability: '2.78%', isHighOdds: true, isExtremeOdds: true }
  }
  
  for (let sum = 4; sum <= 17; sum++) {
    const betId = 308 + (sum - 4)
    const propName = `sum_bet_amt_${betId}`
    const config = totalConfig[sum]
    
    columns[propName] = {
      prop: propName,
      label: `和${sum}`,
      width: 70,
      type: 'amount',
      sortable: true,
      align: 'right',
      headerAlign: 'center',
      category: 'total',
      betId: betId,
      betKey: `total_${sum}`,
      totalSum: sum,
      odds: config.odds,
      probability: config.probability,
      isHighOdds: config.isHighOdds,
      isExtremeOdds: config.isExtremeOdds || false,
      group: '总和区域',
      order: 30 + sum,
      description: `三颗骰子点数总和为${sum}`
    }
  }
  
  return columns
})()

// 单骰投注区域列配置 (322-327) 对应单骰1-6
export const SINGLE_BET_COLUMNS = (() => {
  const columns = {}
  
  for (let num = 1; num <= 6; num++) {
    const betId = 322 + (num - 1)
    const propName = `sum_bet_amt_${betId}`
    
    columns[propName] = {
      prop: propName,
      label: `单${num}`,
      width: 70,
      type: 'amount',
      sortable: true,
      align: 'right',
      headerAlign: 'center',
      category: 'single',
      betId: betId,
      betKey: `single_${num}`,
      diceNumber: num,
      odds: '1:1',
      probability: '42.13%',
      group: '单骰区域',
      order: 50 + num,
      description: `至少有一颗骰子显示${num}`
    }
  }
  
  return columns
})()

// 对子投注区域列配置 (328-333) 对应对子1-6
export const PAIR_BET_COLUMNS = (() => {
  const columns = {}
  
  for (let num = 1; num <= 6; num++) {
    const betId = 328 + (num - 1)
    const propName = `sum_bet_amt_${betId}`
    
    columns[propName] = {
      prop: propName,
      label: `对${num}`,
      width: 70,
      type: 'amount',
      sortable: true,
      align: 'right',
      headerAlign: 'center',
      category: 'pair',
      betId: betId,
      betKey: `pair_${num}`,
      diceNumber: num,
      odds: '10:1',
      probability: '7.41%',
      isHighOdds: true,
      group: '对子区域',
      order: 60 + num,
      description: `至少有两颗骰子显示${num}`
    }
  }
  
  return columns
})()

// 三连投注区域列配置 (334-340) 对应三连1-6 + 任意三连
export const TRIPLE_BET_COLUMNS = (() => {
  const columns = {}
  
  // 具体三连 1-6
  for (let num = 1; num <= 6; num++) {
    const betId = 334 + (num - 1)
    const propName = `sum_bet_amt_${betId}`
    
    columns[propName] = {
      prop: propName,
      label: `三${num}`,
      width: 70,
      type: 'amount',
      sortable: true,
      align: 'right',
      headerAlign: 'center',
      category: 'triple',
      betId: betId,
      betKey: `triple_${num}`,
      diceNumber: num,
      odds: '180:1',
      probability: '0.46%',
      isHighOdds: true,
      isExtremeOdds: true,
      group: '三连区域',
      order: 70 + num,
      description: `三颗骰子都显示${num}`
    }
  }
  
  // 任意三连
  columns['sum_bet_amt_340'] = {
    prop: 'sum_bet_amt_340',
    label: '任意三连',
    width: 85,
    type: 'amount',
    sortable: true,
    align: 'right',
    headerAlign: 'center',
    category: 'triple',
    betId: 340,
    betKey: 'triple_any',
    odds: '30:1',
    probability: '2.78%',
    isHighOdds: true,
    group: '三连区域',
    order: 77,
    description: '任意数字的三连'
  }
  
  return columns
})()

// 显示模式配置
export const DISPLAY_MODE_CONFIGS = {
  compact: {
    name: '紧凑模式',
    columns: ['user_name', 'table_name', 'count', 'close_status'],
    maxWidth: 500,
    description: '最基础信息，适合小屏幕'
  },
  
  overview: {
    name: '概览模式',
    columns: [
      'user_name', 'table_name', 'count',
      'sum_bet_amt_305', 'sum_bet_amt_304', 
      'sum_bet_amt_306', 'sum_bet_amt_307',
      'close_status'
    ],
    maxWidth: 800,
    description: '基础投注区域，快速监控'
  },
  
  detailed: {
    name: '详细模式',
    columns: [
      'user_name', 'table_name', 'count',
      // 基础区域
      'sum_bet_amt_305', 'sum_bet_amt_304', 
      'sum_bet_amt_306', 'sum_bet_amt_307',
      // 热门总和
      'sum_bet_amt_308', 'sum_bet_amt_309', 'sum_bet_amt_310', // 4,5,6
      'sum_bet_amt_318', 'sum_bet_amt_319', 'sum_bet_amt_320', 'sum_bet_amt_321', // 14,15,16,17
      'close_status'
    ],
    maxWidth: 1200,
    description: '基础+热门总和区域'
  },
  
  complete: {
    name: '完整模式',
    columns: 'all', // 特殊标记，表示包含所有列
    maxWidth: 2400,
    description: '所有投注区域，完整视图'
  },
  
  analysis: {
    name: '分析模式',
    columns: [
      'user_name', 'table_name', 
      'totalBetAmount', 'betItemCount', 'riskLevel',
      'sum_bet_amt_305', 'sum_bet_amt_304',
      'sum_bet_amt_340', // 任意三连
      'created_at', 'close_status'
    ],
    maxWidth: 1000,
    description: '统计分析视图'
  }
}

// 列分组配置
export const COLUMN_GROUPS = {
  base: {
    name: '基础信息',
    description: '用户、台桌、状态等基础信息',
    color: '#303133',
    order: 1
  },
  
  statistics: {
    name: '统计信息',
    description: '投注统计、风险评估等',
    color: '#909399',
    order: 2
  },
  
  basic: {
    name: '基础投注',
    description: '大小单双基础投注区域',
    color: '#409eff',
    order: 3
  },
  
  total: {
    name: '总和投注',
    description: '点数总和投注区域',
    color: '#67c23a',
    order: 4
  },
  
  single: {
    name: '单骰投注',
    description: '单个骰子点数投注',
    color: '#e6a23c',
    order: 5
  },
  
  pair: {
    name: '对子投注',
    description: '两个相同点数投注',
    color: '#f56c6c',
    order: 6
  },
  
  triple: {
    name: '三连投注',
    description: '三个相同点数投注',
    color: '#c45656',
    order: 7
  },
  
  extended: {
    name: '扩展信息',
    description: '时间、详细信息等',
    color: '#999999',
    order: 8
  }
}

// 列属性配置
export const COLUMN_PROPERTIES = {
  // 数据类型
  types: {
    text: { align: 'left', headerAlign: 'left' },
    number: { align: 'right', headerAlign: 'center' },
    amount: { align: 'right', headerAlign: 'center', format: 'currency' },
    percentage: { align: 'right', headerAlign: 'center', format: 'percentage' },
    time: { align: 'center', headerAlign: 'center', format: 'datetime' },
    status: { align: 'center', headerAlign: 'center' },
    user: { align: 'left', headerAlign: 'left' },
    table: { align: 'center', headerAlign: 'center' },
    risk: { align: 'center', headerAlign: 'center' },
    win_amount: { align: 'right', headerAlign: 'center', format: 'currency' }
  },
  
  // 默认宽度
  defaultWidths: {
    text: 100,
    number: 80,
    amount: 80,
    percentage: 80,
    time: 140,
    status: 80,
    user: 120,
    table: 100,
    risk: 90,
    win_amount: 110
  },
  
  // 最小宽度
  minWidths: {
    text: 60,
    number: 50,
    amount: 60,
    percentage: 60,
    time: 120,
    status: 60,
    user: 80,
    table: 70,
    risk: 70,
    win_amount: 80
  }
}

// 合并所有列配置
export const ALL_COLUMNS = {
  ...FIXED_COLUMNS,
  ...EXTENDED_COLUMNS,
  ...BASIC_BET_COLUMNS,
  ...TOTAL_BET_COLUMNS,
  ...SINGLE_BET_COLUMNS,
  ...PAIR_BET_COLUMNS,
  ...TRIPLE_BET_COLUMNS
}

// 按类别分组的列配置
export const COLUMNS_BY_CATEGORY = {
  base: FIXED_COLUMNS,
  extended: EXTENDED_COLUMNS,
  basic: BASIC_BET_COLUMNS,
  total: TOTAL_BET_COLUMNS,
  single: SINGLE_BET_COLUMNS,
  pair: PAIR_BET_COLUMNS,
  triple: TRIPLE_BET_COLUMNS
}

// 导出主要配置对象
export const COLUMN_CONFIG = {
  ALL_COLUMNS,
  COLUMNS_BY_CATEGORY,
  DISPLAY_MODE_CONFIGS,
  COLUMN_GROUPS,
  COLUMN_PROPERTIES
}