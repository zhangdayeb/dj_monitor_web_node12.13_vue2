<template>
  <div class="simple-ranking">
    <!-- 页面头部 -->
    <div class="ranking-header">
      <div class="header-info">
        <h3>排行榜统计</h3>
        <p class="header-desc">实时显示用户投注和台桌活跃度排名</p>
      </div>
      
      <div class="header-controls">
        <el-select v-model="timeRange" size="small" style="width: 120px">
          <el-option label="今日" value="today" />
          <el-option label="本周" value="week" />
          <el-option label="本月" value="month" />
        </el-select>
        
        <el-button 
          size="small" 
          :loading="refreshing"
          @click="refreshData"
        >
          <i class="el-icon-refresh"></i>
          刷新
        </el-button>
      </div>
    </div>
    
    <!-- 排行榜网格 -->
    <div class="ranking-grid">
      <!-- 投注金额排行 -->
      <div class="ranking-section">
        <div class="section-header">
          <h4>
            <i class="el-icon-trophy"></i>
            投注金额排行榜
          </h4>
          <div class="section-info">
            <span>{{ userRankings.length }}位用户</span>
          </div>
        </div>
        
        <div class="ranking-list">
          <div 
            v-for="(user, index) in userRankings" 
            :key="user.id"
            class="ranking-item"
            :class="getRankClass(index)"
            @click="viewUserDetail(user)"
          >
            <div class="rank-badge">
              <span class="rank-number">{{ index + 1 }}</span>
              <i v-if="index < 3" :class="getRankIcon(index)"></i>
            </div>
            
            <div class="user-avatar">
              <i class="el-icon-user"></i>
            </div>
            
            <div class="user-info">
              <div class="user-name">{{ user.name || `用户${user.id}` }}</div>
              <div class="user-id">ID: {{ user.id }}</div>
              <div class="user-stats">
                <span class="stat-item">
                  <i class="el-icon-document"></i>
                  {{ user.betCount }}笔
                </span>
                <span class="stat-item">
                  <i class="el-icon-time"></i>
                  {{ formatTime(user.lastActivity) }}
                </span>
              </div>
            </div>
            
            <div class="amount-info">
              <div class="amount-value">¥{{ formatAmount(user.totalAmount) }}</div>
              <div class="amount-change" :class="getChangeClass(user.change)">
                <i :class="getChangeIcon(user.change)"></i>
                {{ formatChange(user.change) }}
              </div>
            </div>
            
            <div class="rank-actions">
              <el-button size="mini" type="text">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="ranking-footer" v-if="userRankings.length === 0">
          <i class="el-icon-info"></i>
          <span>暂无用户数据</span>
        </div>
      </div>
      
      <!-- 台桌活跃度排行 -->
      <div class="ranking-section">
        <div class="section-header">
          <h4>
            <i class="el-icon-data-board"></i>
            台桌活跃度排行
          </h4>
          <div class="section-info">
            <span>{{ tableRankings.length }}个台桌</span>
          </div>
        </div>
        
        <div class="ranking-list">
          <div 
            v-for="(table, index) in tableRankings" 
            :key="table.name"
            class="ranking-item table-item"
            :class="getRankClass(index)"
          >
            <div class="rank-badge">
              <span class="rank-number">{{ index + 1 }}</span>
              <i v-if="index < 3" :class="getRankIcon(index)"></i>
            </div>
            
            <div class="table-icon">
              <i class="el-icon-menu"></i>
            </div>
            
            <div class="table-info">
              <div class="table-name">{{ table.name }}</div>
              <div class="table-stats">
                <div class="stat-row">
                  <span class="stat-label">投注笔数:</span>
                  <span class="stat-value">{{ table.betCount }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">投注金额:</span>
                  <span class="stat-value">¥{{ formatAmount(table.totalAmount) }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">活跃用户:</span>
                  <span class="stat-value">{{ table.activeUsers }}人</span>
                </div>
              </div>
            </div>
            
            <div class="activity-meter">
              <div class="meter-label">活跃度</div>
              <div class="meter-bar">
                <div 
                  class="meter-fill" 
                  :style="{ width: table.activityPercentage + '%' }"
                ></div>
              </div>
              <div class="meter-value">{{ table.activityPercentage }}%</div>
            </div>
          </div>
        </div>
        
        <div class="ranking-footer" v-if="tableRankings.length === 0">
          <i class="el-icon-info"></i>
          <span>暂无台桌数据</span>
        </div>
      </div>
    </div>
    
    <!-- 热门投注项排行 -->
    <div class="popular-bets-section">
      <div class="section-header">
        <h4>
          <i class="el-icon-star-on"></i>
          热门投注项排行
        </h4>
        <div class="section-tabs">
          <el-radio-group v-model="betType" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="basic">基础</el-radio-button>
            <el-radio-button label="total">总和</el-radio-button>
            <el-radio-button label="special">特殊</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <div class="popular-grid">
        <div 
          v-for="(bet, index) in filteredBetRankings" 
          :key="bet.key"
          class="popular-item"
          :class="getPopularRankClass(index)"
        >
          <div class="popular-rank">{{ index + 1 }}</div>
          
          <div class="popular-content">
            <div class="popular-header">
              <span class="popular-name">{{ bet.name }}</span>
              <span class="popular-type">{{ bet.typeName }}</span>
            </div>
            
            <div class="popular-amount">¥{{ formatAmount(bet.amount) }}</div>
            
            <div class="popular-stats">
              <div class="stat-item">
                <span class="stat-label">投注次数:</span>
                <span class="stat-value">{{ bet.count }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">占比:</span>
                <span class="stat-value">{{ bet.percentage.toFixed(1) }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">赔率:</span>
                <span class="stat-value odds">{{ bet.odds }}倍</span>
              </div>
            </div>
            
            <div class="popular-bar">
              <div 
                class="bar-fill" 
                :style="{ width: bet.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 统计摘要 -->
    <div class="ranking-summary">
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon">
            <i class="el-icon-user"></i>
          </div>
          <div class="summary-content">
            <div class="summary-title">榜首用户</div>
            <div class="summary-value">{{ topUser.name }}</div>
            <div class="summary-detail">投注 ¥{{ formatAmount(topUser.amount) }}</div>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="el-icon-data-board"></i>
          </div>
          <div class="summary-content">
            <div class="summary-title">最活跃台桌</div>
            <div class="summary-value">{{ topTable.name }}</div>
            <div class="summary-detail">{{ topTable.count }}笔投注</div>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="el-icon-star-on"></i>
          </div>
          <div class="summary-content">
            <div class="summary-title">最热投注</div>
            <div class="summary-value">{{ topBet.name }}</div>
            <div class="summary-detail">¥{{ formatAmount(topBet.amount) }}</div>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="el-icon-pie-chart"></i>
          </div>
          <div class="summary-content">
            <div class="summary-title">投注集中度</div>
            <div class="summary-value">{{ concentration }}%</div>
            <div class="summary-detail">{{ concentrationDesc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useSicboData } from '../../composables/useSicboData'

export default {
  name: 'SimpleRanking',
  emits: ['view-user'],
  setup(props, { emit }) {
    // 使用数据管理
    const { tableData, refresh } = useSicboData()
    
    // 响应式数据
    const refreshing = ref(false)
    const timeRange = ref('today')
    const betType = ref('all')
    
    // 模拟排行数据
    const userRankings = ref([
      {
        id: 'user_12345',
        name: '张三',
        totalAmount: 89234,
        betCount: 45,
        lastActivity: Date.now() - 1000 * 60 * 15, // 15分钟前
        change: 12.5
      },
      {
        id: 'user_67890',
        name: '李四',
        totalAmount: 76543,
        betCount: 38,
        lastActivity: Date.now() - 1000 * 60 * 30, // 30分钟前
        change: -5.2
      },
      {
        id: 'user_54321',
        name: '王五',
        totalAmount: 65432,
        betCount: 52,
        lastActivity: Date.now() - 1000 * 60 * 8, // 8分钟前
        change: 8.7
      },
      {
        id: 'user_98765',
        name: '赵六',
        totalAmount: 54321,
        betCount: 29,
        lastActivity: Date.now() - 1000 * 60 * 45, // 45分钟前
        change: 0
      },
      {
        id: 'user_13579',
        name: '钱七',
        totalAmount: 43210,
        betCount: 33,
        lastActivity: Date.now() - 1000 * 60 * 20, // 20分钟前
        change: 15.8
      }
    ])
    
    const tableRankings = ref([
      {
        name: '台桌A',
        betCount: 234,
        totalAmount: 567890,
        activeUsers: 23,
        activityPercentage: 95
      },
      {
        name: '台桌B',
        betCount: 198,
        totalAmount: 445678,
        activeUsers: 19,
        activityPercentage: 87
      },
      {
        name: '台桌C',
        betCount: 156,
        totalAmount: 334567,
        activeUsers: 15,
        activityPercentage: 72
      },
      {
        name: '台桌D',
        betCount: 123,
        totalAmount: 223456,
        activeUsers: 12,
        activityPercentage: 58
      },
      {
        name: '台桌E',
        betCount: 89,
        totalAmount: 112345,
        activeUsers: 8,
        activityPercentage: 41
      }
    ])
    
    const betRankings = ref([
      { key: 'big', name: '大', type: 'basic', typeName: '基础', amount: 567890, count: 234, odds: '1.00' },
      { key: 'small', name: '小', type: 'basic', typeName: '基础', amount: 478123, count: 189, odds: '1.00' },
      { key: 'even', name: '双', type: 'basic', typeName: '基础', amount: 434567, count: 198, odds: '1.00' },
      { key: 'total_7', name: '总和7', type: 'total', typeName: '总和', amount: 89234, count: 34, odds: '12.00' },
      { key: 'odd', name: '单', type: 'basic', typeName: '基础', amount: 355234, count: 156, odds: '1.00' },
      { key: 'total_8', name: '总和8', type: 'total', typeName: '总和', amount: 67123, count: 28, odds: '8.00' },
      { key: 'single_4', name: '单骰4', type: 'special', typeName: '特殊', amount: 45678, count: 61, odds: '1.00' },
      { key: 'total_10', name: '总和10', type: 'total', typeName: '总和', amount: 43210, count: 18, odds: '6.00' },
      { key: 'pair_3', name: '对子3', type: 'special', typeName: '特殊', amount: 15432, count: 15, odds: '10.00' },
      { key: 'triple_any', name: '任意三同号', type: 'special', typeName: '特殊', amount: 8765, count: 5, odds: '30.00' }
    ])
    
    // 计算属性 - 筛选后的投注排行
    const filteredBetRankings = computed(() => {
      let filtered = betRankings.value
      
      if (betType.value !== 'all') {
        filtered = filtered.filter(bet => bet.type === betType.value)
      }
      
      // 计算百分比
      const total = filtered.reduce((sum, bet) => sum + bet.amount, 0)
      
      return filtered.map(bet => ({
        ...bet,
        percentage: total > 0 ? (bet.amount / total) * 100 : 0
      })).sort((a, b) => b.amount - a.amount)
    })
    
    // 计算属性 - 榜首用户
    const topUser = computed(() => {
      if (userRankings.value.length === 0) {
        return { name: '--', amount: 0 }
      }
      const top = userRankings.value[0]
      return {
        name: top.name || `用户${top.id}`,
        amount: top.totalAmount
      }
    })
    
    // 计算属性 - 最活跃台桌
    const topTable = computed(() => {
      if (tableRankings.value.length === 0) {
        return { name: '--', count: 0 }
      }
      const top = tableRankings.value[0]
      return {
        name: top.name,
        count: top.betCount
      }
    })
    
    // 计算属性 - 最热投注
    const topBet = computed(() => {
      if (filteredBetRankings.value.length === 0) {
        return { name: '--', amount: 0 }
      }
      const top = filteredBetRankings.value[0]
      return {
        name: top.name,
        amount: top.amount
      }
    })
    
    // 计算属性 - 投注集中度
    const concentration = computed(() => {
      const total = filteredBetRankings.value.reduce((sum, bet) => sum + bet.amount, 0)
      const top3 = filteredBetRankings.value.slice(0, 3).reduce((sum, bet) => sum + bet.amount, 0)
      
      if (total === 0) return 0
      return Math.round((top3 / total) * 100)
    })
    
    const concentrationDesc = computed(() => {
      const conc = concentration.value
      if (conc >= 80) return '高度集中'
      if (conc >= 60) return '中度集中'
      if (conc >= 40) return '相对分散'
      return '分布均匀'
    })
    
    // 获取排名样式类
    const getRankClass = (index) => {
      if (index === 0) return 'rank-first'
      if (index === 1) return 'rank-second'
      if (index === 2) return 'rank-third'
      return ''
    }
    
    // 获取排名图标
    const getRankIcon = (index) => {
      const icons = ['el-icon-trophy-1', 'el-icon-medal', 'el-icon-medal']
      return icons[index] || ''
    }
    
    // 获取热门投注排名样式
    const getPopularRankClass = (index) => {
      if (index === 0) return 'popular-first'
      if (index === 1) return 'popular-second'
      if (index === 2) return 'popular-third'
      return ''
    }
    
    // 获取变化样式类
    const getChangeClass = (change) => {
      if (change > 0) return 'change-positive'
      if (change < 0) return 'change-negative'
      return 'change-neutral'
    }
    
    // 获取变化图标
    const getChangeIcon = (change) => {
      if (change > 0) return 'el-icon-caret-top'
      if (change < 0) return 'el-icon-caret-bottom'
      return 'el-icon-minus'
    }
    
    // 查看用户详情
    const viewUserDetail = (user) => {
      emit('view-user', user.id)
    }
    
    // 刷新数据
    const refreshData = async () => {
      refreshing.value = true
      
      try {
        await refresh()
        console.log('排行榜数据刷新完成')
      } catch (error) {
        console.error('刷新失败:', error)
      } finally {
        refreshing.value = false
      }
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
    
    const formatTime = (timestamp) => {
      const now = Date.now()
      const diff = now - timestamp
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(minutes / 60)
      
      if (hours > 0) return `${hours}小时前`
      if (minutes > 0) return `${minutes}分钟前`
      return '刚刚'
    }
    
    onMounted(() => {
      // 组件挂载时可以加载数据
    })
    
    return {
      // 响应式数据
      refreshing,
      timeRange,
      betType,
      userRankings,
      tableRankings,
      
      // 计算属性
      filteredBetRankings,
      topUser,
      topTable,
      topBet,
      concentration,
      concentrationDesc,
      
      // 方法
      getRankClass,
      getRankIcon,
      getPopularRankClass,
      getChangeClass,
      getChangeIcon,
      viewUserDetail,
      refreshData,
      formatAmount,
      formatChange,
      formatTime
    }
  }
}
</script>

<style scoped>
.simple-ranking {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100%;
}

/* 页面头部 */
.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.header-info h3 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 24px;
}

.header-desc {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.header-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 排行榜网格 */
.ranking-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.ranking-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h4 {
  margin: 0;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-info {
  font-size: 12px;
  color: #909399;
}

/* 排行榜列表 */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  background: #fafafa;
  transition: all 0.3s;
  cursor: pointer;
}

.ranking-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.ranking-item.rank-first {
  background: linear-gradient(135deg, #fff2e8 0%, #ffeedd 100%);
  border-color: #e6a23c;
}

.ranking-item.rank-second {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-color: #409eff;
}

.ranking-item.rank-third {
  background: linear-gradient(135deg, #f0fff0 0%, #e6ffe6 100%);
  border-color: #67c23a;
}

/* 排名徽章 */
.rank-badge {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.rank-number {
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.rank-badge i {
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 14px;
  color: #e6a23c;
}

/* 用户信息 */
.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.user-avatar i {
  font-size: 20px;
  color: white;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.user-id {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.user-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #606266;
}

.stat-item i {
  font-size: 10px;
}

/* 金额信息 */
.amount-info {
  text-align: right;
  margin-right: 16px;
}

.amount-value {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.amount-change {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  font-size: 11px;
  font-weight: 500;
}

.amount-change.change-positive { color: #67c23a; }
.amount-change.change-negative { color: #f56c6c; }
.amount-change.change-neutral { color: #909399; }

/* 台桌信息 */
.table-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff 0%, #66b3ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.table-icon i {
  font-size: 20px;
  color: white;
}

.table-info {
  flex: 1;
}

.table-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.table-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.stat-label {
  color: #909399;
}

.stat-value {
  color: #303133;
  font-weight: 500;
}

/* 活跃度计量器 */
.activity-meter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 80px;
}

.meter-label {
  font-size: 11px;
  color: #909399;
}

.meter-bar {
  width: 60px;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a 0%, #409eff 100%);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.meter-value {
  font-size: 11px;
  color: #303133;
  font-weight: 500;
}

/* 热门投注项 */
.popular-bets-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-tabs {
  display: flex;
  align-items: center;
}

.popular-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.popular-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  background: #fafafa;
  transition: all 0.3s;
}

.popular-item.popular-first {
  background: linear-gradient(135deg, #fff2e8 0%, #ffeedd 100%);
  border-color: #e6a23c;
}

.popular-item.popular-second {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-color: #409eff;
}

.popular-item.popular-third {
  background: linear-gradient(135deg, #f0fff0 0%, #e6ffe6 100%);
  border-color: #67c23a;
}

.popular-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
}

.popular-content {
  flex: 1;
}

.popular-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.popular-name {
  font-weight: 500;
  color: #303133;
}

.popular-type {
  font-size: 11px;
  background: #e4e7ed;
  color: #606266;
  padding: 2px 6px;
  border-radius: 10px;
}

.popular-amount {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.popular-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 11px;
}

.popular-stats .stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.odds {
  color: #e6a23c;
  font-weight: bold;
}

.popular-bar {
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a 0%, #409eff 100%);
  border-radius: 2px;
  transition: width 0.6s ease;
}

/* 空状态 */
.ranking-footer {
  text-align: center;
  padding: 40px;
  color: #c0c4cc;
}

.ranking-footer i {
  font-size: 32px;
  margin-bottom: 8px;
  display: block;
}

/* 统计摘要 */
.ranking-summary {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.summary-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  transition: all 0.3s;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff 0%, #66b3ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.summary-icon i {
  font-size: 20px;
  color: white;
}

.summary-content {
  flex: 1;
}

.summary-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 2px;
}

.summary-detail {
  font-size: 12px;
  color: #606266;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .simple-ranking {
    padding: 16px;
  }
  
  .ranking-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .ranking-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .ranking-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    text-align: center;
  }
  
  .user-info,
  .table-info {
    order: 1;
  }
  
  .amount-info,
  .activity-meter {
    order: 2;
  }
  
  .rank-actions {
    order: 3;
  }
  
  .popular-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>