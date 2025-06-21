/**
 * 骰宝监控工具函数
 */

import { SICBO_BET_MAPPING, STATUS_MAPPING } from '../constants/sicboMapping.js'

/**
 * 金额格式化
 * @param {number|string} amount - 金额
 * @returns {string} 格式化后的金额
 */
export function formatMoney(amount) {
  if (!amount || amount === 0) return '0'
  
  const num = Number(amount)
  if (isNaN(num)) return '0'
  
  // 大于1万显示万单位
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace('.0', '') + '万'
  }
  
  // 大于1000显示千位分隔符
  if (num >= 1000) {
    return num.toLocaleString()
  }
  
  return num.toString()
}

/**
 * 时间格式化
 * @param {string} datetime - 时间字符串
 * @param {string} format - 格式类型 'time'|'datetime'|'date'
 * @returns {string} 格式化后的时间
 */
export function formatTime(datetime, format = 'time') {
  if (!datetime) return '--'
  
  try {
    const date = new Date(datetime)
    
    if (format === 'time') {
      // 只显示时分：14:30
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
    
    if (format === 'date') {
      // 只显示日期：6月21日
      return date.toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric'
      })
    }
    
    if (format === 'datetime') {
      // 显示完整日期时间：6月21日 14:30
      return date.toLocaleString('zh-CN', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
    
    return date.toLocaleString('zh-CN')
  } catch (error) {
    console.error('时间格式化错误:', error)
    return '--'
  }
}

/**
 * 获取投注类型名称
 * @param {number} betId - 投注类型ID
 * @param {boolean} isShort - 是否使用短名称
 * @returns {string} 投注类型名称
 */
export function getBetTypeName(betId, isShort = false) {
  const betInfo = SICBO_BET_MAPPING[betId]
  if (!betInfo) return `未知类型(${betId})`
  
  return isShort ? betInfo.shortName : betInfo.name
}

/**
 * 获取投注类型颜色
 * @param {number} betId - 投注类型ID
 * @returns {string} 颜色值
 */
export function getBetTypeColor(betId) {
  const betInfo = SICBO_BET_MAPPING[betId]
  return betInfo ? betInfo.color : '#909399'
}

/**
 * 获取投注类型背景颜色
 * @param {number} betId - 投注类型ID
 * @returns {string} 背景颜色值
 */
export function getBetTypeBackground(betId) {
  const betInfo = SICBO_BET_MAPPING[betId]
  return betInfo ? betInfo.bgColor : '#f4f4f5'
}

/**
 * 获取投注类型Element Plus标签类型
 * @param {number} betId - 投注类型ID
 * @returns {string} Element Plus标签类型
 */
export function getBetTypeTag(betId) {
  const betInfo = SICBO_BET_MAPPING[betId]
  if (!betInfo) return 'info'
  
  switch (betInfo.category) {
    case 'basic': return 'primary'
    case 'total': return 'info'
    case 'single': return 'warning'
    case 'pair': return 'danger'
    case 'triple': return 'success'
    case 'combo': return 'info'
    default: return 'info'
  }
}

/**
 * 获取状态显示文本
 * @param {number} status - 状态码
 * @returns {string} 状态文本
 */
export function getStatusText(status) {
  const statusInfo = STATUS_MAPPING[status]
  return statusInfo ? statusInfo.text : '未知状态'
}

/**
 * 获取状态Element Plus标签类型
 * @param {number} status - 状态码
 * @returns {string} Element Plus标签类型
 */
export function getStatusType(status) {
  const statusInfo = STATUS_MAPPING[status]
  return statusInfo ? statusInfo.type : 'info'
}

/**
 * 获取台桌类型标签类型
 * @param {string} tableId - 台桌ID
 * @returns {string} Element Plus标签类型
 */
export function getTableType(tableId) {
  if (!tableId) return 'info'
  
  const table = tableId.toString().toLowerCase()
  
  if (table.includes('vip')) return 'danger'
  if (table.includes('a') || table.includes('1')) return 'primary'
  if (table.includes('b') || table.includes('2')) return 'success'
  if (table.includes('c') || table.includes('3')) return 'warning'
  
  return 'info'
}

/**
 * 格式化台桌名称
 * @param {string} tableId - 台桌ID
 * @returns {string} 格式化后的台桌名称
 */
export function formatTableName(tableId) {
  if (!tableId) return '--'
  
  // 移除常见前缀，保留核心标识
  return tableId.toString()
    .replace(/^(骰宝|SICBO|SIC_BO)/i, '')
    .trim() || tableId
}

/**
 * 计算总览统计数据
 * @param {Array} records - 投注记录数组
 * @returns {Object} 统计数据
 */
export function calculateOverview(records) {
  if (!records || records.length === 0) {
    return {
      totalBetAmount: 0,
      totalUsers: 0,
      totalBets: 0,
      maxBet: 0
    }
  }
  
  // 总投注金额
  const totalBetAmount = records.reduce((sum, record) => {
    return sum + (Number(record.bet_amt) || 0)
  }, 0)
  
  // 参与人数（去重）
  const uniqueUsers = new Set(records.map(record => record.user_id).filter(Boolean))
  const totalUsers = uniqueUsers.size
  
  // 投注笔数
  const totalBets = records.length
  
  // 最大单注
  const maxBet = records.reduce((max, record) => {
    const betAmt = Number(record.bet_amt) || 0
    return Math.max(max, betAmt)
  }, 0)
  
  return {
    totalBetAmount,
    totalUsers,
    totalBets,
    maxBet
  }
}

/**
 * 按投注类型分组统计
 * @param {Array} records - 投注记录数组
 * @returns {Object} 按投注类型分组的统计数据
 */
export function groupByBetType(records) {
  if (!records || records.length === 0) return {}
  
  const groups = {}
  
  records.forEach(record => {
    const betId = record.game_peilv_id
    if (!betId) return
    
    if (!groups[betId]) {
      groups[betId] = {
        betId,
        name: getBetTypeName(betId),
        shortName: getBetTypeName(betId, true),
        category: SICBO_BET_MAPPING[betId]?.category || 'unknown',
        color: getBetTypeColor(betId),
        betCount: 0,
        totalAmount: 0,
        userCount: 0,
        users: new Set()
      }
    }
    
    groups[betId].betCount += 1
    groups[betId].totalAmount += Number(record.bet_amt) || 0
    groups[betId].users.add(record.user_id)
    groups[betId].userCount = groups[betId].users.size
  })
  
  // 转换为数组并移除users集合
  return Object.values(groups).map(group => {
    delete group.users
    return group
  })
}

/**
 * 按类别分组投注统计
 * @param {Array} betTypeStats - 投注类型统计数组
 * @returns {Array} 按类别分组的统计数据
 */
export function groupByCategory(betTypeStats) {
  if (!betTypeStats || !Array.isArray(betTypeStats)) {
    return [] // 确保返回数组
  }
  
  const categories = {}
  
  betTypeStats.forEach(stat => {
    const category = stat.category
    
    if (!categories[category]) {
      categories[category] = {
        category,
        name: getCategoryName(category),
        color: getCategoryColor(category),
        items: [],
        totalBets: 0,
        totalAmount: 0,
        totalUsers: 0
      }
    }
    
    categories[category].items.push(stat)
    categories[category].totalBets += stat.betCount
    categories[category].totalAmount += stat.totalAmount
    categories[category].totalUsers += stat.userCount
  })
  
  // 确保返回数组，并按order排序
  return Object.values(categories).sort((a, b) => {
    const orderA = getCategoryOrder(a.category)
    const orderB = getCategoryOrder(b.category)
    return orderA - orderB
  })
}

/**
 * 获取类别排序
 * @param {string} category - 类别key
 * @returns {number} 排序号
 */
function getCategoryOrder(category) {
  const orderMap = {
    basic: 1,
    total: 2,
    single: 3,
    pair: 4,
    triple: 5,
    combo: 6
  }
  return orderMap[category] || 999
}

/**
 * 获取类别名称
 * @param {string} category - 类别key
 * @returns {string} 类别名称
 */
function getCategoryName(category) {
  const categoryMap = {
    basic: '基础区域',
    total: '总和区域',
    single: '单骰区域',
    pair: '对子区域',
    triple: '三同号区域',
    combo: '组合区域'
  }
  return categoryMap[category] || '未知类别'
}

/**
 * 获取类别颜色
 * @param {string} category - 类别key
 * @returns {string} 类别颜色
 */
function getCategoryColor(category) {
  const colorMap = {
    basic: '#409eff',
    total: '#909399',
    single: '#e6a23c',
    pair: '#f56c6c',
    triple: '#722ed1',
    combo: '#13c2c2'
  }
  return colorMap[category] || '#909399'
}

/**
 * 搜索过滤函数
 * @param {Array} records - 投注记录数组
 * @param {string} searchText - 搜索文本
 * @returns {Array} 过滤后的记录数组
 */
export function filterRecords(records, searchText) {
  if (!searchText || !searchText.trim()) return records
  
  const keyword = searchText.trim().toLowerCase()
  
  return records.filter(record => {
    // 搜索用户名
    if (record.user_name && record.user_name.toLowerCase().includes(keyword)) {
      return true
    }
    
    // 搜索台桌ID
    if (record.table_id && record.table_id.toLowerCase().includes(keyword)) {
      return true
    }
    
    // 搜索投注类型名称
    const betTypeName = getBetTypeName(record.game_peilv_id).toLowerCase()
    if (betTypeName.includes(keyword)) {
      return true
    }
    
    return false
  })
}

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, delay) {
  let timeoutId
  
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}