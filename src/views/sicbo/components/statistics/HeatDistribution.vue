<template>
  <div class="heat-distribution">
    <!-- 页面头部 -->
    <div class="heat-header">
      <div class="header-info">
        <h3>投注热度分布</h3>
        <p class="header-desc">实时显示各投注区域的热度分布情况</p>
      </div>
      
      <div class="header-controls">
        <el-select v-model="viewMode" size="small" style="width: 120px">
          <el-option label="金额视图" value="amount" />
          <el-option label="次数视图" value="count" />
          <el-option label="占比视图" value="percentage" />
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
    
    <!-- 基础区域热度 -->
    <div class="basic-heat-section">
      <div class="section-header">
        <h4>
          <i class="el-icon-pie-chart"></i>
          基础投注区域
        </h4>
        <div class="legend">
          <span class="legend-item">
            <span class="legend-color high"></span>
            高热度
          </span>
          <span class="legend-item">
            <span class="legend-color medium"></span>
            中热度
          </span>
          <span class="legend-item">
            <span class="legend-color low"></span>
            低热度
          </span>
        </div>
      </div>
      
      <div class="basic-bars">
        <div 
          v-for="item in basicHeatData" 
          :key="item.key"
          class="heat-bar-item"
          :class="getHeatLevel(item.percentage)"
        >
          <div class="bar-header">
            <span class="bar-label">{{ item.label }}</span>
            <span class="bar-value">{{ formatValue(item) }}</span>
          </div>
          
          <div class="bar-container">
            <div 
              class="bar-fill" 
              :style="{ width: item.percentage + '%' }"
            >
              <div class="bar-percentage">{{ item.percentage.toFixed(1) }}%</div>
            </div>
          </div>
          
          <div class="bar-stats">
            <span class="stat-item">
              投注: ¥{{ formatAmount(item.amount) }}
            </span>
            <span class="stat-item">
              次数: {{ item.count }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 总和区域热度 -->
    <div class="total-heat-section">
      <div class="section-header">
        <h4>
          <i class="el-icon-data-line"></i>
          总和投注热度 (Top 10)
        </h4>
        <div class="section-info">
          <span>显示最热门的总和投注项</span>
        </div>
      </div>
      
      <div class="total-grid">
        <div 
          v-for="(item, index) in topTotalData" 
          :key="item.key"
          class="total-item"
          :class="getTotalRankClass(index)"
        >
          <div class="total-rank">
            <span class="rank-number">{{ index + 1 }}</span>
          </div>
          
          <div class="total-content">
            <div class="total-header">
              <span class="total-name">{{ item.label }}</span>
              <span class="total-odds">{{ item.odds }}倍</span>
            </div>
            
            <div class="total-amount">¥{{ formatAmount(item.amount) }}</div>
            
            <div class="total-progress">
              <div 
                class="progress-fill" 
                :style="{ width: item.percentage + '%' }"
              ></div>
            </div>
            
            <div class="total-details">
              <span>{{ item.count }}次投注</span>
              <span>{{ item.percentage.toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 特殊区域热度 -->
    <div class="special-heat-section">
      <div class="section-header">
        <h4>
          <i class="el-icon-star-on"></i>
          特殊投注区域
        </h4>
        <el-tabs v-model="specialTab" size="small">
          <el-tab-pane label="单骰" name="single" />
          <el-tab-pane label="对子" name="pair" />
          <el-tab-pane label="三同号" name="triple" />
        </el-tabs>
      </div>
      
      <div class="special-content">
        <!-- 单骰热度 -->
        <div v-show="specialTab === 'single'" class="single-heat">
          <div class="dice-grid">
            <div 
              v-for="item in singleHeatData" 
              :key="item.key"
              class="dice-item"
              :class="getDiceHeatClass(item)"
            >
              <div class="dice-face">{{ item.number }}</div>
              <div class="dice-amount">¥{{ formatAmount(item.amount) }}</div>
              <div class="dice-heat">
                <div 
                  class="heat-circle" 
                  :style="{ 
                    background: getHeatColor(item.percentage),
                    transform: `scale(${Math.max(0.3, item.percentage / 100)})` 
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 对子热度 -->
        <div v-show="specialTab === 'pair'" class="pair-heat">
          <div class="pair-list">
            <div 
              v-for="item in pairHeatData" 
              :key="item.key"
              class="pair-item"
            >
              <div class="pair-visual">
                <div class="dice-mini">{{ item.number }}</div>
                <div class="dice-mini">{{ item.number }}</div>
              </div>
              
              <div class="pair-info">
                <div class="pair-name">对子{{ item.number }}</div>
                <div class="pair-amount">¥{{ formatAmount(item.amount) }}</div>
              </div>
              
              <div class="pair-meter">
                <div 
                  class="meter-fill" 
                  :style="{ height: item.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 三同号热度 -->
        <div v-show="specialTab === 'triple'" class="triple-heat">
          <div class="triple-container">
            <div class="triple-specific">
              <h5>指定三同号</h5>
              <div class="triple-grid">
                <div 
                  v-for="item in tripleHeatData" 
                  :key="item.key"
                  class="triple-item"
                  v-if="item.key !== 'any_triple'"
                >
                  <div class="triple-visual">
                    <div class="dice-tiny">{{ item.number }}</div>
                    <div class="dice-tiny">{{ item.number }}</div>
                    <div class="dice-tiny">{{ item.number }}</div>
                  </div>
                  <div class="triple-amount">¥{{ formatAmount(item.amount) }}</div>
                </div>
              </div>
            </div>
            
            <div class="triple-any">
              <h5>任意三同号</h5>
              <div class="any-triple-card">
                <div class="any-amount">
                  ¥{{ formatAmount(getAnyTripleAmount()) }}
                </div>
                <div class="any-desc">所有三同号总和</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 热度统计摘要 -->
    <div class="heat-summary">
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-label">最热门区域</div>
          <div class="summary-value">{{ hottestArea.name }}</div>
          <div class="summary-detail">¥{{ formatAmount(hottestArea.amount) }}</div>
        </div>
        
        <div class="summary-card">
          <div class="summary-label">投注分布</div>
          <div class="summary-value">{{ distributionBalance }}%</div>
          <div class="summary-detail">{{ balanceDescription }}</div>
        </div>
        
        <div class="summary-card">
          <div class="summary-label">热度指数</div>
          <div class="summary-value">{{ heatIndex }}</div>
          <div class="summary-detail">{{ heatDescription }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useSicboData } from '../../composables/useSicboData'

export default {
  name: 'HeatDistribution',
  setup() {
    // 使用数据管理
    const { tableData, refresh } = useSicboData()
    
    // 响应式数据
    const refreshing = ref(false)
    const viewMode = ref('amount') // amount, count, percentage
    const specialTab = ref('single')
    
    // 模拟热度数据
    const heatData = ref({
      basic: {
        big: { amount: 567890, count: 234 },
        small: { amount: 478123, count: 189 },
        odd: { amount: 355234, count: 156 },
        even: { amount: 534567, count: 198 }
      },
      total: {
        total_4: { amount: 12340, count: 5 },
        total_5: { amount: 23450, count: 8 },
        total_6: { amount: 45670, count: 15 },
        total_7: { amount: 89234, count: 34 },
        total_8: { amount: 67123, count: 28 },
        total_9: { amount: 54321, count: 22 },
        total_10: { amount: 76543, count: 31 },
        total_11: { amount: 65432, count: 26 },
        total_12: { amount: 43210, count: 18 },
        total_13: { amount: 32109, count: 13 },
        total_14: { amount: 21098, count: 9 },
        total_15: { amount: 15678, count: 6 },
        total_16: { amount: 9876, count: 4 },
        total_17: { amount: 5432, count: 2 }
      },
      single: {
        single_1: { amount: 23456, count: 45 },
        single_2: { amount: 34567, count: 52 },
        single_3: { amount: 12345, count: 38 },
        single_4: { amount: 45678, count: 61 },
        single_5: { amount: 23456, count: 44 },
        single_6: { amount: 34567, count: 48 }
      },
      pair: {
        pair_1: { amount: 12340, count: 12 },
        pair_2: { amount: 8765, count: 8 },
        pair_3: { amount: 15432, count: 15 },
        pair_4: { amount: 6789, count: 6 },
        pair_5: { amount: 11234, count: 11 },
        pair_6: { amount: 9876, count: 9 }
      },
      triple: {
        triple_1: { amount: 5432, count: 3 },
        triple_2: { amount: 3210, count: 2 },
        triple_3: { amount: 6543, count: 4 },
        triple_4: { amount: 2109, count: 1 },
        triple_5: { amount: 4321, count: 2 },
        triple_6: { amount: 1098, count: 1 },
        any_triple: { amount: 8765, count: 5 }
      }
    })
    
    // 计算属性 - 基础区域热度
    const basicHeatData = computed(() => {
      const data = heatData.value.basic
      const total = Object.values(data).reduce((sum, item) => sum + getItemValue(item), 0)
      
      return [
        { key: 'big', label: '大', ...data.big, percentage: getItemValue(data.big) / total * 100 },
        { key: 'small', label: '小', ...data.small, percentage: getItemValue(data.small) / total * 100 },
        { key: 'odd', label: '单', ...data.odd, percentage: getItemValue(data.odd) / total * 100 },
        { key: 'even', label: '双', ...data.even, percentage: getItemValue(data.even) / total * 100 }
      ].sort((a, b) => b.percentage - a.percentage)
    })
    
    // 计算属性 - 总和区域热度（Top 10）
    const topTotalData = computed(() => {
      const data = heatData.value.total
      const total = Object.values(data).reduce((sum, item) => sum + getItemValue(item), 0)
      
      const oddsMap = {
        4: '60.00', 5: '30.00', 6: '17.00', 7: '12.00',
        8: '8.00', 9: '6.00', 10: '6.00', 11: '6.00',
        12: '6.00', 13: '8.00', 14: '12.00', 15: '17.00',
        16: '30.00', 17: '60.00'
      }
      
      return Object.entries(data)
        .map(([key, value]) => {
          const number = parseInt(key.replace('total_', ''))
          return {
            key,
            label: `总和${number}`,
            number,
            odds: oddsMap[number],
            ...value,
            percentage: getItemValue(value) / total * 100
          }
        })
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10)
    })
    
    // 计算属性 - 单骰热度
    const singleHeatData = computed(() => {
      const data = heatData.value.single
      const maxValue = Math.max(...Object.values(data).map(item => getItemValue(item)))
      
      return Object.entries(data).map(([key, value]) => {
        const number = parseInt(key.replace('single_', ''))
        return {
          key,
          number,
          ...value,
          percentage: getItemValue(value) / maxValue * 100
        }
      })
    })
    
    // 计算属性 - 对子热度
    const pairHeatData = computed(() => {
      const data = heatData.value.pair
      const maxValue = Math.max(...Object.values(data).map(item => getItemValue(item)))
      
      return Object.entries(data).map(([key, value]) => {
        const number = parseInt(key.replace('pair_', ''))
        return {
          key,
          number,
          ...value,
          percentage: getItemValue(value) / maxValue * 100
        }
      })
    })
    
    // 计算属性 - 三同号热度
    const tripleHeatData = computed(() => {
      const data = heatData.value.triple
      
      return Object.entries(data).map(([key, value]) => {
        const number = key === 'any_triple' ? 0 : parseInt(key.replace('triple_', ''))
        return {
          key,
          number,
          ...value
        }
      })
    })
    
    // 计算属性 - 最热门区域
    const hottestArea = computed(() => {
      const allAreas = [
        ...basicHeatData.value.map(item => ({ ...item, type: 'basic' })),
        ...topTotalData.value.slice(0, 3).map(item => ({ ...item, type: 'total' }))
      ]
      
      const hottest = allAreas.reduce((prev, current) => 
        getItemValue(current) > getItemValue(prev) ? current : prev
      )
      
      return {
        name: hottest.label,
        amount: getItemValue(hottest)
      }
    })
    
    // 计算属性 - 分布平衡度
    const distributionBalance = computed(() => {
      const basicValues = basicHeatData.value.map(item => item.percentage)
      const maxDiff = Math.max(...basicValues) - Math.min(...basicValues)
      return Math.max(0, 100 - maxDiff).toFixed(0)
    })
    
    const balanceDescription = computed(() => {
      const balance = parseInt(distributionBalance.value)
      if (balance >= 80) return '分布均衡'
      if (balance >= 60) return '分布较均衡'
      if (balance >= 40) return '分布不均衡'
      return '分布极不均衡'
    })
    
    // 计算属性 - 热度指数
    const heatIndex = computed(() => {
      const totalBets = Object.values(heatData.value.basic)
        .reduce((sum, item) => sum + item.count, 0)
      
      if (totalBets >= 500) return '极热'
      if (totalBets >= 300) return '很热'
      if (totalBets >= 150) return '一般'
      return '冷清'
    })
    
    const heatDescription = computed(() => {
      const index = heatIndex.value
      const descriptions = {
        '极热': '投注非常活跃',
        '很热': '投注比较活跃',
        '一般': '投注活跃度正常',
        '冷清': '投注活跃度较低'
      }
      return descriptions[index] || ''
    })
    
    // 获取项目值（根据视图模式）
    const getItemValue = (item) => {
      switch (viewMode.value) {
        case 'count': return item.count
        case 'percentage': return item.amount // 这里仍用amount计算百分比
        default: return item.amount
      }
    }
    
    // 格式化显示值
    const formatValue = (item) => {
      switch (viewMode.value) {
        case 'count': return `${item.count}次`
        case 'percentage': return `${item.percentage.toFixed(1)}%`
        default: return `¥${formatAmount(item.amount)}`
      }
    }
    
    // 获取热度等级
    const getHeatLevel = (percentage) => {
      if (percentage >= 35) return 'heat-high'
      if (percentage >= 20) return 'heat-medium'
      return 'heat-low'
    }
    
    // 获取总和排名样式
    const getTotalRankClass = (index) => {
      if (index === 0) return 'rank-first'
      if (index === 1) return 'rank-second'
      if (index === 2) return 'rank-third'
      return ''
    }
    
    // 获取骰子热度样式
    const getDiceHeatClass = (item) => {
      if (item.percentage >= 80) return 'dice-hot'
      if (item.percentage >= 50) return 'dice-warm'
      return 'dice-cool'
    }
    
    // 获取热度颜色
    const getHeatColor = (percentage) => {
      const ratio = percentage / 100
      if (ratio >= 0.8) return '#f56c6c'
      if (ratio >= 0.6) return '#e6a23c'
      if (ratio >= 0.4) return '#409eff'
      return '#67c23a'
    }
    
    // 获取任意三同号金额
    const getAnyTripleAmount = () => {
      return heatData.value.triple.any_triple.amount
    }
    
    // 刷新数据
    const refreshData = async () => {
      refreshing.value = true
      
      try {
        await refresh()
        // 这里应该重新计算热度数据
        console.log('热度数据刷新完成')
      } catch (error) {
        console.error('刷新失败:', error)
      } finally {
        refreshing.value = false
      }
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
    
    onMounted(() => {
      // 组件挂载时可以加载数据
    })
    
    return {
      // 响应式数据
      refreshing,
      viewMode,
      specialTab,
      
      // 计算属性
      basicHeatData,
      topTotalData,
      singleHeatData,
      pairHeatData,
      tripleHeatData,
      hottestArea,
      distributionBalance,
      balanceDescription,
      heatIndex,
      heatDescription,
      
      // 方法
      refreshData,
      formatValue,
      formatAmount,
      getHeatLevel,
      getTotalRankClass,
      getDiceHeatClass,
      getHeatColor,
      getAnyTripleAmount
    }
  }
}
</script>

<style scoped>
.heat-distribution {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100%;
}

/* 页面头部 */
.heat-header {
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

/* 通用区域样式 */
.basic-heat-section,
.total-heat-section,
.special-heat-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
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

/* 图例 */
.legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.high { background: #f56c6c; }
.legend-color.medium { background: #e6a23c; }
.legend-color.low { background: #67c23a; }

/* 基础区域热度条 */
.basic-bars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.heat-bar-item {
  padding: 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.heat-bar-item.heat-high {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
  border-color: #f56c6c;
}

.heat-bar-item.heat-medium {
  background: linear-gradient(135deg, #fffef0 0%, #fffbe6 100%);
  border-color: #e6a23c;
}

.heat-bar-item.heat-low {
  background: linear-gradient(135deg, #f0fff0 0%, #e6ffe6 100%);
  border-color: #67c23a;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.bar-label {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.bar-value {
  font-size: 14px;
  font-weight: bold;
  color: #409eff;
}

.bar-container {
  position: relative;
  height: 24px;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a 0%, #e6a23c 50%, #f56c6c 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
  transition: width 0.6s ease;
  position: relative;
}

.bar-percentage {
  color: white;
  font-size: 11px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.bar-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

/* 总和区域网格 */
.total-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.total-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  transition: all 0.3s;
}

.total-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.total-item.rank-first {
  background: linear-gradient(135deg, #fff2e8 0%, #ffeedd 100%);
  border-color: #e6a23c;
}

.total-item.rank-second {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-color: #409eff;
}

.total-item.rank-third {
  background: linear-gradient(135deg, #f0fff0 0%, #e6ffe6 100%);
  border-color: #67c23a;
}

.total-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.rank-number {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.total-content {
  flex: 1;
}

.total-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.total-name {
  font-weight: 500;
  color: #303133;
}

.total-odds {
  font-size: 11px;
  background: #e6a23c;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.total-progress {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a 0%, #409eff 100%);
  border-radius: 3px;
  transition: width 0.6s ease;
}

.total-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

/* 特殊区域样式 */
.special-content {
  margin-top: 16px;
}

/* 单骰网格 */
.dice-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.dice-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  background: #fff;
  transition: all 0.3s;
  position: relative;
}

.dice-item.dice-hot {
  border-color: #f56c6c;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
}

.dice-item.dice-warm {
  border-color: #e6a23c;
  background: linear-gradient(135deg, #fffef0 0%, #fffbe6 100%);
}

.dice-item.dice-cool {
  border-color: #67c23a;
  background: linear-gradient(135deg, #f0fff0 0%, #e6ffe6 100%);
}

.dice-face {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
}

.dice-amount {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.dice-heat {
  position: relative;
  width: 24px;
  height: 24px;
}

.heat-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: all 0.6s ease;
}

/* 对子列表 */
.pair-list {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.pair-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.pair-visual {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.dice-mini {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.pair-info {
  text-align: center;
  margin-bottom: 12px;
}

.pair-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.pair-amount {
  font-size: 12px;
  color: #409eff;
  font-weight: 500;
}

.pair-meter {
  width: 8px;
  height: 60px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.meter-fill {
  width: 100%;
  background: linear-gradient(0deg, #67c23a 0%, #e6a23c 50%, #f56c6c 100%);
  border-radius: 4px;
  transition: height 0.6s ease;
  position: absolute;
  bottom: 0;
}

/* 三同号容器 */
.triple-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.triple-specific h5,
.triple-any h5 {
  margin: 0 0 16px 0;
  color: #303133;
}

.triple-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.triple-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.triple-visual {
  display: flex;
  gap: 2px;
  margin-bottom: 8px;
}

.dice-tiny {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.triple-amount {
  font-size: 11px;
  color: #409eff;
  font-weight: 500;
}

.any-triple-card {
  text-align: center;
  padding: 24px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border: 1px solid #409eff;
}

.any-amount {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.any-desc {
  font-size: 12px;
  color: #606266;
}

/* 热度摘要 */
.heat-summary {
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
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
}

.summary-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.summary-detail {
  font-size: 12px;
  color: #606266;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .heat-distribution {
    padding: 16px;
  }
  
  .heat-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .basic-bars {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .total-grid {
    grid-template-columns: 1fr;
  }
  
  .dice-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .pair-list {
    flex-direction: column;
  }
  
  .triple-container {
    grid-template-columns: 1fr;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>