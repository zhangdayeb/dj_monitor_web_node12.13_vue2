<template>
  <div class="bet-group-card">
    <el-card :body-style="{ padding: '0' }">
      <!-- 卡片头部 -->
      <template #header>
        <div class="card-header" @click="toggleExpanded">
          <div class="header-left">
            <i 
              :class="expandIcon" 
              class="expand-icon"
            ></i>
            <div class="group-info">
              <span class="group-name">{{ group.name }}</span>
              <span class="group-desc" v-if="group.description">
                {{ group.description }}
              </span>
            </div>
          </div>
          
          <div class="header-right">
            <div class="total-amount" :class="getAmountClass(totalAmount)">
              ¥{{ formatAmount(totalAmount) }}
            </div>
            <div class="bet-count" v-if="betCount > 0">
              {{ betCount }}项投注
            </div>
          </div>
        </div>
      </template>
      
      <!-- 卡片内容 -->
      <div class="card-content" v-show="isExpanded">
        <!-- 投注项列表 -->
        <div class="bet-items" v-if="betItems.length > 0">
          <div class="items-grid">
            <div
              v-for="item in betItems"
              :key="item.key"
              class="bet-item"
              :class="getItemClass(item)"
            >
              <div class="item-header">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-odds" v-if="item.odds">
                  {{ item.odds }}倍
                </span>
              </div>
              
              <div class="item-amount">
                ¥{{ formatAmount(item.amount) }}
              </div>
              
              <div class="item-details" v-if="item.details">
                <div class="detail-row" v-for="detail in item.details" :key="detail.label">
                  <span class="detail-label">{{ detail.label }}:</span>
                  <span class="detail-value">{{ detail.value }}</span>
                </div>
              </div>
              
              <!-- 投注热度条 -->
              <div class="heat-bar" v-if="showHeatBar">
                <div 
                  class="heat-fill" 
                  :style="{ width: getHeatPercentage(item) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 无投注状态 -->
        <div class="no-bets" v-else>
          <i class="el-icon-info"></i>
          <span>该区域暂无投注</span>
        </div>
        
        <!-- 统计信息 -->
        <div class="group-stats" v-if="betItems.length > 0">
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-label">投注项数:</span>
              <span class="stat-value">{{ activeBetCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">平均投注:</span>
              <span class="stat-value">¥{{ formatAmount(averageBet) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最大单项:</span>
              <span class="stat-value">¥{{ formatAmount(maxBetItem) }}</span>
            </div>
            <div class="stat-item" v-if="group.key === 'total'">
              <span class="stat-label">热门数字:</span>
              <span class="stat-value">{{ popularNumber }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'BetGroupCard',
  props: {
    group: {
      type: Object,
      required: true,
      default: () => ({
        key: '',
        name: '',
        description: '',
        collapsible: true
      })
    },
    data: {
      type: Array,
      default: () => []
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    expanded: {
      type: Boolean,
      default: false
    },
    showHeatBar: {
      type: Boolean,
      default: true
    }
  },
  emits: ['toggle'],
  setup(props, { emit }) {
    // 响应式数据
    const isExpanded = ref(props.expanded)
    
    // 计算属性 - 展开图标
    const expandIcon = computed(() => {
      return isExpanded.value ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
    })
    
    // 计算属性 - 投注项数量
    const betCount = computed(() => {
      return props.data.length
    })
    
    // 计算属性 - 处理后的投注项
    const betItems = computed(() => {
      return processBetData(props.data, props.group.key)
    })
    
    // 计算属性 - 活跃投注项数量
    const activeBetCount = computed(() => {
      return betItems.value.filter(item => item.amount > 0).length
    })
    
    // 计算属性 - 平均投注
    const averageBet = computed(() => {
      const activeItems = betItems.value.filter(item => item.amount > 0)
      if (activeItems.length === 0) return 0
      
      const total = activeItems.reduce((sum, item) => sum + item.amount, 0)
      return total / activeItems.length
    })
    
    // 计算属性 - 最大单项投注
    const maxBetItem = computed(() => {
      return Math.max(...betItems.value.map(item => item.amount), 0)
    })
    
    // 计算属性 - 热门数字（仅总和区域）
    const popularNumber = computed(() => {
      if (props.group.key !== 'total') return ''
      
      const maxItem = betItems.value.reduce((prev, current) => 
        (prev.amount > current.amount) ? prev : current, { amount: 0 }
      )
      
      return maxItem.name || ''
    })
    
    // 处理投注数据
    const processBetData = (data, groupKey) => {
      const items = []
      
      switch (groupKey) {
        case 'basic':
          items.push(
            { key: 'big', name: '大', amount: getBetAmount(data, 'sum_bet_amt_305'), odds: '1.00' },
            { key: 'small', name: '小', amount: getBetAmount(data, 'sum_bet_amt_304'), odds: '1.00' },
            { key: 'odd', name: '单', amount: getBetAmount(data, 'sum_bet_amt_306'), odds: '1.00' },
            { key: 'even', name: '双', amount: getBetAmount(data, 'sum_bet_amt_307'), odds: '1.00' }
          )
          break
          
        case 'total':
          // 总和4-17
          for (let i = 4; i <= 17; i++) {
            const propName = `sum_bet_amt_${308 + (i - 4)}`
            const odds = getTotalOdds(i)
            items.push({
              key: `total_${i}`,
              name: `总和${i}`,
              amount: getBetAmount(data, propName),
              odds: odds
            })
          }
          break
          
        case 'single':
          // 单骰1-6
          for (let i = 1; i <= 6; i++) {
            const propName = `sum_bet_amt_${322 + (i - 1)}`
            items.push({
              key: `single_${i}`,
              name: `单骰${i}`,
              amount: getBetAmount(data, propName),
              odds: '1.00'
            })
          }
          break
          
        case 'pair':
          // 对子1-6
          for (let i = 1; i <= 6; i++) {
            const propName = `sum_bet_amt_${328 + (i - 1)}`
            items.push({
              key: `pair_${i}`,
              name: `对子${i}`,
              amount: getBetAmount(data, propName),
              odds: '10.00'
            })
          }
          break
          
        case 'triple':
          // 三同号1-6
          for (let i = 1; i <= 6; i++) {
            const propName = `sum_bet_amt_${334 + (i - 1)}`
            items.push({
              key: `triple_${i}`,
              name: `三同${i}`,
              amount: getBetAmount(data, propName),
              odds: '180.00'
            })
          }
          // 任意三同号
          items.push({
            key: 'any_triple',
            name: '任意三同',
            amount: getBetAmount(data, 'sum_bet_amt_340'),
            odds: '30.00'
          })
          break
          
        case 'combo':
          // 组合投注（简化处理，显示前几个）
          const combos = [
            { key: 'combo_1_2', name: '1-2', propName: 'sum_bet_amt_341' },
            { key: 'combo_1_3', name: '1-3', propName: 'sum_bet_amt_342' },
            { key: 'combo_2_3', name: '2-3', propName: 'sum_bet_amt_346' },
            { key: 'combo_4_5', name: '4-5', propName: 'sum_bet_amt_353' },
            { key: 'combo_5_6', name: '5-6', propName: 'sum_bet_amt_355' }
          ]
          
          combos.forEach(combo => {
            items.push({
              key: combo.key,
              name: `组合${combo.name}`,
              amount: getBetAmount(data, combo.propName),
              odds: '6.00'
            })
          })
          break
      }
      
      return items
    }
    
    // 获取投注金额
    const getBetAmount = (data, propName) => {
      return data.reduce((sum, item) => sum + (item[propName] || 0), 0)
    }
    
    // 获取总和赔率
    const getTotalOdds = (number) => {
      const oddsMap = {
        4: '60.00', 5: '30.00', 6: '17.00', 7: '12.00',
        8: '8.00', 9: '6.00', 10: '6.00', 11: '6.00',
        12: '6.00', 13: '8.00', 14: '12.00', 15: '17.00',
        16: '30.00', 17: '60.00'
      }
      return oddsMap[number] || '1.00'
    }
    
    // 切换展开状态
    const toggleExpanded = () => {
      if (!props.group.collapsible) return
      
      isExpanded.value = !isExpanded.value
      emit('toggle', props.group.key)
    }
    
    // 获取金额样式类
    const getAmountClass = (amount) => {
      if (amount >= 10000) return 'amount-high'
      if (amount >= 1000) return 'amount-medium'
      if (amount > 0) return 'amount-low'
      return 'amount-zero'
    }
    
    // 获取投注项样式类
    const getItemClass = (item) => {
      const classes = []
      
      if (item.amount > 0) {
        classes.push('has-bet')
        
        if (item.amount >= 5000) classes.push('high-bet')
        else if (item.amount >= 1000) classes.push('medium-bet')
        else classes.push('low-bet')
      }
      
      // 高赔率项目特殊标识
      if (parseFloat(item.odds) >= 50) {
        classes.push('high-odds')
      }
      
      return classes
    }
    
    // 获取热度百分比
    const getHeatPercentage = (item) => {
      if (maxBetItem.value === 0) return 0
      return (item.amount / maxBetItem.value) * 100
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
    
    return {
      // 响应式数据
      isExpanded,
      
      // 计算属性
      expandIcon,
      betCount,
      betItems,
      activeBetCount,
      averageBet,
      maxBetItem,
      popularNumber,
      
      // 方法
      toggleExpanded,
      getAmountClass,
      getItemClass,
      getHeatPercentage,
      formatAmount
    }
  }
}
</script>

<style scoped>
.bet-group-card {
  margin-bottom: 12px;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s;
  padding: 4px 0;
}

.card-header:hover {
  background-color: #f8f9fa;
  margin: -4px -20px;
  padding: 4px 20px;
  border-radius: 4px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-icon {
  font-size: 14px;
  color: #909399;
  transition: transform 0.3s;
}

.group-info {
  display: flex;
  flex-direction: column;
}

.group-name {
  font-weight: 500;
  color: #303133;
  font-size: 16px;
}

.group-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.header-right {
  text-align: right;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 2px;
}

.total-amount.amount-high { color: #f56c6c; }
.total-amount.amount-medium { color: #e6a23c; }
.total-amount.amount-low { color: #67c23a; }
.total-amount.amount-zero { color: #c0c4cc; }

.bet-count {
  font-size: 12px;
  color: #909399;
}

/* 卡片内容 */
.card-content {
  padding: 16px 20px;
}

/* 投注项网格 */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.bet-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.bet-item.has-bet {
  border-color: #d4edda;
  background: #f8fff9;
}

.bet-item.high-bet {
  border-color: #f8d7da;
  background: #fff5f5;
}

.bet-item.medium-bet {
  border-color: #fff3cd;
  background: #fffef5;
}

.bet-item.high-odds {
  background: linear-gradient(135deg, #fff2e8 0%, #ffeedd 100%);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-name {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.item-odds {
  font-size: 11px;
  background: #e6a23c;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
}

.item-amount {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.bet-item.has-bet .item-amount {
  color: #67c23a;
}

.bet-item.high-bet .item-amount {
  color: #f56c6c;
}

.item-details {
  font-size: 11px;
  color: #909399;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}

/* 热度条 */
.heat-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #f0f0f0;
}

.heat-fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a 0%, #e6a23c 50%, #f56c6c 100%);
  transition: width 0.3s;
}

/* 无投注状态 */
.no-bets {
  text-align: center;
  padding: 40px 20px;
  color: #c0c4cc;
}

.no-bets i {
  font-size: 32px;
  margin-bottom: 8px;
  display: block;
}

/* 统计信息 */
.group-stats {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }
  
  .bet-item {
    padding: 8px;
  }
  
  .item-amount {
    font-size: 14px;
  }
  
  .stats-row {
    justify-content: center;
  }
  
  .stat-item {
    min-width: 60px;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .header-right {
    text-align: left;
  }
  
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>