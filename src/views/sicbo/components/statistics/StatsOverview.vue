<template>
  <div class="stats-overview">
    <!-- 页面头部 -->
    <div class="overview-header">
      <div class="header-info">
        <h2>今日骰宝概览</h2>
        <p class="date-info">{{ currentDate }} - 实时数据监控</p>
      </div>
      
      <div class="header-actions">
        <el-button 
          size="small" 
          :loading="refreshing"
          @click="refreshData"
        >
          <i class="el-icon-refresh"></i>
          刷新数据
        </el-button>
        
        <el-select 
          v-model="timeRange" 
          size="small" 
          style="width: 120px"
          @change="handleTimeRangeChange"
        >
          <el-option label="今日" value="today" />
          <el-option label="昨日" value="yesterday" />
          <el-option label="本周" value="week" />
          <el-option label="本月" value="month" />
        </el-select>
      </div>
    </div>
    
    <!-- 核心指标卡片 -->
    <div class="overview-cards">
      <div class="metric-card primary">
        <div class="card-icon">
          <i class="el-icon-money"></i>
        </div>
        <div class="card-content">
          <div class="metric-value">¥{{ formatAmount(overviewData.totalAmount) }}</div>
          <div class="metric-label">总投注额</div>
          <div class="metric-change" :class="getChangeClass(overviewData.amountChange)">
            <i :class="getChangeIcon(overviewData.amountChange)"></i>
            {{ formatChange(overviewData.amountChange) }}
          </div>
        </div>
      </div>
      
      <div class="metric-card success">
        <div class="card-icon">
          <i class="el-icon-user"></i>
        </div>
        <div class="card-content">
          <div class="metric-value">{{ overviewData.totalUsers }}</div>
          <div class="metric-label">参与人数</div>
          <div class="metric-change" :class="getChangeClass(overviewData.usersChange)">
            <i :class="getChangeIcon(overviewData.usersChange)"></i>
            {{ formatChange(overviewData.usersChange) }}人
          </div>
        </div>
      </div>
      
      <div class="metric-card warning">
        <div class="card-icon">
          <i class="el-icon-top"></i>
        </div>
        <div class="card-content">
          <div class="metric-value">¥{{ formatAmount(overviewData.maxBet) }}</div>
          <div class="metric-label">最大单注</div>
          <div class="metric-action">
            <el-button 
              size="mini" 
              type="text" 
              @click="viewMaxBetUser"
              v-if="overviewData.maxBetUser"
            >
              查看用户
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 异常提醒区域 -->
    <div class="alerts-section" v-if="alerts.length > 0">
      <h3>
        <i class="el-icon-warning"></i>
        异常提醒 ({{ alerts.length }})
      </h3>
      
      <div class="alerts-list">
        <el-alert
          v-for="alert in alerts"
          :key="alert.id"
          :title="alert.title"
          :description="alert.description"
          :type="alert.type"
          :closable="false"
          show-icon
          class="alert-item"
        >
          <template #default>
            <div class="alert-content">
              <div class="alert-main">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-desc">{{ alert.description }}</div>
              </div>
              <div class="alert-actions">
                <el-button 
                  size="mini" 
                  type="primary" 
                  @click="handleAlert(alert)"
                >
                  查看详情
                </el-button>
                <el-button 
                  size="mini" 
                  type="default"
                  @click="dismissAlert(alert.id)"
                >
                  忽略
                </el-button>
              </div>
            </div>
          </template>
        </el-alert>
      </div>
    </div>
    
    <!-- 快速统计区域 -->
    <div class="quick-stats-section">
      <h3>快速统计</h3>
      
      <div class="stats-grid">
        <!-- 左侧数据 -->
        <div class="stats-left">
          <div class="stat-row">
            <div class="stat-item">
              <span class="stat-label">投注笔数:</span>
              <span class="stat-value">{{ overviewData.totalBets }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">平均投注:</span>
              <span class="stat-value">¥{{ formatAmount(averageBet) }}</span>
            </div>
          </div>
          
          <div class="stat-row">
            <div class="stat-item">
              <span class="stat-label">活跃台桌:</span>
              <span class="stat-value">{{ overviewData.activeTables }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">在线人数:</span>
              <span class="stat-value online-count">{{ overviewData.onlineUsers }}</span>
            </div>
          </div>
        </div>
        
        <!-- 右侧时段分析 -->
        <div class="stats-right">
          <div class="time-analysis">
            <h4>时段分析</h4>
            <div class="time-stats">
              <div class="time-item">
                <span class="time-label">峰值时段:</span>
                <span class="time-value">{{ peakHours }}</span>
              </div>
              <div class="time-item">
                <span class="time-label">峰值投注:</span>
                <span class="time-value">¥{{ formatAmount(peakAmount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 下方导航 -->
    <div class="navigation-section">
      <div class="nav-cards">
        <div class="nav-card" @click="$emit('navigate', 'heat-distribution')">
          <div class="nav-icon">
            <i class="el-icon-pie-chart"></i>
          </div>
          <div class="nav-content">
            <div class="nav-title">投注热度</div>
            <div class="nav-desc">查看各区域投注分布</div>
          </div>
          <div class="nav-arrow">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        
        <div class="nav-card" @click="$emit('navigate', 'ranking')">
          <div class="nav-icon">
            <i class="el-icon-trophy"></i>
          </div>
          <div class="nav-content">
            <div class="nav-title">排行榜</div>
            <div class="nav-desc">查看用户和台桌排名</div>
          </div>
          <div class="nav-arrow">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useSicboData } from '../../composables/useSicboData'

export default {
  name: 'StatsOverview',
  emits: ['navigate'],
  setup(props, { emit }) {
    // 使用数据管理
    const { tableData, refresh } = useSicboData()
    
    // 响应式数据
    const refreshing = ref(false)
    const timeRange = ref('today')
    const timer = ref(null)
    
    // 概览数据
    const overviewData = ref({
      totalAmount: 1234567,
      totalUsers: 234,
      totalBets: 1856,
      maxBet: 50000,
      maxBetUser: 'user_12345',
      activeTables: 12,
      onlineUsers: 156,
      amountChange: 12.5,
      usersChange: 8.3
    })
    
    // 异常提醒数据
    const alerts = ref([
      {
        id: 1,
        type: 'warning',
        title: '发现大额投注用户',
        description: '用户 user_12345 单注投注 ¥50,000，建议关注'
      },
      {
        id: 2,
        type: 'error',
        title: '异常投注模式',
        description: '用户 user_67890 短时间内连续大额投注，存在风险'
      }
    ])
    
    // 计算属性 - 当前日期
    const currentDate = computed(() => {
      const now = new Date()
      return now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    })
    
    // 计算属性 - 平均投注
    const averageBet = computed(() => {
      if (overviewData.value.totalUsers === 0) return 0
      return overviewData.value.totalAmount / overviewData.value.totalUsers
    })
    
    // 计算属性 - 峰值时段
    const peakHours = computed(() => {
      // 模拟数据，实际应该从后端获取
      return '20:00-22:00'
    })
    
    // 计算属性 - 峰值投注额
    const peakAmount = computed(() => {
      // 模拟数据
      return 345678
    })
    
    // 刷新数据
    const refreshData = async () => {
      refreshing.value = true
      
      try {
        await refresh()
        
        // 重新计算概览数据
        await calculateOverviewData()
        
        console.log('统计数据刷新完成')
        
      } catch (error) {
        console.error('刷新失败:', error)
      } finally {
        refreshing.value = false
      }
    }
    
    // 计算概览数据
    const calculateOverviewData = async () => {
      // 模拟异步计算
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const data = tableData.value
      
      // 计算总投注额
      const totalAmount = data.reduce((sum, item) => sum + (item.count || 0), 0)
      
      // 计算参与人数
      const totalUsers = new Set(data.map(item => item.user_id)).size
      
      // 计算投注笔数
      const totalBets = data.length
      
      // 计算最大单注
      const maxBet = Math.max(...data.map(item => item.count || 0), 0)
      
      // 计算活跃台桌数
      const activeTables = new Set(data.map(item => item.table_name)).size
      
      // 更新数据（添加一些随机变化）
      overviewData.value = {
        ...overviewData.value,
        totalAmount: totalAmount || overviewData.value.totalAmount,
        totalUsers: totalUsers || overviewData.value.totalUsers,
        totalBets: totalBets || overviewData.value.totalBets,
        maxBet: maxBet || overviewData.value.maxBet,
        activeTables: activeTables || overviewData.value.activeTables,
        onlineUsers: totalUsers + Math.floor(Math.random() * 20),
        amountChange: (Math.random() - 0.5) * 30, // -15% 到 +15%
        usersChange: (Math.random() - 0.5) * 20   // -10% 到 +10%
      }
      
      // 检查异常情况
      checkAnomalies()
    }
    
    // 检查异常情况
    const checkAnomalies = () => {
      const newAlerts = []
      
      // 检查大额投注
      if (overviewData.value.maxBet > 30000) {
        newAlerts.push({
          id: Date.now() + 1,
          type: 'warning',
          title: '发现大额投注',
          description: `最大单注 ¥${overviewData.value.maxBet.toLocaleString()}，建议关注`
        })
      }
      
      // 检查用户激增
      if (overviewData.value.usersChange > 50) {
        newAlerts.push({
          id: Date.now() + 2,
          type: 'info',
          title: '用户数量激增',
          description: `参与人数较昨日增长 ${overviewData.value.usersChange.toFixed(1)}%`
        })
      }
      
      // 只保留最新的异常提醒
      if (newAlerts.length > 0) {
        alerts.value = [...alerts.value.slice(-2), ...newAlerts].slice(-5)
      }
    }
    
    // 处理时间范围变化
    const handleTimeRangeChange = (range) => {
      console.log('时间范围切换为:', range)
      // 这里可以根据时间范围重新获取数据
    }
    
    // 查看最大投注用户
    const viewMaxBetUser = () => {
      emit('navigate', 'personal', { userId: overviewData.value.maxBetUser })
    }
    
    // 处理异常提醒
    const handleAlert = (alert) => {
      console.log('处理异常提醒:', alert)
      // 这里可以跳转到详细页面或显示详情弹窗
    }
    
    // 忽略异常提醒
    const dismissAlert = (alertId) => {
      alerts.value = alerts.value.filter(alert => alert.id !== alertId)
    }
    
    // 格式化函数
    const formatAmount = (amount) => {
      if (!amount || amount === 0) return '0'
      
      if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M'
      } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'K'
      }
      
      return amount.toLocaleString()
    }
    
    const formatChange = (change) => {
      if (!change) return '0%'
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
    }
    
    const getChangeClass = (change) => {
      if (change > 0) return 'positive'
      if (change < 0) return 'negative'
      return 'neutral'
    }
    
    const getChangeIcon = (change) => {
      if (change > 0) return 'el-icon-arrow-up'
      if (change < 0) return 'el-icon-arrow-down'
      return 'el-icon-minus'
    }
    
    // 启动定时刷新
    const startAutoRefresh = () => {
      timer.value = setInterval(() => {
        refreshData()
      }, 30000) // 30秒刷新一次
    }
    
    // 组件挂载
    onMounted(async () => {
      await calculateOverviewData()
      startAutoRefresh()
    })
    
    // 组件卸载
    onBeforeUnmount(() => {
      if (timer.value) {
        clearInterval(timer.value)
      }
    })
    
    return {
      // 响应式数据
      refreshing,
      timeRange,
      overviewData,
      alerts,
      
      // 计算属性
      currentDate,
      averageBet,
      peakHours,
      peakAmount,
      
      // 方法
      refreshData,
      handleTimeRangeChange,
      viewMaxBetUser,
      handleAlert,
      dismissAlert,
      formatAmount,
      formatChange,
      getChangeClass,
      getChangeIcon
    }
  }
}
</script>

<style scoped>
.stats-overview {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100%;
}

/* 页面头部 */
.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.header-info h2 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 28px;
}

.date-info {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 核心指标卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.metric-card.primary { border-left: 4px solid #409eff; }
.metric-card.success { border-left: 4px solid #67c23a; }
.metric-card.warning { border-left: 4px solid #e6a23c; }

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  position: relative;
  z-index: 1;
}

.metric-card.primary .card-icon {
  background: linear-gradient(135deg, #409eff 0%, #66b3ff 100%);
}

.metric-card.success .card-icon {
  background: linear-gradient(135deg, #67c23a 0%, #85d063 100%);
}

.metric-card.warning .card-icon {
  background: linear-gradient(135deg, #e6a23c 0%, #f1c057 100%);
}

.card-icon i {
  font-size: 24px;
  color: white;
}

.card-content {
  flex: 1;
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
  line-height: 1;
}

.metric-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.metric-change {
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-change.positive { color: #67c23a; }
.metric-change.negative { color: #f56c6c; }
.metric-change.neutral { color: #909399; }

.metric-action {
  margin-top: 8px;
}

/* 异常提醒区域 */
.alerts-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.alerts-section h3 {
  margin: 0 0 16px 0;
  color: #e6a23c;
  display: flex;
  align-items: center;
  gap: 8px;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  border-radius: 6px;
}

.alert-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.alert-main {
  flex: 1;
}

.alert-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.alert-desc {
  font-size: 13px;
  color: #606266;
}

.alert-actions {
  display: flex;
  gap: 8px;
}

/* 快速统计区域 */
.quick-stats-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.quick-stats-section h3 {
  margin: 0 0 20px 0;
  color: #303133;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-row:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.online-count {
  color: #67c23a;
}

.time-analysis h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.time-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.time-label {
  font-size: 13px;
  color: #909399;
}

.time-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

/* 导航区域 */
.navigation-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.nav-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-card:hover {
  border-color: #409eff;
  background: #f0f8ff;
  transform: translateX(4px);
}

.nav-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff 0%, #66b3ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.nav-icon i {
  font-size: 20px;
  color: white;
}

.nav-content {
  flex: 1;
}

.nav-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.nav-desc {
  font-size: 13px;
  color: #606266;
}

.nav-arrow {
  color: #c0c4cc;
  transition: color 0.3s;
}

.nav-card:hover .nav-arrow {
  color: #409eff;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .stats-overview {
    padding: 16px;
  }
  
  .overview-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .metric-card {
    padding: 20px;
  }
  
  .metric-value {
    font-size: 24px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .alert-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .nav-cards {
    grid-template-columns: 1fr;
  }
}
</style>