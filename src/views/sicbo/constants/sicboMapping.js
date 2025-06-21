/**
 * 骰宝52个投注项映射配置
 * 基于数据库表 ntp_dianji_game_peilv (game_type_id = 9)
 */

// 投注类型映射
export const SICBO_BET_MAPPING = {
  // 基础区域 (304-307)
  304: {
    name: '小(4-10)',
    shortName: '小',
    category: 'basic',
    color: '#67c23a',
    bgColor: '#f0f9ff',
    order: 1
  },
  305: {
    name: '大(11-17)',
    shortName: '大',
    category: 'basic',
    color: '#409eff',
    bgColor: '#ecf5ff',
    order: 2
  },
  306: {
    name: '单',
    shortName: '单',
    category: 'basic',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    order: 3
  },
  307: {
    name: '双',
    shortName: '双',
    category: 'basic',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 4
  },

  // 总和区域 (308-321)
  308: {
    name: '总和4',
    shortName: '和4',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 1
  },
  309: {
    name: '总和5',
    shortName: '和5',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 2
  },
  310: {
    name: '总和6',
    shortName: '和6',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 3
  },
  311: {
    name: '总和7',
    shortName: '和7',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 4
  },
  312: {
    name: '总和8',
    shortName: '和8',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 5
  },
  313: {
    name: '总和9',
    shortName: '和9',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 6
  },
  314: {
    name: '总和10',
    shortName: '和10',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 7
  },
  315: {
    name: '总和11',
    shortName: '和11',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 8
  },
  316: {
    name: '总和12',
    shortName: '和12',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 9
  },
  317: {
    name: '总和13',
    shortName: '和13',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 10
  },
  318: {
    name: '总和14',
    shortName: '和14',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 11
  },
  319: {
    name: '总和15',
    shortName: '和15',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 12
  },
  320: {
    name: '总和16',
    shortName: '和16',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 13
  },
  321: {
    name: '总和17',
    shortName: '和17',
    category: 'total',
    color: '#909399',
    bgColor: '#f4f4f5',
    order: 14
  },

  // 单骰区域 (322-327)
  322: {
    name: '单骰1',
    shortName: '骰1',
    category: 'single',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    order: 1
  },
  323: {
    name: '单骰2',
    shortName: '骰2',
    category: 'single',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    order: 2
  },
  324: {
    name: '单骰3',
    shortName: '骰3',
    category: 'single',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    order: 3
  },
  325: {
    name: '单骰4',
    shortName: '骰4',
    category: 'single',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    order: 4
  },
  326: {
    name: '单骰5',
    shortName: '骰5',
    category: 'single',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    order: 5
  },
  327: {
    name: '单骰6',
    shortName: '骰6',
    category: 'single',
    color: '#e6a23c',
    bgColor: '#fdf6ec',
    order: 6
  },

  // 对子区域 (328-333)
  328: {
    name: '对子1',
    shortName: '对1',
    category: 'pair',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 1
  },
  329: {
    name: '对子2',
    shortName: '对2',
    category: 'pair',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 2
  },
  330: {
    name: '对子3',
    shortName: '对3',
    category: 'pair',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 3
  },
  331: {
    name: '对子4',
    shortName: '对4',
    category: 'pair',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 4
  },
  332: {
    name: '对子5',
    shortName: '对5',
    category: 'pair',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 5
  },
  333: {
    name: '对子6',
    shortName: '对6',
    category: 'pair',
    color: '#f56c6c',
    bgColor: '#fef0f0',
    order: 6
  },

  // 三同号区域 (334-340)
  334: {
    name: '三同号1',
    shortName: '三1',
    category: 'triple',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 1
  },
  335: {
    name: '三同号2',
    shortName: '三2',
    category: 'triple',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 2
  },
  336: {
    name: '三同号3',
    shortName: '三3',
    category: 'triple',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 3
  },
  337: {
    name: '三同号4',
    shortName: '三4',
    category: 'triple',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 4
  },
  338: {
    name: '三同号5',
    shortName: '三5',
    category: 'triple',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 5
  },
  339: {
    name: '三同号6',
    shortName: '三6',
    category: 'triple',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 6
  },
  340: {
    name: '任意三同号',
    shortName: '任三',
    category: 'triple',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    order: 7
  },

  // 组合区域 (341-355)
  341: {
    name: '组合1-2',
    shortName: '1-2',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 1
  },
  342: {
    name: '组合1-3',
    shortName: '1-3',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 2
  },
  343: {
    name: '组合1-4',
    shortName: '1-4',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 3
  },
  344: {
    name: '组合1-5',
    shortName: '1-5',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 4
  },
  345: {
    name: '组合1-6',
    shortName: '1-6',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 5
  },
  346: {
    name: '组合2-3',
    shortName: '2-3',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 6
  },
  347: {
    name: '组合2-4',
    shortName: '2-4',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 7
  },
  348: {
    name: '组合2-5',
    shortName: '2-5',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 8
  },
  349: {
    name: '组合2-6',
    shortName: '2-6',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 9
  },
  350: {
    name: '组合3-4',
    shortName: '3-4',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 10
  },
  351: {
    name: '组合3-5',
    shortName: '3-5',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 11
  },
  352: {
    name: '组合3-6',
    shortName: '3-6',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 12
  },
  353: {
    name: '组合4-5',
    shortName: '4-5',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 13
  },
  354: {
    name: '组合4-6',
    shortName: '4-6',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 14
  },
  355: {
    name: '组合5-6',
    shortName: '5-6',
    category: 'combo',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    order: 15
  }
}

// 投注类别配置
export const SICBO_CATEGORIES = {
  basic: {
    name: '基础区域',
    shortName: '基础',
    description: '大小单双基础投注',
    color: '#409eff',
    order: 1,
    items: [304, 305, 306, 307]
  },
  total: {
    name: '总和区域',
    shortName: '总和',
    description: '三颗骰子点数总和投注',
    color: '#909399',
    order: 2,
    items: [308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321]
  },
  single: {
    name: '单骰区域',
    shortName: '单骰',
    description: '单个骰子点数投注',
    color: '#e6a23c',
    order: 3,
    items: [322, 323, 324, 325, 326, 327]
  },
  pair: {
    name: '对子区域',
    shortName: '对子',
    description: '两个相同点数投注',
    color: '#f56c6c',
    order: 4,
    items: [328, 329, 330, 331, 332, 333]
  },
  triple: {
    name: '三同号区域',
    shortName: '三同',
    description: '三个相同点数投注',
    color: '#722ed1',
    order: 5,
    items: [334, 335, 336, 337, 338, 339, 340]
  },
  combo: {
    name: '组合区域',
    shortName: '组合',
    description: '两个不同点数组合投注',
    color: '#13c2c2',
    order: 6,
    items: [341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355]
  }
}

// 状态映射
export const STATUS_MAPPING = {
  1: { text: '待开牌', type: 'warning', color: '#e6a23c' },
  2: { text: '已结算', type: 'success', color: '#67c23a' },
  3: { text: '台面作废', type: 'danger', color: '#f56c6c' },
  4: { text: '修改结果', type: 'info', color: '#909399' }
}