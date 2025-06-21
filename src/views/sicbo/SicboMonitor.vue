<template>
  <div class="sicbo-monitor">
    <!-- 顶部总览数据 -->
    <div class="overview-section">
      <div class="section-header">
        <h2>🎲 骰宝监控</h2>
        <div class="header-actions">
          <el-button @click="refreshData" :loading="loading" type="primary" size="small">
            🔄 刷新数据
          </el-button>
          <el-button 
            @click="toggleAutoRefresh" 
            :type="autoRefresh ? 'success' : 'default'" 
            size="small"
          >
            {{ autoRefresh ? '⏸️ 停止' : '▶️ 开始' }}自动刷新
          </el-button>
          <span class="refresh-info">{{ autoRefresh ? '每5秒自动刷新' : '手动刷新模式' }}</span>
        </div>
      </div>
      
      <!-- 总览数据卡片 -->
      <div class="overview-cards">
        <div class="overview-card total-bet">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <div class="card-value">¥{{ formatMoney(overviewData.totalBetAmount) }}</div>
            <div class="card-label">当局总投注</div>
          </div>
        </div>
        
        <div class="overview-card total-users">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <div class="card-value">{{ overviewData.totalUsers }}</div>
            <div class="card-label">参与人数</div>
          </div>
        </div>
        
        <div class="overview-card bet-count">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <div class="card-value">{{ overviewData.totalBets }}</div>
            <div class="card-label">投注笔数</div>
          </div>
        </div>
        
        <div class="overview-card max-bet">
          <div class="card-icon">🎯</div>
          <div class="card-content">
            <div class="card-value">¥{{ formatMoney(overviewData.maxBet) }}</div>
            <div class="card-label">最大单注</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 52项投注统计 -->
    <div class="bet-stats-section">
      <div class="section-header">
        <h3>📈 52项投注统计</h3>
        <el-button @click="refreshBetStats" :loading="betStatsLoading" size="small">
          刷新统计
        </el-button>
      </div>
      
      <!-- 按类别分组显示 -->
      <div class="category-groups">
        <div 
          v-for="category in categoryGroups" 
          :key="category.category"
          class="category-group"
        >
          <div class="category-header">
            <span class="category-title" :style="{ color: category.color }">
              {{ category.name }}
            </span>
            <span class="category-summary">
              {{ category.totalBets }}笔 / ¥{{ formatMoney(category.totalAmount) }} / {{ category.totalUsers }}人
            </span>
          </div>
          
          <div class="bet-items">
            <div 
              v-for="item in category.items" 
              :key="item.betId"
              class="bet-item"
              :style="{ borderLeftColor: item.color }"
            >
              <div class="bet-name">{{ item.shortName }}</div>
              <div class="bet-stats">
                <span class="bet-count">{{ item.betCount }}笔</span>
                <span class="bet-amount">¥{{ formatMoney(item.totalAmount) }}</span>
                <span class="bet-users">{{ item.userCount }}人</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 投注记录表格 -->
    <div class="table-section">
      <div class="section-header">
        <h3>📋 投注记录</h3>
        <div class="table-actions">
          <el-input 
            v-model="searchText" 
            placeholder="🔍 搜索用户名、台桌或投注类型" 
            size="small" 
            style="width: 300px"
            clearable
            @input="handleSearch"
          >
          </el-input>
        </div>
      </div>
      
      <el-table 
        :data="paginatedRecords" 
        stripe 
        border
        height="500"
        v-loading="loading"
        empty-text="暂无投注数据"
        @sort-change="handleSortChange"
      >
        <!-- 用户信息 -->
        <el-table-column prop="user_name" label="用户" width="120" fixed="left">
          <template #default="{ row }">
            <div class="user-cell">
              <div class="username">{{ row.user_name || 'Guest' }}</div>
              <div class="user-id">ID: {{ row.user_id }}</div>
            </div>
          </template>
        </el-table-column>
        
        <!-- 台桌信息 -->
        <el-table-column prop="table_id" label="台桌" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="getTableType(row.table_id)">
              {{ formatTableName(row.table_id) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 投注类型 -->
        <el-table-column prop="game_peilv_id" label="投注类型" width="120">
          <template #default="{ row }">
            <el-tag 
              size="small" 
              :type="getBetTypeTag(row.game_peilv_id)"
              :style="{ 
                backgroundColor: getBetTypeBackground(row.game_peilv_id),
                color: getBetTypeColor(row.game_peilv_id),
                border: `1px solid ${getBetTypeColor(row.game_peilv_id)}30`
              }"
            >
              {{ getBetTypeName(row.game_peilv_id) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 投注金额 -->
        <el-table-column prop="bet_amt" label="投注金额" width="100" align="right" sortable>
          <template #default="{ row }">
            <div class="amount-cell">
              <span class="amount">¥{{ formatMoney(row.bet_amt) }}</span>
            </div>
          </template>
        </el-table-column>
        
        <!-- 赔率 -->
        <el-table-column prop="game_peilv" label="赔率" width="80" align="center">
          <template #default="{ row }">
            <span class="odds">{{ row.game_peilv }}</span>
          </template>
        </el-table-column>
        
        <!-- 状态 -->
        <el-table-column prop="close_status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="getStatusType(row.close_status)">
              {{ getStatusText(row.close_status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- 投注时间 -->
        <el-table-column prop="created_at" label="投注时间" width="160" sortable>
          <template #default="{ row }">
            <div class="time-cell">
              <div class="time">{{ formatTime(row.created_at, 'time') }}</div>
              <div class="date">{{ formatTime(row.created_at, 'date') }}</div>
            </div>
          </template>
        </el-table-column>
        
        <!-- 操作 -->
        <el-table-column label="操作" width="80" align="center" fixed="right">
          <template #default="{ row }">
            <el-button 
              size="mini" 
              type="text" 
              @click="showDetailDialog(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[20, 50, 100, 200]"
          :total="filteredRecords.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    
    <!-- 详情弹窗 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="投注详情" 
      width="600px"
      @close="selectedRecord = null"
    >
      <div class="detail-dialog" v-if="selectedRecord">
        <div class="detail-row">
          <label>用户信息:</label>
          <span>{{ selectedRecord.user_name || 'Guest' }} (ID: {{ selectedRecord.user_id }})</span>
        </div>
        <div class="detail-row">
          <label>台桌信息:</label>
          <span>{{ selectedRecord.table_id }} - 靴号: {{ selectedRecord.xue_number }} - 铺号: {{ selectedRecord.pu_number }}</span>
        </div>
        <div class="detail-row">
          <label>投注金额:</label>
          <span class="amount">¥{{ formatMoney(selectedRecord.bet_amt) }}</span>
        </div>
        <div class="detail-row">
          <label>投注类型:</label>
          <span>{{ getBetTypeName(selectedRecord.game_peilv_id) }} (赔率: {{ selectedRecord.game_peilv }})</span>
        </div>
        <div class="detail-row">
          <label>投注时间:</label>
          <span>{{ formatTime(selectedRecord.created_at, 'datetime') }}</span>
        </div>
        <div class="detail-row">
          <label>游戏结果:</label>
          <span>{{ selectedRecord.result || '待开奖' }}</span>
        </div>
        <div class="detail-row">
          <label>当前状态:</label>
          <el-tag :type="getStatusType(selectedRecord.close_status)">
            {{ getStatusText(selectedRecord.close_status) }}
          </el-tag>
        </div>
        <div class="detail-row" v-if="selectedRecord.detail">
          <label>投注详情:</label>
          <div class="detail-content">{{ selectedRecord.detail }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'

// 导入API和工具函数
import apiService from '@/service/apiService.js'

import { 
  formatMoney, 
  formatTime, 
  getBetTypeName, 
  getBetTypeColor, 
  getBetTypeBackground, 
  getBetTypeTag,
  getStatusText, 
  getStatusType, 
  getTableType, 
  formatTableName,
  calculateOverview,
  groupByBetType,
  groupByCategory,
  filterRecords,
  debounce
} from './utils/sicboUtils.js'

export default {
  name: 'SicboMonitor',
  setup() {
    // ===== 响应式数据 =====
    const loading = ref(false)
    const betStatsLoading = ref(false)
    const autoRefresh = ref(false)
    const refreshTimer = ref(null)
    
    // 搜索和分页
    const searchText = ref('')
    const currentPage = ref(1)
    const pageSize = ref(50)
    
    // 弹窗相关
    const detailDialogVisible = ref(false)
    const selectedRecord = ref(null)
    
    // 数据
    const records = ref([])
    const betStats = ref([])
    const overviewData = ref({
      totalBetAmount: 0,
      totalUsers: 0,
      totalBets: 0,
      maxBet: 0
    })
    
    // ===== 计算属性 =====
    
    // 过滤后的记录
    const filteredRecords = computed(() => {
      return filterRecords(records.value, searchText.value)
    })
    
    // 分页后的记录
    const paginatedRecords = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredRecords.value.slice(start, end)
    })
    
    // 按类别分组的投注统计
    const categoryGroups = computed(() => {
      const betTypeStats = groupByBetType(records.value)
      return groupByCategory(betTypeStats)
    })
    
    // ===== 方法 =====
    
    // 刷新所有数据
    const refreshData = async () => {
      loading.value = true
      try {
        await Promise.all([
          loadRecords(),
          loadOverview(),
          loadBetStats()
        ])
        ElMessage.success('数据刷新成功')
      } catch (error) {
        console.error('刷新数据失败:', error)
        ElMessage.error('数据刷新失败: ' + error.message)
      } finally {
        loading.value = false
      }
    }
    
    // 加载投注记录
    const loadRecords = async () => {
      try {
        const data = await apiService.getSicboRecords({ pageSize: 1000 })
        records.value = data.list || data || []
      } catch (error) {
        console.error('加载投注记录失败:', error)
        records.value = []
      }
    }
    
    // 加载总览数据
    const loadOverview = async () => {
      try {
        const data = await apiService.getSicboOverview()
        overviewData.value = data
      } catch (error) {
        console.error('加载总览数据失败:', error)
        // 从本地记录计算总览数据
        overviewData.value = calculateOverview(records.value)
      }
    }
    
    // 加载投注统计
    const loadBetStats = async () => {
      betStatsLoading.value = true
      try {
        const data = await apiService.getSicboBetStats()
        betStats.value = data || []
      } catch (error) {
        console.error('加载投注统计失败:', error)
        betStats.value = []
      } finally {
        betStatsLoading.value = false
      }
    }
    
    // 刷新投注统计
    const refreshBetStats = () => {
      loadBetStats()
    }
    
    // 切换自动刷新
    const toggleAutoRefresh = () => {
      autoRefresh.value = !autoRefresh.value
      
      if (autoRefresh.value) {
        startAutoRefresh()
        ElMessage.success('已开启自动刷新（每5秒）')
      } else {
        stopAutoRefresh()
        ElMessage.info('已停止自动刷新')
      }
    }
    
    // 开始自动刷新
    const startAutoRefresh = () => {
      stopAutoRefresh() // 先清除之前的定时器
      refreshTimer.value = setInterval(() => {
        refreshData()
      }, 5000)
    }
    
    // 停止自动刷新
    const stopAutoRefresh = () => {
      if (refreshTimer.value) {
        clearInterval(refreshTimer.value)
        refreshTimer.value = null
      }
    }
    
    // 搜索处理（防抖）
    const handleSearch = debounce(() => {
      currentPage.value = 1 // 搜索时重置到第一页
    }, 300)
    
    // 分页处理
    const handleSizeChange = (newSize) => {
      pageSize.value = newSize
      currentPage.value = 1
    }
    
    const handleCurrentChange = (newPage) => {
      currentPage.value = newPage
    }
    
    // 排序处理
    const handleSortChange = ({ column, prop, order }) => {
      if (!prop || !order) return
      
      records.value.sort((a, b) => {
        let aVal = a[prop]
        let bVal = b[prop]
        
        // 数字类型排序
        if (prop === 'bet_amt') {
          aVal = Number(aVal) || 0
          bVal = Number(bVal) || 0
        }
        
        // 时间类型排序
        if (prop === 'created_at') {
          aVal = new Date(aVal).getTime()
          bVal = new Date(bVal).getTime()
        }
        
        if (order === 'ascending') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }
    
    // 显示详情弹窗
    const showDetailDialog = (record) => {
      selectedRecord.value = record
      detailDialogVisible.value = true
    }
    
    // ===== 生命周期 =====
    onMounted(() => {
      refreshData()
    })
    
    onBeforeUnmount(() => {
      stopAutoRefresh()
    })
    
    // ===== 返回 =====
    return {
      // 数据
      loading,
      betStatsLoading,
      autoRefresh,
      searchText,
      currentPage,
      pageSize,
      detailDialogVisible,
      selectedRecord,
      records,
      overviewData,
      filteredRecords,
      paginatedRecords,
      categoryGroups,
      
      // 方法
      refreshData,
      refreshBetStats,
      toggleAutoRefresh,
      handleSearch,
      handleSizeChange,
      handleCurrentChange,
      handleSortChange,
      showDetailDialog,
      
      // 工具函数
      formatMoney,
      formatTime,
      getBetTypeName,
      getBetTypeColor,
      getBetTypeBackground,
      getBetTypeTag,
      getStatusText,
      getStatusType,
      getTableType,
      formatTableName
    }
  }
}
</script>

<style scoped>
.sicbo-monitor {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 区域头部 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2,
.section-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.refresh-info {
  font-size: 12px;
  color: #909399;
}

/* 总览卡片 */
.overview-section {
  margin-bottom: 30px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.overview-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.overview-card:hover {
  transform: translateY(-2px);
}

.card-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(45deg, #409eff, #67c23a);
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.card-label {
  font-size: 14px;
  color: #606266;
}

/* 投注统计区域 */
.bet-stats-section {
  margin-bottom: 30px;
}

.category-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-group {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.category-title {
  font-size: 16px;
  font-weight: bold;
}

.category-summary {
  font-size: 14px;
  color: #909399;
}

.bet-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.bet-item {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  border-left: 4px solid #ddd;
  transition: all 0.2s;
}

.bet-item:hover {
  background: #f0f2f5;
  transform: translateY(-1px);
}

.bet-name {
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
  font-size: 14px;
}

.bet-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bet-stats span {
  font-size: 12px;
  color: #606266;
}

.bet-count {
  color: #409eff !important;
}

.bet-amount {
  color: #67c23a !important;
  font-weight: bold;
}

.bet-users {
  color: #e6a23c !important;
}

/* 表格区域 */
.table-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-actions {
  display: flex;
  gap: 10px;
}

/* 表格单元格样式 */
.user-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username {
  font-weight: bold;
  color: #303133;
}

.user-id {
  font-size: 12px;
  color: #909399;
}

.amount-cell .amount {
  font-weight: bold;
  color: #67c23a;
  font-family: 'Courier New', monospace;
}

.odds {
  font-weight: bold;
  color: #409eff;
  font-family: 'Courier New', monospace;
}

.time-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time {
  font-weight: bold;
  color: #303133;
}

.date {
  font-size: 12px;
  color: #909399;
}

/* 分页 */
.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 详情弹窗 */
.detail-dialog {
  padding: 10px 0;
}

.detail-row {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
}

.detail-row label {
  width: 100px;
  font-weight: bold;
  color: #606266;
  flex-shrink: 0;
}

.detail-row span {
  flex: 1;
  color: #303133;
}

.detail-row .amount {
  font-weight: bold;
  color: #67c23a;
  font-family: 'Courier New', monospace;
}

.detail-content {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  border-left: 3px solid #409eff;
  margin-top: 5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sicbo-monitor {
    padding: 10px;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .bet-items {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    flex-wrap: wrap;
  }
}

/* Element Plus 组件样式覆盖 */
.el-table {
  font-size: 14px;
}

.el-table th {
  background-color: #f8f9fa;
  color: #606266;
  font-weight: bold;
}

.el-tag {
  font-size: 12px;
}

.el-button--mini {
  padding: 4px 8px;
  font-size: 12px;
}
</style>