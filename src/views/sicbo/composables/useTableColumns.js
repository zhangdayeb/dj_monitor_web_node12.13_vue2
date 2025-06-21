import { ref, computed } from 'vue'
import { COLUMN_CONFIG } from '../constants/columnConfig.js'
import { SICBO_MAPPING } from '../constants/sicboMapping.js'

/**
 * 表格列管理 Composable
 * 负责根据显示模式动态生成表格列配置
 */
export function useTableColumns() {
  // 自定义列配置
  const customColumns = ref([])
  
  // 列排序配置
  const columnOrder = ref({})
  
  // 列可见性配置
  const columnVisibility = ref({})
  
  // 固定列配置
  const fixedColumns = ref({
    left: ['user_name', 'table_name'],
    right: ['close_status']
  })

  // 基础列定义
  const baseColumns = {
    // 固定信息列
    user_name: {
      prop: 'user_name',
      label: '用户名',
      width: 120,
      fixed: 'left',
      type: 'user',
      sortable: true,
      resizable: true,
      showOverflowTooltip: true
    },
    
    user_id: {
      prop: 'user_id',
      label: '用户ID',
      width: 100,
      type: 'text',
      sortable: true,
      showOverflowTooltip: true
    },
    
    table_name: {
      prop: 'table_name',
      label: '台桌',
      width: 100,
      fixed: 'left',
      type: 'table',
      sortable: true,
      filters: [
        { text: '台桌A', value: 'A' },
        { text: '台桌B', value: 'B' },
        { text: 'VIP1', value: 'VIP1' }
      ]
    },
    
    count: {
      prop: 'count',
      label: '总投注',
      width: 100,
      type: 'amount',
      sortable: true,
      align: 'right',
      headerAlign: 'center'
    },
    
    close_status: {
      prop: 'close_status',
      label: '状态',
      width: 80,
      fixed: 'right',
      type: 'status',
      sortable: true,
      filters: [
        { text: '待开牌', value: 1 },
        { text: '已结算', value: 2 },
        { text: '作废', value: 3 }
      ]
    },
    
    created_at: {
      prop: 'created_at',
      label: '投注时间',
      width: 140,
      type: 'time',
      sortable: true
    },
    
    totalBetAmount: {
      prop: 'totalBetAmount',
      label: '投注总额',
      width: 110,
      type: 'amount',
      sortable: true,
      align: 'right'
    },
    
    betItemCount: {
      prop: 'betItemCount',
      label: '投注项数',
      width: 90,
      type: 'number',
      sortable: true,
      align: 'center'
    },
    
    riskLevel: {
      prop: 'riskLevel',
      label: '风险等级',
      width: 90,
      type: 'risk',
      sortable: true,
      align: 'center'
    }
  }

  // 生成投注金额列
  const generateBetAmountColumns = () => {
    const columns = {}
    
    // 基础区域 (304-307)
    const basicItems = [
      { id: 304, name: '小', key: 'small', color: '#67c23a' },
      { id: 305, name: '大', key: 'big', color: '#409eff' },
      { id: 306, name: '单', key: 'odd', color: '#e6a23c' },
      { id: 307, name: '双', key: 'even', color: '#f56c6c' }
    ]
    
    basicItems.forEach(item => {
      const propName = `sum_bet_amt_${item.id}`
      columns[propName] = {
        prop: propName,
        label: item.name,
        width: 80,
        type: 'amount',
        sortable: true,
        align: 'right',
        headerAlign: 'center',
        category: 'basic',
        betId: item.id,
        odds: '1:1',
        color: item.color,
        group: '基础区域'
      }
    })
    
    // 总和区域 (308-321) 总和4-17
    for (let i = 4; i <= 17; i++) {
      const betId = 308 + (i - 4)
      const propName = `sum_bet_amt_${betId}`
      
      // 获取赔率
      const oddsMap = {
        4: '60:1', 5: '30:1', 6: '17:1', 7: '12:1', 8: '8:1',
        9: '6:1', 10: '6:1', 11: '6:1', 12: '6:1', 13: '6:1',
        14: '8:1', 15: '12:1', 16: '17:1', 17: '30:1'
      }
      
      columns[propName] = {
        prop: propName,
        label: `和${i}`,
        width: 70,
        type: 'amount',
        sortable: true,
        align: 'right',
        headerAlign: 'center',
        category: 'total',
        betId: betId,
        totalSum: i,
        odds: oddsMap[i],
        group: '总和区域',
        isHighOdds: ['60:1', '30:1', '17:1'].includes(oddsMap[i])
      }
    }
    
    // 单骰区域 (322-327) 单骰1-6
    for (let i = 1; i <= 6; i++) {
      const betId = 322 + (i - 1)
      const propName = `sum_bet_amt_${betId}`
      
      columns[propName] = {
        prop: propName,
        label: `单${i}`,
        width: 70,
        type: 'amount',
        sortable: true,
        align: 'right',
        headerAlign: 'center',
        category: 'single',
        betId: betId,
        diceNumber: i,
        odds: '1:1',
        group: '单骰区域'
      }
    }
    
    // 对子区域 (328-333) 对子1-6
    for (let i = 1; i <= 6; i++) {
      const betId = 328 + (i - 1)
      const propName = `sum_bet_amt_${betId}`
      
      columns[propName] = {
        prop: propName,
        label: `对${i}`,
        width: 70,
        type: 'amount',
        sortable: true,
        align: 'right',
        headerAlign: 'center',
        category: 'pair',
        betId: betId,
        diceNumber: i,
        odds: '10:1',
        group: '对子区域',
        isHighOdds: true
      }
    }
    
    // 三连区域 (334-340) 三连1-6 + 任意三连
    for (let i = 1; i <= 6; i++) {
      const betId = 334 + (i - 1)
      const propName = `sum_bet_amt_${betId}`
      
      columns[propName] = {
        prop: propName,
        label: `三${i}`,
        width: 70,
        type: 'amount',
        sortable: true,
        align: 'right',
        headerAlign: 'center',
        category: 'triple',
        betId: betId,
        diceNumber: i,
        odds: '180:1',
        group: '三连区域',
        isHighOdds: true,
        isExtremeOdds: true
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
      odds: '30:1',
      group: '三连区域',
      isHighOdds: true
    }
    
    return columns
  }

  // 合并所有列定义
  const allColumns = computed(() => {
    const betColumns = generateBetAmountColumns()
    return { ...baseColumns, ...betColumns }
  })

  // 根据显示模式获取列配置
  const getColumnsByMode = (mode = 'overview') => {
    const columns = []
    
    switch (mode) {
      case 'overview':
        // 概览模式：基础信息 + 基础投注区域
        columns.push(
          allColumns.value.user_name,
          allColumns.value.table_name,
          allColumns.value.count,
          // 基础区域
          allColumns.value.sum_bet_amt_305, // 大
          allColumns.value.sum_bet_amt_304, // 小
          allColumns.value.sum_bet_amt_306, // 单
          allColumns.value.sum_bet_amt_307, // 双
          allColumns.value.close_status
        )
        break
        
      case 'detailed':
        // 详细模式：基础信息 + 基础区域 + 热门总和区域
        columns.push(
          allColumns.value.user_name,
          allColumns.value.table_name,
          allColumns.value.count,
          // 基础区域
          allColumns.value.sum_bet_amt_305, // 大
          allColumns.value.sum_bet_amt_304, // 小
          allColumns.value.sum_bet_amt_306, // 单
          allColumns.value.sum_bet_amt_307, // 双
          // 热门总和（中等概率区域）
          allColumns.value.sum_bet_amt_308, // 和4
          allColumns.value.sum_bet_amt_309, // 和5
          allColumns.value.sum_bet_amt_310, // 和6
          allColumns.value.sum_bet_amt_318, // 和14
          allColumns.value.sum_bet_amt_319, // 和15
          allColumns.value.sum_bet_amt_320, // 和16
          allColumns.value.sum_bet_amt_321, // 和17
          // 状态
          allColumns.value.close_status
        )
        break
        
      case 'complete':
        // 完整模式：所有区域
        columns.push(
          allColumns.value.user_name,
          allColumns.value.table_name,
          allColumns.value.count
        )
        
        // 基础区域
        columns.push(
          allColumns.value.sum_bet_amt_305, // 大
          allColumns.value.sum_bet_amt_304, // 小
          allColumns.value.sum_bet_amt_306, // 单
          allColumns.value.sum_bet_amt_307  // 双
        )
        
        // 总和区域 (和4-17)
        for (let i = 308; i <= 321; i++) {
          const propName = `sum_bet_amt_${i}`
          if (allColumns.value[propName]) {
            columns.push(allColumns.value[propName])
          }
        }
        
        // 单骰区域
        for (let i = 322; i <= 327; i++) {
          const propName = `sum_bet_amt_${i}`
          if (allColumns.value[propName]) {
            columns.push(allColumns.value[propName])
          }
        }
        
        // 对子区域
        for (let i = 328; i <= 333; i++) {
          const propName = `sum_bet_amt_${i}`
          if (allColumns.value[propName]) {
            columns.push(allColumns.value[propName])
          }
        }
        
        // 三连区域
        for (let i = 334; i <= 340; i++) {
          const propName = `sum_bet_amt_${i}`
          if (allColumns.value[propName]) {
            columns.push(allColumns.value[propName])
          }
        }
        
        columns.push(allColumns.value.close_status)
        break
        
      case 'analysis':
        // 分析模式：基础信息 + 统计列 + 关键投注区域
        columns.push(
          allColumns.value.user_name,
          allColumns.value.table_name,
          allColumns.value.totalBetAmount,
          allColumns.value.betItemCount,
          allColumns.value.riskLevel,
          // 关键投注区域
          allColumns.value.sum_bet_amt_305, // 大
          allColumns.value.sum_bet_amt_304, // 小
          allColumns.value.sum_bet_amt_340, // 任意三连
          allColumns.value.created_at,
          allColumns.value.close_status
        )
        break
        
      case 'compact':
        // 紧凑模式：最少信息
        columns.push(
          allColumns.value.user_name,
          allColumns.value.table_name,
          allColumns.value.count,
          allColumns.value.close_status
        )
        break
        
      default:
        // 默认返回概览模式
        return getColumnsByMode('overview')
    }
    
    // 应用自定义列配置
    return applyCustomColumnConfig(columns)
  }

  // 根据分组获取列
  const getColumnsByGroup = (groups = ['basic']) => {
    const columns = [
      allColumns.value.user_name,
      allColumns.value.table_name,
      allColumns.value.count
    ]
    
    groups.forEach(group => {
      const groupColumns = Object.values(allColumns.value).filter(
        col => col.category === group
      )
      columns.push(...groupColumns)
    })
    
    columns.push(allColumns.value.close_status)
    
    return applyCustomColumnConfig(columns)
  }

  // 获取高风险投注列
  const getHighRiskColumns = () => {
    return Object.values(allColumns.value).filter(col => 
      col.isHighOdds || col.isExtremeOdds
    )
  }

  // 获取基础投注列
  const getBasicColumns = () => {
    return Object.values(allColumns.value).filter(col => 
      col.category === 'basic'
    )
  }

  // 应用自定义列配置
  const applyCustomColumnConfig = (columns) => {
    return columns.map(col => {
      // 应用可见性配置
      if (columnVisibility.value[col.prop] === false) {
        return { ...col, hidden: true }
      }
      
      // 应用自定义宽度
      const customCol = customColumns.value.find(c => c.prop === col.prop)
      if (customCol) {
        return { ...col, ...customCol }
      }
      
      return col
    }).filter(col => !col.hidden)
  }

  // 设置列可见性
  const setColumnVisibility = (columnProp, visible) => {
    columnVisibility.value[columnProp] = visible
  }

  // 设置列宽度
  const setColumnWidth = (columnProp, width) => {
    const existingIndex = customColumns.value.findIndex(c => c.prop === columnProp)
    if (existingIndex > -1) {
      customColumns.value[existingIndex].width = width
    } else {
      customColumns.value.push({ prop: columnProp, width })
    }
  }

  // 重置列配置
  const resetColumnConfig = () => {
    customColumns.value = []
    columnVisibility.value = {}
    columnOrder.value = {}
  }

  // 获取列统计信息
  const getColumnStats = (mode) => {
    const columns = getColumnsByMode(mode)
    const stats = {
      total: columns.length,
      byCategory: {},
      totalWidth: 0,
      highOddsCount: 0
    }
    
    columns.forEach(col => {
      if (col.category) {
        stats.byCategory[col.category] = (stats.byCategory[col.category] || 0) + 1
      }
      stats.totalWidth += (col.width || 100)
      if (col.isHighOdds) {
        stats.highOddsCount++
      }
    })
    
    return stats
  }

  // 导出列配置
  const exportColumnConfig = () => {
    return {
      customColumns: customColumns.value,
      columnVisibility: columnVisibility.value,
      columnOrder: columnOrder.value,
      timestamp: Date.now()
    }
  }

  // 导入列配置
  const importColumnConfig = (config) => {
    if (config.customColumns) {
      customColumns.value = config.customColumns
    }
    if (config.columnVisibility) {
      columnVisibility.value = config.columnVisibility
    }
    if (config.columnOrder) {
      columnOrder.value = config.columnOrder
    }
  }

  // 获取推荐列配置
  const getRecommendedColumns = (screenWidth, dataComplexity = 'medium') => {
    if (screenWidth < 768) {
      return getColumnsByMode('compact')
    } else if (screenWidth < 1200) {
      return getColumnsByMode('overview')
    } else if (screenWidth < 1800) {
      return getColumnsByMode('detailed')
    } else {
      return getColumnsByMode('complete')
    }
  }

  // 搜索列
  const searchColumns = (keyword) => {
    const lowerKeyword = keyword.toLowerCase()
    return Object.values(allColumns.value).filter(col =>
      col.label.toLowerCase().includes(lowerKeyword) ||
      col.prop.toLowerCase().includes(lowerKeyword) ||
      (col.group && col.group.toLowerCase().includes(lowerKeyword))
    )
  }

  return {
    // 数据
    allColumns,
    customColumns,
    columnVisibility,
    fixedColumns,
    
    // 主要方法
    getColumnsByMode,
    getColumnsByGroup,
    getHighRiskColumns,
    getBasicColumns,
    getRecommendedColumns,
    
    // 配置管理
    setColumnVisibility,
    setColumnWidth,
    resetColumnConfig,
    exportColumnConfig,
    importColumnConfig,
    
    // 工具方法
    getColumnStats,
    searchColumns,
    
    // 应用配置
    applyCustomColumnConfig
  }
}