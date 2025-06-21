<template>
  <div class="dragon-monitor">
    <!-- 顶部总览数据 -->
    <div class="overview-section">
      <div class="section-header">
        <div class="header-title">
          <h2>🐲 龙虎监控</h2>
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
          <span class="refresh-info">{{ autoRefresh ? '每5秒自动刷新' : '手动刷新模式' }}</span>
        </div>
      </div>
      
      <!-- 当前台桌信息 -->
      <div class="current-table-info" v-if="currentTableInfo">
        <div class="table-info-card">
          <span class="table-name">{{ currentTableInfo.name }}</span>
          <span class="table-stats">
            共{{ currentTableInfo.bet_count }}笔投注 | 总额¥{{ formatMoney(currentTableInfo.total_amount) }}
          </span>
          <span class="table-status active">营业中</span>
          <span class="last-update" v-if="lastUpdateTime">最后更新: {{ lastUpdateTime }}</span>
        </div>
      </div>
      
      <!-- 总览数据卡片 -->
      <div class="overview-cards">
        <div class="overview-card total-bet">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <div class="card-value">¥{{ formatMoney(overviewData.totalBetAmount || 0) }}</div>
            <div class="card-label">当局总投注</div>
          </div>
        </div>
        
        <div class="overview-card total-users">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <div class="card-value">{{ overviewData.totalUsers || 0 }}</div>
            <div class="card-label">参与人数</div>
          </div>
        </div>
        
        <div class="overview-card bet-count">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <div class="card-value">{{ overviewData.totalBets || 0 }}</div>
            <div class="card-label">投注笔数</div>
          </div>
        </div>
        
        <div class="overview-card max-bet">
          <div class="card-icon">🎯</div>
          <div class="card-content">
            <div class="card-value">¥{{ formatMoney(overviewData.maxBet || 0) }}</div>
            <div class="card-label">最大单注</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3项投注统计 -->
    <div class="bet-stats-section">
      <div class="section-header">
        <h3>📈 龙虎投注统计</h3>
        <div class="stats-actions">
          <el-button @click="refreshBetStats" :loading="betStatsLoading" size="small">
            刷新统计
          </el-button>
          <!-- 投注趋势建议 -->
          <div class="trend-advice" v-if="dragonAdvice.suggestion">
            <span class="advice-label">投注趋势:</span>
            <span class="advice-text" :class="`trend-${dragonAdvice.trend}`">
              {{ dragonAdvice.suggestion }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 龙虎投注统计展示 -->
      <div class="dragon-stats">
        <div class="bet-type-cards">
          <div 
            v-for="item in betTypeStats" 
            :key="item.betId"
            class="bet-type-card"
            :class="`bet-${item.betId}`"
            :style="{ borderLeftColor: item.color }"
          >
            <div class="bet-icon">
              <span v-if="item.betId === 20">🐲</span>
              <span v-else-if="item.betId === 21">🐅</span>
              <span v-else>⚖️</span>
            </div>
            <div class="bet-info">
              <div class="bet-name" :style="{ color: item.color }">{{ item.name }}</div>
              <div class="bet-details">
                <div class="detail-item">
                  <span class="detail-label">投注笔数:</span>
                  <span class="detail-value">{{ item.betCount }}笔</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">投注金额:</span>
                  <span class="detail-value amount">¥{{ formatMoney(item.totalAmount) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">参与人数:</span>
                  <span class="detail-value">{{ item.userCount }}人</span>
                </div>
              </div>
            </div>
            <div class="bet-percentage">
              <div class="percentage-text">
                {{ calculatePercentage(item.totalAmount) }}%
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
  debounce,
  getDragonAdvice
} from './utils/dragonUtils.js'

export default {
  name: 'DragonMonitor',
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
    
    // 投注类型统计
    const betTypeStats = computed(() => {
      const stats = groupByBetType(records.value)
      // 按固定顺序排序：龙(20)、虎(21)、和(22)
      return stats.sort((a, b) => a.betId - b.betId)
    })
    
    // 龙虎投注建议
    const dragonAdvice = computed(() => {
      return getDragonAdvice(betTypeStats.value)
    })
    
    // ===== 方法 =====
    
    // 计算投注百分比
    const calculatePercentage = (amount) => {
      const total = betTypeStats.value.reduce((sum, item) => sum + item.totalAmount, 0)
      if (total === 0) return '0'
      return ((amount / total) * 100).toFixed(1)
    }
    
    // 加载台桌列表
    const loadTables = async () => {
      tablesLoading.value = true
      try {
        const data = await apiService.getDragonTables()
        // 适配后端返回的数据格式
        tableList.value = Array.isArray(data) ? data.map(table => ({
          id: table.table_id,
          name: `龙虎台桌${table.table_id}`,
          status: 1, // 默认营业中，因为有投注数据
          table_id: table.table_id,
          bet_count: table.bet_count || 0,
          total_amount: table.total_amount || '0.00'
        })) : []
        
        // 如果没有选中台桌且有可用台桌，选择第一个
        if (!currentTableId.value && tableList.value.length > 0) {
          currentTableId.value = tableList.value[0].id
          await loadTableData()
        }
      } catch (error) {
        console.error('加载台桌列表失败:', error)
        ElMessage.error('加载台桌列表失败: ' + error.message)
        tableList.value = []
      } finally {
        tablesLoading.value = false
      }
    }
    
    // 切换台桌
    const changeTable = async (tableId) => {
      if (tableId && tableId !== currentTableId.value) {
        currentTableId.value = tableId
        await loadTableData()
        ElMessage.success(`已切换到${currentTableName.value}`)
      }
    }
    
    // 加载当前台桌数据
    const loadTableData = async () => {
      if (!currentTableId.value) {
        ElMessage.warning('请先选择台桌')
        return
      }
      
      loading.value = true
      try {
        await Promise.all([
          loadRecords(),
          loadOverview(),
          loadBetStats()
        ])
        lastUpdateTime.value = new Date().toLocaleTimeString('zh-CN')
        ElMessage.success('数据刷新成功')
      } catch (error) {
        console.error('刷新数据失败:', error)
        ElMessage.error('数据刷新失败: ' + error.message)
      } finally {
        loading.value = false
      }
    }
    
    // 刷新所有数据 (包含台桌列表)
    const refreshData = async () => {
      if (!currentTableId.value) {
        await loadTables()
      } else {
        await loadTableData()
      }
    }
    
    // 加载投注记录
    const loadRecords = async () => {
      if (!currentTableId.value) return
      
      try {
        const data = await apiService.getDragonRecords({ 
          table_id: currentTableId.value,
          pageSize: 1000 
        })
        records.value = Array.isArray(data.list) ? data.list : (Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('加载投注记录失败:', error)
        records.value = []
      }
    }
    
    // 加载总览数据
    const loadOverview = async () => {
      if (!currentTableId.value) return
      
      try {
        const data = await apiService.getDragonOverview(currentTableId.value)
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
        const data = await apiService.getDragonBetStats(currentTableId.value)
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
      betTypeStats,
      dragonAdvice,
      
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
.dragon-monitor {
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

.advice-text.trend-dragon {
  color: #f56c6c;
}

.advice-text.trend-tiger {
  color: #409eff;
}

.advice-text.trend-tie {
  color: #67c23a;
}

.advice-text.trend-neutral {
  color: #909399;
}

/* 当前台桌信息 */
.current-table-info {
  margin-bottom: 20px;
}

.table-info-card {
  background: linear-gradient(135deg, #f56c6c 0%, #409eff 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
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
  background: linear-gradient(45deg, #f56c6c, #409eff);
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

/* 龙虎投注统计 */
.bet-stats-section {
  margin-bottom: 30px;
}

.dragon-stats {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bet-type-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.bet-type-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #ddd;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.2s;
}

.bet-type-card:hover {
  background: #f0f2f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bet-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bet-info {
  flex: 1;
}

.bet-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.bet-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #606266;
}

.detail-value {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.detail-value.amount {
  color: #67c23a;
  font-family: 'Courier New', monospace;
}

.bet-percentage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
}

.percentage-text {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
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
  .dragon-monitor {
    padding: 10px;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .bet-type-cards {
    grid-template-columns: 1fr;
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