<template>
  <div class="bull-monitor">
    <!-- 顶部总览数据 -->
    <div class="overview-section">
      <div class="section-header">
        <div class="header-title">
          <h2>🐂 牛牛监控</h2>
          <div class="table-selector">
            <span class="selector-label">台桌:</span>
            <el-select 
              v-model="currentTableId" 
              @change="changeTable"
              size="small"
              style="width: 180px"
              :loading="tablesLoading"
              placeholder="选择台桌"
            >
              <el-option 
                v-for="table in tableList" 
                :key="table.id" 
                :label="table.name"
                :value="table.id"
              >
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>{{ table.name }}</span>
                  <div style="display: flex; gap: 8px; font-size: 12px; color: #909399;">
                    <span>{{ table.bet_count }}笔</span>
                    <span>¥{{ formatMoney(table.total_amount) }}</span>
                  </div>
                </div>
              </el-option>
            </el-select>
          </div>
        </div>
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
          <span class="refresh-info">{{ autoRefresh ? '每5秒自动更新' : '已停止自动刷新' }}</span>
        </div>
      </div>

      <!-- 当前台桌信息卡片 -->
      <div class="current-table-info" v-if="currentTableInfo">
        <div class="table-info-card">
          <div class="table-name">{{ currentTableName }}</div>
          <div class="table-stats">{{ currentTableInfo.bet_count }}笔投注</div>
          <div class="table-stats">¥{{ formatMoney(currentTableInfo.total_amount) }}</div>
          <div class="table-status active">运行中</div>
          <div class="last-update" v-if="lastUpdateTime">
            更新: {{ formatTime(lastUpdateTime, 'time') }}
          </div>
        </div>
      </div>

      <!-- 总览统计卡片 -->
      <div class="overview-cards">
        <div class="overview-card total-amount">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <div class="card-value">¥{{ formatMoney(overviewData.totalBetAmount) }}</div>
            <div class="card-label">总投注额</div>
          </div>
        </div>
        
        <div class="overview-card total-users">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <div class="card-value">{{ overviewData.totalUsers }}</div>
            <div class="card-label">参与人数</div>
          </div>
        </div>
        
        <div class="overview-card total-bets">
          <div class="card-icon">🎲</div>
          <div class="card-content">
            <div class="card-value">{{ overviewData.totalBets }}</div>
            <div class="card-label">投注笔数</div>
          </div>
        </div>
        
        <div class="overview-card max-bet">
          <div class="card-icon">⚡</div>
          <div class="card-content">
            <div class="card-value">¥{{ formatMoney(overviewData.maxBet) }}</div>
            <div class="card-label">最大单注</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 投注统计分析 -->
    <div class="stats-section">
      <div class="section-header">
        <div class="header-title">
          <h3>📊 投注统计分析</h3>
          <div class="trend-advice">
            <span class="advice-label">投注趋势:</span>
            <span class="advice-text" :class="`trend-${bullAdvice.trend}`">
              {{ bullAdvice.suggestion }}
            </span>
          </div>
        </div>
        <div class="stats-actions">
          <el-button @click="refreshBetStats" :loading="betStatsLoading" type="primary" size="small">
            🔄 刷新统计
          </el-button>
        </div>
      </div>

      <!-- 投注类型统计 -->
      <div class="bet-stats-grid">
        <div 
          v-for="group in categoryGroups" 
          :key="group.category"
          class="category-group"
        >
          <div class="group-header">
            <span class="group-title" :style="{ color: group.color }">
              {{ group.name }}
            </span>
            <div class="group-summary">
              <span>{{ group.totalBets }}笔</span>
              <span>¥{{ formatMoney(group.totalAmount) }}</span>
            </div>
          </div>
          
          <div class="bet-items">
            <div 
              v-for="item in group.items" 
              :key="item.betId"
              class="bet-item"
              :style="{ 
                backgroundColor: getBetTypeBackground(item.betId),
                borderLeft: `3px solid ${getBetTypeColor(item.betId)}`
              }"
            >
              <div class="bet-info">
                <div class="bet-name">
                  <el-tag :type="getBetTypeTag(item.betId)" size="small">
                    {{ item.shortName }}
                  </el-tag>
                </div>
                <div class="bet-stats">
                  <span class="bet-count">{{ item.betCount }}笔</span>
                  <span class="bet-amount">¥{{ formatMoney(item.totalAmount) }}</span>
                </div>
              </div>
              <div class="bet-progress">
                <el-progress 
                  :percentage="calculatePercentage(item.totalAmount)" 
                  :stroke-width="6"
                  :color="getBetTypeColor(item.betId)"
                  :show-text="false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 投注记录列表 -->
    <div class="records-section">
      <div class="section-header">
        <h3>📋 投注记录</h3>
        <div class="header-actions">
          <el-input
            v-model="searchText"
            @input="handleSearch"
            placeholder="搜索用户名、台桌ID..."
            size="small"
            style="width: 200px"
            clearable
          >
            <template #prefix>
              <span>🔍</span>
            </template>
          </el-input>
        </div>
      </div>

      <el-table 
        :data="paginatedRecords" 
        :loading="loading"
        stripe
        height="400"
        @sort-change="handleSortChange"
      >
        <el-table-column prop="created_at" label="时间" width="80" sortable>
          <template #default="scope">
            {{ formatTime(scope.row.created_at) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="user_name" label="用户" width="120">
          <template #default="scope">
            <div class="user-info">
              <div class="user-name">{{ scope.row.user_name || 'Guest' }}</div>
              <div class="user-id">ID: {{ scope.row.user_id }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="table_id" label="台桌" width="100">
          <template #default="scope">
            <el-tag :type="getTableType(scope.row.table_id)" size="small">
              {{ formatTableName(scope.row.table_id) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="game_peilv_id" label="投注类型" width="120">
          <template #default="scope">
            <el-tag :type="getBetTypeTag(scope.row.game_peilv_id)" size="small">
              {{ getBetTypeName(scope.row.game_peilv_id, true) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="bet_amt" label="金额" width="100" sortable>
          <template #default="scope">
            <span class="bet-amount">¥{{ formatMoney(scope.row.bet_amt) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="game_peilv" label="赔率" width="80">
          <template #default="scope">
            {{ scope.row.game_peilv }}
          </template>
        </el-table-column>
        
        <el-table-column prop="close_status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.close_status)" size="small">
              {{ getStatusText(scope.row.close_status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="result" label="结果" width="100">
          <template #default="scope">
            {{ scope.row.result || '待开奖' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
            <el-button @click="showDetailDialog(scope.row)" type="primary" size="small" text>
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[20, 50, 100, 200]"
          :total="filteredRecords.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="投注详情" 
      width="500px"
      @close="selectedRecord = null"
    >
      <div v-if="selectedRecord" class="detail-content">
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
  debounce,
  getBullAdvice
} from './utils/bullUtils.js'

export default {
  name: 'BullMonitor',
  setup() {
    // ===== 响应式数据 =====
    const loading = ref(false)
    const betStatsLoading = ref(false)
    const tablesLoading = ref(false)
    const autoRefresh = ref(false)
    const refreshTimer = ref(null)
    
    // 台桌相关
    const tableList = ref([])
    const currentTableId = ref(null)
    const lastUpdateTime = ref('')
    
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
    
    // 当前台桌信息
    const currentTableInfo = computed(() => {
      if (!currentTableId.value || !tableList.value.length) return null
      return tableList.value.find(table => table.id === currentTableId.value)
    })
    
    // 当前台桌名称
    const currentTableName = computed(() => {
      if (!currentTableInfo.value) return '未选择台桌'
      return currentTableInfo.value.name
    })
    
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
      try {
        const betTypeStats = groupByBetType(records.value)
        const grouped = groupByCategory(betTypeStats)
        return Array.isArray(grouped) ? grouped : []
      } catch (error) {
        console.error('分组统计数据错误:', error)
        return []
      }
    })
    
    // 牛牛投注建议
    const bullAdvice = computed(() => {
      const betTypeStats = groupByBetType(records.value)
      return getBullAdvice(betTypeStats)
    })
    
    // ===== 方法 =====
    
    // 加载台桌列表
    const loadTables = async () => {
      tablesLoading.value = true
      try {
        const data = await apiService.getBullTables()
        // 适配后端返回的数据格式
        tableList.value = Array.isArray(data) ? 
          data : (data?.list ? data.list : (Array.isArray(data) ? data : []))
        
        // 自动选择第一个台桌
        if (tableList.value.length > 0 && !currentTableId.value) {
          currentTableId.value = tableList.value[0].id
          await loadTableData()
        }
      } catch (error) {
        console.error('加载台桌列表失败:', error)
        tableList.value = []
        ElMessage.error('加载台桌列表失败')
      } finally {
        tablesLoading.value = false
      }
    }
    
    // 切换台桌
    const changeTable = async (tableId) => {
      if (tableId && tableId !== currentTableId.value) {
        currentTableId.value = tableId
        await loadTableData()
      }
    }
    
    // 加载台桌数据
    const loadTableData = async () => {
      if (!currentTableId.value) return
      
      await Promise.all([
        loadRecords(),
        loadOverview(),
        loadBetStats()
      ])
      
      lastUpdateTime.value = new Date().toISOString()
    }
    
    // 刷新数据
    const refreshData = async () => {
      await loadTableData()
      ElMessage.success('数据刷新成功')
    }
    
    // 加载投注记录
    const loadRecords = async () => {
      if (!currentTableId.value) return
      
      loading.value = true
      try {
        const data = await apiService.getBullRecords({ table_id: currentTableId.value })
        // 适配后端返回的数据格式
        records.value = data?.list ? data.list : (Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('加载投注记录失败:', error)
        records.value = []
      } finally {
        loading.value = false
      }
    }
    
    // 加载总览数据
    const loadOverview = async () => {
      if (!currentTableId.value) return
      
      try {
        const data = await apiService.getBullOverview(currentTableId.value)
        // 处理可能为null的返回数据
        overviewData.value = {
          totalBetAmount: data?.totalBetAmount || 0,
          totalUsers: data?.totalUsers || 0,
          totalBets: data?.totalBets || 0,
          maxBet: data?.maxBet || 0
        }
      } catch (error) {
        console.error('加载总览数据失败:', error)
        // 从本地记录计算总览数据
        overviewData.value = calculateOverview(records.value)
      }
    }
    
    // 加载投注统计
    const loadBetStats = async () => {
      if (!currentTableId.value) return
      
      betStatsLoading.value = true
      try {
        const data = await apiService.getBullBetStats(currentTableId.value)
        betStats.value = Array.isArray(data) ? data : []
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
        if (currentTableId.value) {
          loadTableData()
        }
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
    
    // 计算投注金额占比
    const calculatePercentage = (amount) => {
      if (!overviewData.value.totalBetAmount || !amount) return 0
      return Math.min(100, (amount / overviewData.value.totalBetAmount * 100))
    }
    
    // 显示详情弹窗
    const showDetailDialog = (record) => {
      selectedRecord.value = record
      detailDialogVisible.value = true
    }
    
    // ===== 生命周期 =====
    onMounted(() => {
      loadTables() // 先加载台桌列表，然后自动选择第一个台桌并加载数据
    })
    
    onBeforeUnmount(() => {
      stopAutoRefresh()
    })
    
    // ===== 返回 =====
    return {
      // 数据
      loading,
      betStatsLoading,
      tablesLoading,
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
      bullAdvice,
      
      // 台桌相关
      tableList,
      currentTableId,
      currentTableInfo,
      currentTableName,
      lastUpdateTime,
      
      // 方法
      refreshData,
      refreshBetStats,
      loadTables,
      changeTable,
      loadTableData,
      toggleAutoRefresh,
      handleSearch,
      handleSizeChange,
      handleCurrentChange,
      handleSortChange,
      showDetailDialog,
      calculatePercentage,
      
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
.bull-monitor {
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

.header-title {
  display: flex;
  align-items: center;
  gap: 20px;
}

.table-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selector-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
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

.stats-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 投注趋势建议 */
.trend-advice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #409eff;
}

.advice-label {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.advice-text {
  font-size: 12px;
  font-weight: bold;
}

.advice-text.trend-banker {
  color: #409eff;
}

.advice-text.trend-player {
  color: #f56c6c;
}

.advice-text.trend-special {
  color: #fa8c16;
}

.advice-text.trend-neutral {
  color: #909399;
}

/* 当前台桌信息 */
.current-table-info {
  margin-bottom: 20px;
}

.table-info-card {
  background: linear-gradient(135deg, #fa8c16 0%, #f56c6c 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 12px rgba(250, 140, 22, 0.3);
}

.table-name {
  font-size: 18px;
  font-weight: bold;
}

.table-stats {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.table-status {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.table-status.active {
  background-color: rgba(103, 194, 58, 0.8);
}

.last-update {
  font-size: 12px;
  opacity: 0.8;
  margin-left: auto;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.total-amount .card-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.total-users .card-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.total-bets .card-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.max-bet .card-icon {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.card-label {
  font-size: 0.9rem;
  color: #909399;
}

/* 投注统计分析 */
.stats-section {
  margin-bottom: 30px;
}

.bet-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.category-group {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.group-title {
  font-size: 16px;
  font-weight: bold;
}

.group-summary {
  font-size: 12px;
  color: #909399;
  display: flex;
  gap: 10px;
}

.bet-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bet-item {
  padding: 12px;
  border-radius: 6px;
  transition: transform 0.2s ease;
}

.bet-item:hover {
  transform: translateX(4px);
}

.bet-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.bet-stats {
  font-size: 12px;
  color: #606266;
  display: flex;
  gap: 8px;
}

.bet-amount {
  font-weight: bold;
  color: #f56c6c;
}

/* 投注记录 */
.records-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 500;
  color: #303133;
}

.user-id {
  font-size: 12px;
  color: #909399;
}

.bet-amount {
  font-weight: bold;
  color: #f56c6c;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 详情弹窗 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-row label {
  font-weight: bold;
  color: #606266;
  min-width: 80px;
}

.detail-row .amount {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.detail-content {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bull-monitor {
    padding: 10px;
  }
  
  .overview-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .bet-stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>