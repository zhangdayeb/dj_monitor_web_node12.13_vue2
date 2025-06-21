<template>
  <div class="overview-table">
    <!-- 筛选面板 -->
    <filter-panel 
      v-model:filters="filters"
      v-model:display-mode="displayMode"
      :loading="loading"
      @refresh="handleRefresh"
      @filter-change="handleFilterChange"
    />
    
    <!-- 主表格 -->
    <sicbo-table
      :data="filteredData"
      :columns="currentColumns"
      :loading="loading"
      :display-mode="displayMode"
      @sort-change="handleSortChange"
    />
    
    <!-- 底部统计 -->
    <quick-stats 
      :data="statsData"
      :online-count="onlineCount"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import FilterPanel from './FilterPanel.vue'
import SicboTable from '../shared/SicboTable.vue'
import QuickStats from './QuickStats.vue'
import { useSicboData } from '../../composables/useSicboData'
import { useTableColumns } from '../../composables/useTableColumns'
import { useDisplayMode } from '../../composables/useDisplayMode'

export default {
  name: 'OverviewTable',
  components: {
    FilterPanel,
    SicboTable,
    QuickStats
  },
  props: {
    refreshInterval: {
      type: Number,
      default: 3000
    }
  },
  emits: ['data-updated'],
  setup(props, { emit }) {
    // 使用组合式函数
    const { tableData, loading, refresh, startAutoRefresh, stopAutoRefresh } = useSicboData()
    const { getColumnsByMode } = useTableColumns()
    const { displayMode } = useDisplayMode()
    
    // 响应式数据
    const filters = ref({
      tableName: '',
      userIdFilter: '',
      minAmount: null
    })
    const sortConfig = ref({
      prop: '',
      order: ''
    })
    const onlineCount = ref(0)
    
    // 计算属性 - 当前列配置
    const currentColumns = computed(() => {
      return getColumnsByMode(displayMode.value)
    })
    
    // 计算属性 - 过滤后的数据
    const filteredData = computed(() => {
      let data = tableData.value
      
      // 台桌筛选
      if (filters.value.tableName) {
        data = data.filter(item => 
          item.table_name && item.table_name.includes(filters.value.tableName)
        )
      }
      
      // 用户ID筛选
      if (filters.value.userIdFilter) {
        data = data.filter(item => 
          item.user_id && item.user_id.toString().includes(filters.value.userIdFilter)
        )
      }
      
      // 最小金额筛选
      if (filters.value.minAmount) {
        data = data.filter(item => 
          item.count >= filters.value.minAmount
        )
      }
      
      // 应用排序
      if (sortConfig.value.prop && sortConfig.value.order) {
        data = [...data].sort((a, b) => {
          const aVal = a[sortConfig.value.prop] || 0
          const bVal = b[sortConfig.value.prop] || 0
          const factor = sortConfig.value.order === 'ascending' ? 1 : -1
          return (aVal - bVal) * factor
        })
      }
      
      return data
    })
    
    // 计算属性 - 统计数据
    const statsData = computed(() => {
      const data = filteredData.value
      return {
        totalAmount: data.reduce((sum, item) => sum + (item.count || 0), 0),
        totalUsers: new Set(data.map(item => item.user_id)).size,
        totalRecords: data.length,
        maxBet: Math.max(...data.map(item => item.count || 0), 0),
        lastUpdate: new Date().toLocaleTimeString()
      }
    })
    
    // 处理刷新
    const handleRefresh = async () => {
      await refresh()
      updateOnlineCount()
      emit('data-updated', {
        onlineCount: onlineCount.value,
        totalRecords: filteredData.value.length
      })
    }
    
    // 处理筛选变化
    const handleFilterChange = () => {
      console.log('筛选条件变化:', filters.value)
    }
    
    // 处理排序变化
    const handleSortChange = (sortData) => {
      sortConfig.value = {
        prop: sortData.prop,
        order: sortData.order
      }
    }
    
    // 更新在线人数
    const updateOnlineCount = () => {
      // 计算当前在线人数（去重用户ID）
      onlineCount.value = new Set(tableData.value.map(item => item.user_id)).size
    }
    
    // 监听刷新间隔变化
    watch(() => props.refreshInterval, (newInterval) => {
      stopAutoRefresh()
      if (newInterval > 0) {
        startAutoRefresh(newInterval, handleRefresh)
      }
    })
    
    // 组件挂载时启动
    onMounted(async () => {
      await handleRefresh()
      if (props.refreshInterval > 0) {
        startAutoRefresh(props.refreshInterval, handleRefresh)
      }
    })
    
    // 组件卸载时清理
    onBeforeUnmount(() => {
      stopAutoRefresh()
    })
    
    return {
      // 响应式数据
      filters,
      displayMode,
      loading,
      onlineCount,
      
      // 计算属性
      currentColumns,
      filteredData,
      statsData,
      
      // 方法
      handleRefresh,
      handleFilterChange,
      handleSortChange
    }
  }
}
</script>

<style scoped>
.overview-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.overview-table > * {
  flex-shrink: 0;
}

.overview-table .sicbo-table {
  flex: 1;
  overflow: hidden;
}
</style>