<template>
  <div class="filter-panel">
    <div class="filter-row">
      <!-- 显示模式切换 -->
      <div class="filter-group">
        <label>显示模式:</label>
        <display-mode-switch 
          v-model="currentDisplayMode"
          @change="handleDisplayModeChange"
        />
      </div>
      
      <!-- 筛选条件 -->
      <div class="filter-group">
        <label>台桌筛选:</label>
        <el-input
          v-model="currentFilters.tableName"
          placeholder="输入台桌名称"
          style="width: 150px"
          clearable
          @input="handleFilterChange"
        />
      </div>
      
      <div class="filter-group">
        <label>用户ID:</label>
        <el-input
          v-model="currentFilters.userIdFilter"
          placeholder="输入用户ID"
          style="width: 150px"
          clearable
          @input="handleFilterChange"
        />
      </div>
      
      <div class="filter-group">
        <label>最小金额:</label>
        <el-input-number
          v-model="currentFilters.minAmount"
          :min="0"
          :step="100"
          placeholder="最小投注额"
          style="width: 150px"
          @change="handleFilterChange"
        />
      </div>
      
      <!-- 控制按钮 -->
      <div class="filter-actions">
        <el-button 
          type="primary" 
          :loading="loading"
          @click="handleRefresh"
        >
          <i class="el-icon-refresh"></i>
          {{ loading ? '刷新中...' : '刷新' }}
        </el-button>
        
        <el-button 
          type="default"
          @click="handleClearFilters"
        >
          <i class="el-icon-delete"></i>
          清空筛选
        </el-button>
        
        <el-button 
          type="info"
          @click="toggleAutoRefresh"
        >
          <i :class="autoRefreshIcon"></i>
          {{ autoRefreshText }}
        </el-button>
      </div>
    </div>
    
    <!-- 状态信息栏 -->
    <div class="status-row">
      <div class="status-info">
        <span class="status-item">
          <i class="el-icon-time"></i>
          刷新间隔: {{ refreshIntervalText }}
        </span>
        <span class="status-item">
          <i class="el-icon-view"></i>
          显示记录: {{ recordCount }}条
        </span>
        <span class="status-item" v-if="hasActiveFilters">
          <i class="el-icon-search"></i>
          已应用筛选条件
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import DisplayModeSwitch from '../shared/DisplayModeSwitch.vue'

export default {
  name: 'FilterPanel',
  components: {
    DisplayModeSwitch
  },
  props: {
    filters: {
      type: Object,
      default: () => ({})
    },
    displayMode: {
      type: String,
      default: 'overview'
    },
    loading: {
      type: Boolean,
      default: false
    },
    recordCount: {
      type: Number,
      default: 0
    },
    refreshInterval: {
      type: Number,
      default: 3000
    }
  },
  emits: ['update:filters', 'update:displayMode', 'refresh', 'filter-change'],
  setup(props, { emit }) {
    // 响应式数据
    const autoRefreshEnabled = ref(true)
    
    // 计算属性 - 当前筛选条件
    const currentFilters = computed({
      get: () => props.filters,
      set: (value) => emit('update:filters', value)
    })
    
    // 计算属性 - 当前显示模式
    const currentDisplayMode = computed({
      get: () => props.displayMode,
      set: (value) => emit('update:displayMode', value)
    })
    
    // 计算属性 - 是否有活动筛选条件
    const hasActiveFilters = computed(() => {
      const filters = currentFilters.value
      return !!(
        filters.tableName ||
        filters.userIdFilter ||
        filters.minAmount
      )
    })
    
    // 计算属性 - 自动刷新相关
    const autoRefreshIcon = computed(() => {
      return autoRefreshEnabled.value ? 'el-icon-video-pause' : 'el-icon-video-play'
    })
    
    const autoRefreshText = computed(() => {
      return autoRefreshEnabled.value ? '暂停刷新' : '开始刷新'
    })
    
    const refreshIntervalText = computed(() => {
      if (!autoRefreshEnabled.value) return '已暂停'
      return `${props.refreshInterval / 1000}秒`
    })
    
    // 处理显示模式变化
    const handleDisplayModeChange = (mode) => {
      console.log('显示模式切换为:', mode)
    }
    
    // 处理筛选条件变化
    const handleFilterChange = () => {
      emit('filter-change')
    }
    
    // 处理刷新
    const handleRefresh = () => {
      emit('refresh')
    }
    
    // 清空筛选条件
    const handleClearFilters = () => {
      const emptyFilters = {
        tableName: '',
        userIdFilter: '',
        minAmount: null
      }
      emit('update:filters', emptyFilters)
      emit('filter-change')
    }
    
    // 切换自动刷新
    const toggleAutoRefresh = () => {
      autoRefreshEnabled.value = !autoRefreshEnabled.value
      // 可以在这里添加实际的自动刷新控制逻辑
      console.log('自动刷新状态:', autoRefreshEnabled.value)
    }
    
    // 监听筛选条件变化（防抖处理）
    let filterTimeout = null
    watch(currentFilters, () => {
      if (filterTimeout) {
        clearTimeout(filterTimeout)
      }
      filterTimeout = setTimeout(() => {
        handleFilterChange()
      }, 300)
    }, { deep: true })
    
    return {
      // 响应式数据
      autoRefreshEnabled,
      
      // 计算属性
      currentFilters,
      currentDisplayMode,
      hasActiveFilters,
      autoRefreshIcon,
      autoRefreshText,
      refreshIntervalText,
      
      // 方法
      handleDisplayModeChange,
      handleFilterChange,
      handleRefresh,
      handleClearFilters,
      toggleAutoRefresh
    }
  }
}
</script>

<style scoped>
.filter-panel {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  font-weight: 500;
}

.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.status-row {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.status-info {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 13px;
  color: #909399;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-item i {
  font-size: 12px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .filter-actions {
    margin-left: 0;
    justify-content: center;
  }
  
  .status-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>