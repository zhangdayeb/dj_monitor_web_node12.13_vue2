<template>
  <div class="sicbo-table">
    <el-table
      ref="tableRef"
      :data="data"
      :loading="loading"
      :height="tableHeight"
      :max-height="maxHeight"
      :stripe="stripe"
      :border="border"
      :size="size"
      :fit="fit"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :row-class-name="handleRowClassName"
      :cell-class-name="handleCellClassName"
      :header-cell-class-name="handleHeaderCellClassName"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      v-bind="$attrs"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"
        fixed="left"
      />
      
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        align="center"
        fixed="left"
      />
      
      <!-- 动态列 -->
      <template v-for="column in processedColumns" :key="column.prop || column.label">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth || 100"
          :fixed="column.fixed"
          :align="column.align || 'center'"
          :sortable="column.sortable !== false"
          :sort-method="column.sortMethod"
          :show-overflow-tooltip="column.showOverflowTooltip !== false"
          :class-name="column.className"
          :label-class-name="column.labelClassName"
        >
          <!-- 自定义表头 -->
          <template #header="scope" v-if="column.headerSlot">
            <slot :name="column.headerSlot" v-bind="scope">
              {{ column.label }}
            </slot>
          </template>
          
          <!-- 自定义单元格内容 -->
          <template #default="scope">
            <!-- 使用自定义slot -->
            <slot 
              v-if="column.slot" 
              :name="column.slot" 
              v-bind="scope"
              :column="column"
            >
              {{ getCellValue(scope.row, column) }}
            </slot>
            
            <!-- 投注金额类型 -->
            <bet-amount-cell
              v-else-if="column.type === 'amount'"
              :amount="getCellValue(scope.row, column)"
              :odds="column.odds"
              :max-amount="maxAmountInColumn[column.prop]"
              :display-mode="displayMode"
              @click="handleAmountClick(scope.row, column)"
            />
            
            <!-- 用户类型 -->
            <div 
              v-else-if="column.type === 'user'"
              class="user-cell"
              @click="handleUserClick(scope.row)"
            >
              <div class="user-name">{{ scope.row.user_name || '未知用户' }}</div>
              <div class="user-id">{{ scope.row.user_id }}</div>
            </div>
            
            <!-- 台桌类型 -->
            <div 
              v-else-if="column.type === 'table'"
              class="table-cell"
              :class="getTableCellClass(scope.row.table_name)"
            >
              {{ formatTableName(scope.row.table_name) }}
            </div>
            
            <!-- 时间类型 -->
            <div 
              v-else-if="column.type === 'time'"
              class="time-cell"
              :title="formatFullTime(getCellValue(scope.row, column))"
            >
              {{ formatTime(getCellValue(scope.row, column)) }}
            </div>
            
            <!-- 状态类型 -->
            <el-tag 
              v-else-if="column.type === 'status'"
              :type="getStatusType(getCellValue(scope.row, column))"
              size="small"
            >
              {{ getStatusText(getCellValue(scope.row, column)) }}
            </el-tag>
            
            <!-- 默认类型 -->
            <span v-else class="default-cell">
              {{ formatCellValue(getCellValue(scope.row, column), column) }}
            </span>
          </template>
        </el-table-column>
      </template>
      
      <!-- 操作列 -->
      <el-table-column
        v-if="showActions"
        label="操作"
        :width="actionWidth"
        align="center"
        fixed="right"
        class-name="action-column"
      >
        <template #default="scope">
          <slot name="actions" v-bind="scope">
            <el-button 
              size="small" 
              type="text" 
              @click="handleView(scope.row)"
            >
              查看
            </el-button>
            <el-button 
              size="small" 
              type="text" 
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 表格底部信息 -->
    <div v-if="showSummary" class="table-summary">
      <div class="summary-left">
        <span class="summary-item">
          <i class="el-icon-document"></i>
          共 {{ data.length }} 条记录
        </span>
        <span class="summary-item" v-if="totalAmount > 0">
          <i class="el-icon-money"></i>
          总计: ¥{{ formatAmount(totalAmount) }}
        </span>
        <span class="summary-item" v-if="selectedRows.length > 0">
          <i class="el-icon-check"></i>
          已选择 {{ selectedRows.length }} 项
        </span>
      </div>
      
      <div class="summary-right">
        <span class="summary-item" v-if="lastUpdateTime">
          <i class="el-icon-time"></i>
          更新: {{ formatTime(lastUpdateTime) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'
import BetAmountCell from './BetAmountCell.vue'

export default {
  name: 'SicboTable',
  components: {
    BetAmountCell
  },
  props: {
    // 数据相关
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    
    // 表格配置
    height: {
      type: [String, Number],
      default: undefined
    },
    maxHeight: {
      type: [String, Number],
      default: 600
    },
    stripe: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    fit: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    
    // 功能开关
    showSelection: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    showActions: {
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      default: true
    },
    
    // 样式配置
    actionWidth: {
      type: Number,
      default: 120
    },
    displayMode: {
      type: String,
      default: 'overview'
    },
    
    // 排序配置
    defaultSort: {
      type: Object,
      default: () => ({ prop: 'created_at', order: 'descending' })
    }
  },
  emits: [
    'sort-change',
    'selection-change', 
    'current-change',
    'row-click',
    'row-dblclick',
    'amount-click',
    'user-click',
    'view',
    'edit'
  ],
  setup(props, { emit }) {
    // 响应式数据
    const tableRef = ref(null)
    const selectedRows = ref([])
    const lastUpdateTime = ref(Date.now())
    
    // 计算属性 - 表格高度
    const tableHeight = computed(() => {
      if (props.height) return props.height
      
      // 根据数据量自动调整高度
      const rowHeight = 50 // 估算每行高度
      const headerHeight = 50
      const dataHeight = props.data.length * rowHeight + headerHeight
      
      return Math.min(dataHeight, props.maxHeight)
    })
    
    // 计算属性 - 处理后的列配置
    const processedColumns = computed(() => {
      return props.columns.map(column => ({
        ...column,
        // 确保必要属性
        align: column.align || 'center',
        sortable: column.sortable !== false,
        showOverflowTooltip: column.showOverflowTooltip !== false,
        
        // 处理特殊类型的默认配置
        ...(column.type === 'amount' && {
          className: 'amount-column',
          align: 'right'
        }),
        ...(column.type === 'user' && {
          className: 'user-column',
          align: 'left'
        }),
        ...(column.type === 'time' && {
          className: 'time-column',
          align: 'center'
        })
      }))
    })
    
    // 计算属性 - 每列最大金额（用于金额单元格的相对显示）
    const maxAmountInColumn = computed(() => {
      const maxAmounts = {}
      
      props.columns.forEach(column => {
        if (column.type === 'amount' && column.prop) {
          const amounts = props.data.map(row => getCellValue(row, column)).filter(val => val > 0)
          maxAmounts[column.prop] = amounts.length > 0 ? Math.max(...amounts) : 0
        }
      })
      
      return maxAmounts
    })
    
    // 计算属性 - 总金额
    const totalAmount = computed(() => {
      return props.data.reduce((total, row) => {
        return total + (row.count || 0)
      }, 0)
    })
    
    // 获取单元格值
    const getCellValue = (row, column) => {
      if (!column.prop) return ''
      
      // 支持嵌套属性 如 'user.name'
      const keys = column.prop.split('.')
      let value = row
      
      for (const key of keys) {
        value = value?.[key]
        if (value === undefined || value === null) {
          return column.defaultValue || ''
        }
      }
      
      return value
    }
    
    // 格式化单元格值
    const formatCellValue = (value, column) => {
      if (value === undefined || value === null || value === '') {
        return column.emptyText || '--'
      }
      
      // 根据列类型格式化
      switch (column.format) {
        case 'number':
          return Number(value).toLocaleString()
        case 'currency':
          return `¥${Number(value).toLocaleString()}`
        case 'percentage':
          return `${Number(value).toFixed(2)}%`
        default:
          return value
      }
    }
    
    // 格式化台桌名称
    const formatTableName = (tableName) => {
      if (!tableName) return '--'
      
      // 移除常见前缀
      return tableName.replace(/^(骰宝|百家乐|龙虎|牛牛)/, '').trim() || tableName
    }
    
    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return '--'
      
      const now = Date.now()
      const time = new Date(timestamp).getTime()
      const diff = now - time
      
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      
      if (days > 0) return `${days}天前`
      if (hours > 0) return `${hours}小时前`
      if (minutes > 0) return `${minutes}分钟前`
      return '刚刚'
    }
    
    // 格式化完整时间
    const formatFullTime = (timestamp) => {
      if (!timestamp) return ''
      return new Date(timestamp).toLocaleString()
    }
    
    // 格式化金额
    const formatAmount = (amount) => {
      if (!amount || amount === 0) return '0'
      
      if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M'
      } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'K'
      }
      
      return amount.toLocaleString()
    }
    
    // 获取台桌单元格样式类
    const getTableCellClass = (tableName) => {
      const classes = ['table-name']
      
      if (tableName?.includes('VIP')) {
        classes.push('table-vip')
      }
      if (tableName?.includes('A') || tableName?.includes('1')) {
        classes.push('table-primary')
      }
      
      return classes
    }
    
    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        1: 'warning',  // 待开牌
        2: 'success',  // 已结算
        3: 'danger',   // 台面作废
        4: 'info'      // 修改结果
      }
      return statusMap[status] || 'info'
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        1: '待开牌',
        2: '已结算',
        3: '作废',
        4: '已修改'
      }
      return statusMap[status] || '未知'
    }
    
    // 行样式类名
    const handleRowClassName = ({ row, rowIndex }) => {
      const classes = []
      
      // 根据数据特征添加样式类
      if (row.count > 10000) {
        classes.push('high-amount-row')
      }
      
      if (row.close_status === 3) {
        classes.push('invalid-row')
      }
      
      return classes.join(' ')
    }
    
    // 单元格样式类名
    const handleCellClassName = ({ row, column, rowIndex, columnIndex }) => {
      const classes = []
      
      // 金额相关样式
      if (column.property && column.property.includes('bet_amt')) {
        const amount = row[column.property] || 0
        if (amount > 5000) classes.push('high-amount')
        else if (amount > 1000) classes.push('medium-amount')
        else if (amount > 0) classes.push('low-amount')
      }
      
      return classes.join(' ')
    }
    
    // 表头样式类名
    const handleHeaderCellClassName = ({ column, columnIndex }) => {
      const classes = []
      
      if (column.property && column.property.includes('bet_amt')) {
        classes.push('amount-header')
      }
      
      return classes.join(' ')
    }
    
    // 事件处理
    const handleSortChange = (sortData) => {
      emit('sort-change', sortData)
    }
    
    const handleSelectionChange = (selection) => {
      selectedRows.value = selection
      emit('selection-change', selection)
    }
    
    const handleCurrentChange = (currentRow, oldCurrentRow) => {
      emit('current-change', currentRow, oldCurrentRow)
    }
    
    const handleRowClick = (row, column, event) => {
      emit('row-click', row, column, event)
    }
    
    const handleRowDblclick = (row, column, event) => {
      emit('row-dblclick', row, column, event)
    }
    
    const handleAmountClick = (row, column) => {
      emit('amount-click', { row, column, amount: getCellValue(row, column) })
    }
    
    const handleUserClick = (row) => {
      emit('user-click', row)
    }
    
    const handleView = (row) => {
      emit('view', row)
    }
    
    const handleEdit = (row) => {
      emit('edit', row)
    }
    
    // 公共方法
    const clearSelection = () => {
      tableRef.value?.clearSelection()
    }
    
    const toggleRowSelection = (row, selected) => {
      tableRef.value?.toggleRowSelection(row, selected)
    }
    
    const setCurrentRow = (row) => {
      tableRef.value?.setCurrentRow(row)
    }
    
    const scrollTo = (options) => {
      tableRef.value?.scrollTo(options)
    }
    
    // 监听数据变化，更新最后更新时间
    watch(() => props.data, () => {
      lastUpdateTime.value = Date.now()
    }, { deep: true })
    
    return {
      // refs
      tableRef,
      
      // 响应式数据
      selectedRows,
      lastUpdateTime,
      
      // 计算属性
      tableHeight,
      processedColumns,
      maxAmountInColumn,
      totalAmount,
      
      // 方法
      getCellValue,
      formatCellValue,
      formatTableName,
      formatTime,
      formatFullTime,
      formatAmount,
      getTableCellClass,
      getStatusType,
      getStatusText,
      handleRowClassName,
      handleCellClassName,
      handleHeaderCellClassName,
      
      // 事件处理
      handleSortChange,
      handleSelectionChange,
      handleCurrentChange,
      handleRowClick,
      handleRowDblclick,
      handleAmountClick,
      handleUserClick,
      handleView,
      handleEdit,
      
      // 公共方法
      clearSelection,
      toggleRowSelection,
      setCurrentRow,
      scrollTo
    }
  }
}
</script>

<style scoped>
.sicbo-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sicbo-table :deep(.el-table) {
  flex: 1;
}

/* 用户单元格 */
.user-cell {
  cursor: pointer;
  transition: color 0.3s;
}

.user-cell:hover {
  color: #409eff;
}

.user-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.user-id {
  font-size: 11px;
  color: #909399;
}

/* 台桌单元格 */
.table-cell {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
}

.table-name {
  background: #f0f2f5;
  color: #606266;
}

.table-vip {
  background: linear-gradient(135deg, #fff2e8 0%, #ffeedd 100%);
  color: #e6a23c;
}

.table-primary {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  color: #409eff;
}

/* 时间单元格 */
.time-cell {
  font-size: 12px;
  color: #606266;
}

/* 默认单元格 */
.default-cell {
  color: #303133;
}

/* 表格底部摘要 */
.table-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-top: none;
  border-radius: 0 0 4px 4px;
  font-size: 12px;
  color: #606266;
}

.summary-left,
.summary-right {
  display: flex;
  gap: 16px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.summary-item i {
  font-size: 12px;
}

/* 深层样式覆盖 */
.sicbo-table :deep(.el-table__header) {
  font-weight: 600;
}

.sicbo-table :deep(.amount-column) {
  text-align: right;
}

.sicbo-table :deep(.amount-header) {
  background: #f8f9fa;
}

.sicbo-table :deep(.user-column) {
  text-align: left;
}

.sicbo-table :deep(.time-column) {
  text-align: center;
}

.sicbo-table :deep(.action-column .cell) {
  padding: 0 8px;
}

.sicbo-table :deep(.action-column .el-button) {
  margin: 0 2px;
}

/* 行样式 */
.sicbo-table :deep(.high-amount-row) {
  background-color: #fff5f5;
}

.sicbo-table :deep(.invalid-row) {
  background-color: #f5f5f5;
  color: #c0c4cc;
}

/* 单元格金额样式 */
.sicbo-table :deep(.high-amount) {
  color: #f56c6c;
  font-weight: bold;
}

.sicbo-table :deep(.medium-amount) {
  color: #e6a23c;
  font-weight: 500;
}

.sicbo-table :deep(.low-amount) {
  color: #67c23a;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .table-summary {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .summary-left,
  .summary-right {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .user-cell {
    text-align: center;
  }
  
  .sicbo-table :deep(.el-table__header-wrapper) {
    overflow-x: auto;
  }
}
</style>