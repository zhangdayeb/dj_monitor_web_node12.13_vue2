<template>
  <div class="personal-detail">
    <!-- 详情头部 -->
    <div class="detail-header">
      <div class="user-info">
        <div class="user-avatar">
          <i class="el-icon-user"></i>
        </div>
        <div class="user-basic">
          <h2>{{ userData.user_name || '未知用户' }}</h2>
          <p class="user-id">用户ID: {{ userData.user_id }}</p>
          <div class="user-tags">
            <el-tag :type="getUserLevelType()" size="small">
              {{ getUserLevel() }}
            </el-tag>
            <el-tag v-if="isHighRisk" type="danger" size="small">
              高风险用户
            </el-tag>
            <el-tag v-if="isVip" type="warning" size="small">
              VIP用户
            </el-tag>
          </div>
        </div>
      </div>
      
      <div class="header-actions">
        <el-button size="small" @click="refreshData">
          <i class="el-icon-refresh"></i>
          刷新数据
        </el-button>
        <el-button size="small" @click="$emit('close')">
          <i class="el-icon-close"></i>
          关闭
        </el-button>
      </div>
    </div>
    
    <!-- 概览统计 -->
    <div class="overview-stats">
      <div class="stat-card primary">
        <div class="stat-icon">
          <i class="el-icon-money"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ formatAmount(totalBet) }}</div>
          <div class="stat-label">总投注额</div>
        </div>
      </div>
      
      <div class="stat-card success">
        <div class="stat-icon">
          <i class="el-icon-document"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ betCount }}</div>
          <div class="stat-label">投注次数</div>
        </div>
      </div>
      
      <div class="stat-card warning">
        <div class="stat-icon">
          <i class="el-icon-top"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ formatAmount(maxSingleBet) }}</div>
          <div class="stat-label">最大单注</div>
        </div>
      </div>
      
      <div class="stat-card info">
        <div class="stat-icon">
          <i class="el-icon-time"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatTime(lastActivity) }}</div>
          <div class="stat-label">最后活动</div>
        </div>
      </div>
    </div>
    
    <!-- 投注分组详情 -->
    <div class="bet-groups">
      <h3>投注分布详情</h3>
      <div class="groups-container">
        <bet-group-card
          v-for="group in betGroups"
          :key="group.key"
          :group="group"
          :data="groupData[group.key]"
          :total-amount="groupTotals[group.key]"
          :expanded="expandedGroups.includes(group.key)"
          @toggle="toggleGroup"
        />
      </div>
    </div>
    
    <!-- 投注历史记录 -->
    <div class="bet-history">
      <div class="history-header">
        <h3>最近投注记录</h3>
        <div class="history-controls">
          <el-select v-model="historyFilter" size="small">
            <el-option label="全部记录" value="all" />
            <el-option label="今日记录" value="today" />
            <el-option label="大额投注" value="large" />
          </el-select>
          <el-button size="small" @click="loadMoreHistory">
            加载更多
          </el-button>
        </div>
      </div>
      
      <div class="history-table">
        <el-table
          :data="filteredHistory"
          size="small"
          max-height="300"
        >
          <el-table-column prop="created_at" label="时间" width="120">
            <template #default="{ row }">
              {{ formatDateTime(row.created_at) }}
            </template>
          </el-table-column>
          
          <el-table-column prop="table_name" label="台桌" width="80" />
          
          <el-table-column prop="bet_type" label="投注类型" width="100">
            <template #default="{ row }">
              {{ getBetTypeName(row) }}
            </template>
          </el-table-column>
          
          <el-table-column prop="bet_amt" label="投注金额" width="100" align="right">
            <template #default="{ row }">
              <span :class="getAmountClass(row.bet_amt)">
                ¥{{ formatAmount(row.bet_amt) }}
              </span>
            </template>
          </el-table-column>
          
          <el-table-column prop="win_amt" label="输赢" width="100" align="right">
            <template #default="{ row }">
              <span :class="getWinClass(row.win_amt)">
                {{ formatWinAmount(row.win_amt) }}
              </span>
            </template>
          </el-table-column>
          
          <el-table-column prop="close_status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.close_status)" size="mini">
                {{ getStatusText(row.close_status) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    
    <!-- 风险评估 -->
    <div class="risk-assessment" v-if="riskLevel > 0">
      <h3>风险评估</h3>
      <div class="risk-content">
        <div class="risk-level">
          <el-progress
            :percentage="riskLevel"
            :color="getRiskColor()"
            :show-text="false"
          />
          <span class="risk-text">风险等级: {{ getRiskLevelText() }}</span>
        </div>
        
        <div class="risk-factors" v-if="riskFactors.length > 0">
          <h4>风险因素:</h4>
          <ul>
            <li v-for="factor in riskFactors" :key="factor">{{ factor }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import BetGroupCard from './BetGroupCard.vue'
import { useSicboConfig } from '../../composables/useSicboConfig'

export default {
  name: 'PersonalDetail',
  components: {
    BetGroupCard
  },
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup(props) {
    // 使用配置管理
    const { betGroups } = useSicboConfig()
    
    // 响应式数据
    const expandedGroups = ref(['basic']) // 默认展开基础区域
    const historyFilter = ref('all')
    const betHistory = ref([])
    const loading = ref(false)
    
    // 计算属性 - 基础统计
    const totalBet = computed(() => props.userData.totalBet || 0)
    const betCount = computed(() => props.userData.betCount || 0)
    const maxSingleBet = computed(() => props.userData.maxBet || 0)
    const lastActivity = computed(() => props.userData.lastActivity || Date.now())
    
    // 计算属性 - 用户等级
    const getUserLevel = () => {
      const amount = totalBet.value
      if (amount >= 100000) return '钻石用户'
      if (amount >= 50000) return '金牌用户'
      if (amount >= 10000) return '银牌用户'
      return '普通用户'
    }
    
    const getUserLevelType = () => {
      const amount = totalBet.value
      if (amount >= 100000) return 'danger'
      if (amount >= 50000) return 'warning'
      if (amount >= 10000) return 'success'
      return 'info'
    }
    
    const isHighRisk = computed(() => {
      return maxSingleBet.value > 50000 || totalBet.value > 200000
    })
    
    const isVip = computed(() => {
      return totalBet.value > 100000
    })
    
    // 计算属性 - 投注分组数据
    const groupData = computed(() => {
      const tableData = props.userData.tableData || []
      const groups = {}
      
      betGroups.value.forEach(group => {
        groups[group.key] = tableData.filter(item => {
          // 根据group.key判断数据属于哪个分组
          // 这里需要根据实际的数据结构和分组逻辑来实现
          return true // 暂时返回所有数据
        })
      })
      
      return groups
    })
    
    const groupTotals = computed(() => {
      const totals = {}
      Object.keys(groupData.value).forEach(key => {
        totals[key] = groupData.value[key].reduce((sum, item) => sum + (item.count || 0), 0)
      })
      return totals
    })
    
    // 计算属性 - 过滤后的历史记录
    const filteredHistory = computed(() => {
      let history = betHistory.value
      
      switch (historyFilter.value) {
        case 'today':
          const today = new Date().toDateString()
          history = history.filter(item => 
            new Date(item.created_at).toDateString() === today
          )
          break
        case 'large':
          history = history.filter(item => item.bet_amt > 1000)
          break
      }
      
      return history.slice(0, 20) // 限制显示条数
    })
    
    // 计算属性 - 风险评估
    const riskLevel = computed(() => {
      let risk = 0
      
      // 根据投注金额计算风险
      if (totalBet.value > 100000) risk += 30
      if (maxSingleBet.value > 50000) risk += 40
      if (betCount.value > 100) risk += 20
      
      // 根据投注模式计算风险
      const recentLargeBets = betHistory.value.filter(item => 
        item.bet_amt > 10000 && 
        new Date(item.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length
      
      if (recentLargeBets > 5) risk += 30
      
      return Math.min(risk, 100)
    })
    
    const riskFactors = computed(() => {
      const factors = []
      
      if (totalBet.value > 100000) {
        factors.push('总投注额过高')
      }
      if (maxSingleBet.value > 50000) {
        factors.push('存在大额单注')
      }
      if (betCount.value > 100) {
        factors.push('投注频次过高')
      }
      
      return factors
    })
    
    // 切换分组展开状态
    const toggleGroup = (groupKey) => {
      const index = expandedGroups.value.indexOf(groupKey)
      if (index > -1) {
        expandedGroups.value.splice(index, 1)
      } else {
        expandedGroups.value.push(groupKey)
      }
    }
    
    // 刷新数据
    const refreshData = () => {
      // 这里可以重新获取用户数据
      console.log('刷新用户数据:', props.userData.user_id)
    }
    
    // 加载更多历史记录
    const loadMoreHistory = () => {
      // 这里可以加载更多历史数据
      console.log('加载更多历史记录')
    }
    
    // 格式化函数
    const formatAmount = (amount) => {
      if (!amount) return '0'
      return amount.toLocaleString()
    }
    
    const formatTime = (timestamp) => {
      const now = Date.now()
      const diff = now - timestamp
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      
      if (days > 0) return `${days}天前`
      if (hours > 0) return `${hours}小时前`
      if (minutes > 0) return `${minutes}分钟前`
      return '刚刚'
    }
    
    const formatDateTime = (dateTime) => {
      return new Date(dateTime).toLocaleString()
    }
    
    const formatWinAmount = (amount) => {
      if (!amount) return '-'
      return amount > 0 ? `+¥${amount}` : `-¥${Math.abs(amount)}`
    }
    
    // 获取样式类
    const getAmountClass = (amount) => {
      if (amount > 10000) return 'amount-high'
      if (amount > 1000) return 'amount-medium'
      return 'amount-low'
    }
    
    const getWinClass = (amount) => {
      if (amount > 0) return 'win-positive'
      if (amount < 0) return 'win-negative'
      return 'win-neutral'
    }
    
    const getStatusType = (status) => {
      switch (status) {
        case 1: return 'warning' // 待开牌
        case 2: return 'success' // 已结算
        case 3: return 'danger'  // 台面作废
        case 4: return 'info'    // 修改结果
        default: return 'info'
      }
    }
    
    const getStatusText = (status) => {
      switch (status) {
        case 1: return '待开牌'
        case 2: return '已结算'
        case 3: return '作废'
        case 4: return '已修改'
        default: return '未知'
      }
    }
    
    const getBetTypeName = (record) => {
      // 根据record的投注数据判断投注类型
      return '基础投注' // 简化处理
    }
    
    const getRiskColor = () => {
      if (riskLevel.value >= 80) return '#f56c6c'
      if (riskLevel.value >= 60) return '#e6a23c'
      if (riskLevel.value >= 40) return '#409eff'
      return '#67c23a'
    }
    
    const getRiskLevelText = () => {
      if (riskLevel.value >= 80) return '高风险'
      if (riskLevel.value >= 60) return '中等风险'
      if (riskLevel.value >= 40) return '低风险'
      return '正常'
    }
    
    // 组件挂载时加载历史数据
    onMounted(() => {
      // 模拟历史数据
      betHistory.value = [
        {
          created_at: new Date().toISOString(),
          table_name: '台桌A',
          bet_amt: 1500,
          win_amt: 300,
          close_status: 2
        },
        // 更多历史记录...
      ]
    })
    
    return {
      // 响应式数据
      betGroups,
      expandedGroups,
      historyFilter,
      betHistory,
      loading,
      
      // 计算属性
      totalBet,
      betCount,
      maxSingleBet,
      lastActivity,
      isHighRisk,
      isVip,
      groupData,
      groupTotals,
      filteredHistory,
      riskLevel,
      riskFactors,
      
      // 方法
      getUserLevel,
      getUserLevelType,
      toggleGroup,
      refreshData,
      loadMoreHistory,
      formatAmount,
      formatTime,
      formatDateTime,
      formatWinAmount,
      getAmountClass,
      getWinClass,
      getStatusType,
      getStatusText,
      getBetTypeName,
      getRiskColor,
      getRiskLevelText
    }
  }
}
</script>

<style scoped>
.personal-detail {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}

/* 详情头部 */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar i {
  font-size: 24px;
  color: white;
}

.user-basic h2 {
  margin: 0 0 4px 0;
  color: #303133;
}

.user-id {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 14px;
}

.user-tags {
  display: flex;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 概览统计 */
.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card.primary { border-left-color: #409eff; }
.stat-card.success { border-left-color: #67c23a; }
.stat-card.warning { border-left-color: #e6a23c; }
.stat-card.info { border-left-color: #909399; }

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-card.primary .stat-icon { background: #e6f3ff; color: #409eff; }
.stat-card.success .stat-icon { background: #f0fff0; color: #67c23a; }
.stat-card.warning .stat-icon { background: #fffef0; color: #e6a23c; }
.stat-card.info .stat-icon { background: #f4f4f5; color: #909399; }

.stat-icon i {
  font-size: 20px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

/* 投注分组 */
.bet-groups {
  margin-bottom: 24px;
}

.bet-groups h3 {
  margin: 0 0 16px 0;
  color: #303133;
}

.groups-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 投注历史 */
.bet-history {
  margin-bottom: 24px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.history-header h3 {
  margin: 0;
  color: #303133;
}

.history-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.history-table {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

/* 金额样式 */
.amount-high { color: #f56c6c; font-weight: bold; }
.amount-medium { color: #e6a23c; }
.amount-low { color: #606266; }

.win-positive { color: #67c23a; }
.win-negative { color: #f56c6c; }
.win-neutral { color: #909399; }

/* 风险评估 */
.risk-assessment {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.risk-assessment h3 {
  margin: 0 0 16px 0;
  color: #303133;
}

.risk-level {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.risk-text {
  font-weight: 500;
  color: #303133;
}

.risk-factors h4 {
  margin: 0 0 8px 0;
  color: #f56c6c;
}

.risk-factors ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .history-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
</style>