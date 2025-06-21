<template>
  <div class="quick-stats">
    <div class="stats-container">
      <!-- 主要统计指标 -->
      <div class="stats-main">
        <div class="stat-item primary">
          <div class="stat-label">
            <i class="el-icon-money"></i>
            总投注额
          </div>
          <div class="stat-value">¥{{ formatAmount(data.totalAmount) }}</div>
          <div class="stat-change" :class="getChangeClass('amount')">
            {{ getChangeText('amount') }}
          </div>
        </div>
        
        <div class="stat-item success">
          <div class="stat-label">
            <i class="el-icon-user"></i>
            参与人数
          </div>
          <div class="stat-value">{{ data.totalUsers }}</div>
          <div class="stat-change" :class="getChangeClass('users')">
            {{ getChangeText('users') }}
          </div>
        </div>
        
        <div class="stat-item warning">
          <div class="stat-label">
            <i class="el-icon-document"></i>
            投注笔数
          </div>
          <div class="stat-value">{{ data.totalRecords }}</div>
          <div class="stat-change" :class="getChangeClass('records')">
            {{ getChangeText('records') }}
          </div>
        </div>
        
        <div class="stat-item danger">
          <div class="stat-label">
            <i class="el-icon-top"></i>
            最大单注
          </div>
          <div class="stat-value">¥{{ formatAmount(data.maxBet) }}</div>
          <div class="stat-action" v-if="data.maxBet > 0">
            <el-button size="mini" type="text" @click="viewMaxBetUser">
              查看用户
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 次要统计信息 -->
      <div class="stats-secondary">
        <div class="secondary-item">
          <span class="secondary-label">
            <i class="el-icon-time"></i>
            最后更新:
          </span>
          <span class="secondary-value">{{ data.lastUpdate || '--' }}</span>
        </div>
        
        <div class="secondary-item">
          <span class="secondary-label">
            <i class="el-icon-connection"></i>
            在线人数:
          </span>
          <span class="secondary-value online-count">{{ onlineCount }}人</span>
        </div>
        
        <div class="secondary-item">
          <span class="secondary-label">
            <i class="el-icon-pie-chart"></i>
            平均投注:
          </span>
          <span class="secondary-value">¥{{ formatAmount(averageBet) }}</span>
        </div>
        
        <div class="secondary-item" v-if="hasAlerts">
          <span class="secondary-label alert">
            <i class="el-icon-warning"></i>
            异常提醒:
          </span>
          <span class="secondary-value alert">{{ alertCount }}条</span>
          <el-button size="mini" type="text" @click="viewAlerts">
            查看详情
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'QuickStats',
  props: {
    data: {
      type: Object,
      default: () => ({
        totalAmount: 0,
        totalUsers: 0,
        totalRecords: 0,
        maxBet: 0,
        lastUpdate: ''
      })
    },
    onlineCount: {
      type: Number,
      default: 0
    },
    previousData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['view-max-bet-user', 'view-alerts'],
  setup(props, { emit }) {
    // 响应式数据
    const alertCount = ref(0)
    
    // 计算属性 - 平均投注
    const averageBet = computed(() => {
      if (props.data.totalUsers === 0) return 0
      return props.data.totalAmount / props.data.totalUsers
    })
    
    // 计算属性 - 是否有警告
    const hasAlerts = computed(() => {
      // 检查是否有大额投注等异常情况
      return props.data.maxBet > 50000 || alertCount.value > 0
    })
    
    // 格式化金额显示
    const formatAmount = (amount) => {
      if (!amount || amount === 0) return '0'
      
      if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M'
      } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'K'
      }
      
      return amount.toLocaleString()
    }
    
    // 获取变化样式类
    const getChangeClass = (type) => {
      const current = props.data[`total${type.charAt(0).toUpperCase() + type.slice(1)}`]
      const previous = props.previousData[`total${type.charAt(0).toUpperCase() + type.slice(1)}`]
      
      if (!previous || current === previous) return ''
      return current > previous ? 'positive' : 'negative'
    }
    
    // 获取变化文本
    const getChangeText = (type) => {
      const current = props.data[`total${type.charAt(0).toUpperCase() + type.slice(1)}`]
      const previous = props.previousData[`total${type.charAt(0).toUpperCase() + type.slice(1)}`]
      
      if (!previous || current === previous) return ''
      
      const change = current - previous
      const percentage = ((change / previous) * 100).toFixed(1)
      const arrow = change > 0 ? '↑' : '↓'
      
      return `${arrow}${Math.abs(percentage)}%`
    }
    
    // 查看最大投注用户
    const viewMaxBetUser = () => {
      emit('view-max-bet-user')
    }
    
    // 查看警告详情
    const viewAlerts = () => {
      emit('view-alerts')
    }
    
    return {
      // 计算属性
      averageBet,
      hasAlerts,
      alertCount,
      
      // 方法
      formatAmount,
      getChangeClass,
      getChangeText,
      viewMaxBetUser,
      viewAlerts
    }
  }
}
</script>

<style scoped>
.quick-stats {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 16px;
  margin-top: 16px;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 主要统计区域 */
.stats-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-item {
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid;
  background: #fafafa;
  position: relative;
}

.stat-item.primary {
  border-left-color: #409eff;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
}

.stat-item.success {
  border-left-color: #67c23a;
  background: linear-gradient(135deg, #f0fff0 0%, #e6ffe6 100%);
}

.stat-item.warning {
  border-left-color: #e6a23c;
  background: linear-gradient(135deg, #fffef0 0%, #fffbe6 100%);
}

.stat-item.danger {
  border-left-color: #f56c6c;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
}

.stat-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: #67c23a;
}

.stat-change.negative {
  color: #f56c6c;
}

.stat-action {
  position: absolute;
  top: 8px;
  right: 8px;
}

/* 次要统计区域 */
.stats-secondary {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.secondary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.secondary-label {
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.secondary-label.alert {
  color: #e6a23c;
}

.secondary-value {
  color: #303133;
  font-weight: 500;
}

.secondary-value.alert {
  color: #e6a23c;
}

.online-count {
  color: #67c23a;
  font-weight: bold;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .stats-main {
    grid-template-columns: 1fr;
  }
  
  .stats-secondary {
    flex-direction: column;
    gap: 12px;
  }
  
  .stat-value {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .quick-stats {
    padding: 12px;
  }
  
  .stat-item {
    padding: 12px;
  }
  
  .stat-value {
    font-size: 18px;
  }
}
</style>