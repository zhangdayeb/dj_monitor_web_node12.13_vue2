<template>
  <div 
    class="bet-amount-cell"
    :class="[
      amountLevelClass,
      oddsLevelClass,
      displayModeClass,
      { 
        'clickable': clickable,
        'has-animation': showAnimation,
        'is-zero': amount === 0,
        'is-highlighted': highlighted
      }
    ]"
    :style="cellStyle"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 主要金额显示 -->
    <div class="amount-main">
      <span class="amount-value">{{ formattedAmount }}</span>
      <span v-if="showOdds && odds" class="amount-odds">({{ odds }})</span>
    </div>
    
    <!-- 次要信息 -->
    <div v-if="showSecondaryInfo" class="amount-secondary">
      <!-- 相对百分比 -->
      <span v-if="showPercentage && percentage > 0" class="amount-percentage">
        {{ percentage.toFixed(1) }}%
      </span>
      
      <!-- 变化指示 -->
      <span v-if="showChange && change !== 0" class="amount-change" :class="getChangeClass()">
        <i :class="getChangeIcon()"></i>
        {{ formatChange() }}
      </span>
      
      <!-- 投注次数 -->
      <span v-if="showCount && count > 0" class="amount-count">
        {{ count }}次
      </span>
    </div>
    
    <!-- 热度指示器 -->
    <div v-if="showHeatIndicator" class="heat-indicator">
      <div 
        class="heat-bar" 
        :style="{ width: heatPercentage + '%' }"
      ></div>
    </div>
    
    <!-- 金额等级图标 -->
    <div v-if="showLevelIcon" class="level-icon">
      <i :class="getLevelIcon()"></i>
    </div>
    
    <!-- 悬停提示内容 -->
    <div v-if="showTooltip" class="amount-tooltip">
      <div class="tooltip-content">
        <div class="tooltip-row">
          <span class="tooltip-label">投注金额:</span>
          <span class="tooltip-value">¥{{ amount.toLocaleString() }}</span>
        </div>
        <div v-if="odds" class="tooltip-row">
          <span class="tooltip-label">赔率:</span>
          <span class="tooltip-value">{{ odds }}倍</span>
        </div>
        <div v-if="maxAmount > 0" class="tooltip-row">
          <span class="tooltip-label">占比:</span>
          <span class="tooltip-value">{{ ((amount / maxAmount) * 100).toFixed(1) }}%</span>
        </div>
        <div v-if="count > 0" class="tooltip-row">
          <span class="tooltip-label">投注次数:</span>
          <span class="tooltip-value">{{ count }}次</span>
        </div>
      </div>
    </div>
    
    <!-- 粒子效果（大额投注时） -->
    <div v-if="showParticles" class="particles">
      <div 
        v-for="i in particleCount" 
        :key="i" 
        class="particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'BetAmountCell',
  props: {
    // 基础数据
    amount: {
      type: Number,
      default: 0
    },
    odds: {
      type: String,
      default: ''
    },
    maxAmount: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    change: {
      type: Number,
      default: 0
    },
    
    // 显示配置
    displayMode: {
      type: String,
      default: 'overview', // overview, detailed, complete
      validator: (value) => ['overview', 'detailed', 'complete'].includes(value)
    },
    format: {
      type: String,
      default: 'auto', // auto, short, full
      validator: (value) => ['auto', 'short', 'full'].includes(value)
    },
    
    // 功能开关
    clickable: {
      type: Boolean,
      default: false
    },
    showOdds: {
      type: Boolean,
      default: true
    },
    showPercentage: {
      type: Boolean,
      default: false
    },
    showCount: {
      type: Boolean,
      default: false
    },
    showChange: {
      type: Boolean,
      default: false
    },
    showHeatIndicator: {
      type: Boolean,
      default: false
    },
    showLevelIcon: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: false
    },
    showAnimation: {
      type: Boolean,
      default: true
    },
    
    // 样式配置
    size: {
      type: String,
      default: 'default', // small, default, large
      validator: (value) => ['small', 'default', 'large'].includes(value)
    },
    theme: {
      type: String,
      default: 'default', // default, dark, colorful
      validator: (value) => ['default', 'dark', 'colorful'].includes(value)
    },
    highlighted: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'hover', 'leave'],
  setup(props, { emit }) {
    // 响应式数据
    const isHovered = ref(false)
    const animationTimer = ref(null)
    const particleCount = ref(6)
    
    // 计算属性 - 显示的次要信息
    const showSecondaryInfo = computed(() => {
      return props.displayMode !== 'overview' && (
        (props.showPercentage && props.maxAmount > 0) ||
        (props.showChange && props.change !== 0) ||
        (props.showCount && props.count > 0)
      )
    })
    
    // 计算属性 - 格式化金额
    const formattedAmount = computed(() => {
      if (props.amount === 0) return '0'
      
      const amount = props.amount
      
      switch (props.format) {
        case 'short':
          return formatAmountShort(amount)
        case 'full':
          return `¥${amount.toLocaleString()}`
        default: // auto
          if (props.displayMode === 'overview') {
            return formatAmountShort(amount)
          } else {
            return amount >= 10000 ? formatAmountShort(amount) : `¥${amount.toLocaleString()}`
          }
      }
    })
    
    // 计算属性 - 金额等级样式类
    const amountLevelClass = computed(() => {
      const amount = props.amount
      
      if (amount === 0) return 'amount-zero'
      if (amount >= 50000) return 'amount-ultra'
      if (amount >= 10000) return 'amount-high'
      if (amount >= 1000) return 'amount-medium'
      return 'amount-low'
    })
    
    // 计算属性 - 赔率等级样式类
    const oddsLevelClass = computed(() => {
      if (!props.odds) return ''
      
      const odds = parseFloat(props.odds)
      if (odds >= 100) return 'odds-ultra'
      if (odds >= 50) return 'odds-very-high'
      if (odds >= 20) return 'odds-high'
      if (odds >= 10) return 'odds-medium'
      if (odds >= 5) return 'odds-low'
      return 'odds-basic'
    })
    
    // 计算属性 - 显示模式样式类
    const displayModeClass = computed(() => {
      return `display-${props.displayMode}`
    })
    
    // 计算属性 - 百分比
    const percentage = computed(() => {
      if (props.maxAmount === 0) return 0
      return (props.amount / props.maxAmount) * 100
    })
    
    // 计算属性 - 热度百分比
    const heatPercentage = computed(() => {
      return Math.min(percentage.value, 100)
    })
    
    // 计算属性 - 单元格样式
    const cellStyle = computed(() => {
      const style = {}
      
      // 根据主题设置样式
      if (props.theme === 'colorful') {
        const intensity = Math.min(percentage.value / 100, 1)
        style.background = `rgba(64, 158, 255, ${intensity * 0.1})`
      }
      
      // 根据大小设置样式
      const sizeMap = {
        small: { fontSize: '11px', padding: '4px 6px' },
        default: { fontSize: '13px', padding: '6px 8px' },
        large: { fontSize: '15px', padding: '8px 10px' }
      }
      
      Object.assign(style, sizeMap[props.size] || sizeMap.default)
      
      return style
    })
    
    // 计算属性 - 是否显示粒子效果
    const showParticles = computed(() => {
      return props.showAnimation && props.amount >= 50000 && isHovered.value
    })
    
    // 格式化金额（简短形式）
    const formatAmountShort = (amount) => {
      if (amount >= 1000000) {
        return `¥${(amount / 1000000).toFixed(1)}M`
      } else if (amount >= 1000) {
        return `¥${(amount / 1000).toFixed(1)}K`
      }
      return `¥${amount}`
    }
    
    // 格式化变化
    const formatChange = () => {
      const change = props.change
      if (change === 0) return '0%'
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
    }
    
    // 获取变化样式类
    const getChangeClass = () => {
      if (props.change > 0) return 'change-positive'
      if (props.change < 0) return 'change-negative'
      return 'change-neutral'
    }
    
    // 获取变化图标
    const getChangeIcon = () => {
      if (props.change > 0) return 'el-icon-caret-top'
      if (props.change < 0) return 'el-icon-caret-bottom'
      return 'el-icon-minus'
    }
    
    // 获取等级图标
    const getLevelIcon = () => {
      const amount = props.amount
      if (amount >= 50000) return 'el-icon-star-on'
      if (amount >= 10000) return 'el-icon-warning'
      if (amount >= 1000) return 'el-icon-info'
      return 'el-icon-circle-check'
    }
    
    // 获取粒子样式
    const getParticleStyle = (index) => {
      const angle = (index / particleCount.value) * 360
      const distance = 20 + Math.random() * 10
      const duration = 1 + Math.random() * 0.5
      
      return {
        transform: `rotate(${angle}deg) translateX(${distance}px)`,
        animationDuration: `${duration}s`,
        animationDelay: `${index * 0.1}s`
      }
    }
    
    // 事件处理
    const handleClick = (event) => {
      if (props.clickable) {
        emit('click', {
          amount: props.amount,
          odds: props.odds,
          event
        })
      }
    }
    
    const handleMouseEnter = () => {
      isHovered.value = true
      emit('hover', {
        amount: props.amount,
        odds: props.odds
      })
    }
    
    const handleMouseLeave = () => {
      isHovered.value = false
      emit('leave', {
        amount: props.amount,
        odds: props.odds
      })
    }
    
    // 监听金额变化，触发动画
    watch(() => props.amount, (newAmount, oldAmount) => {
      if (props.showAnimation && newAmount > oldAmount && newAmount > 0) {
        triggerAmountChangeAnimation()
      }
    })
    
    // 触发金额变化动画
    const triggerAmountChangeAnimation = () => {
      if (animationTimer.value) {
        clearTimeout(animationTimer.value)
      }
      
      // 添加动画类
      const element = document.querySelector('.bet-amount-cell')
      if (element) {
        element.classList.add('amount-increase')
        
        animationTimer.value = setTimeout(() => {
          element.classList.remove('amount-increase')
        }, 600)
      }
    }
    
    onBeforeUnmount(() => {
      if (animationTimer.value) {
        clearTimeout(animationTimer.value)
      }
    })
    
    return {
      // 响应式数据
      isHovered,
      particleCount,
      
      // 计算属性
      showSecondaryInfo,
      formattedAmount,
      amountLevelClass,
      oddsLevelClass,
      displayModeClass,
      percentage,
      heatPercentage,
      cellStyle,
      showParticles,
      
      // 方法
      formatChange,
      getChangeClass,
      getChangeIcon,
      getLevelIcon,
      getParticleStyle,
      
      // 事件处理
      handleClick,
      handleMouseEnter,
      handleMouseLeave
    }
  }
}
</script>

<style scoped>
.bet-amount-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  min-height: 28px;
  border-radius: 4px;
  transition: all 0.3s ease;
  overflow: hidden;
  user-select: none;
}

/* 可点击状态 */
.bet-amount-cell.clickable {
  cursor: pointer;
}

.bet-amount-cell.clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 零金额状态 */
.bet-amount-cell.is-zero {
  opacity: 0.5;
}

.bet-amount-cell.is-zero .amount-value {
  color: #c0c4cc;
}

/* 高亮状态 */
.bet-amount-cell.is-highlighted {
  background: linear-gradient(135deg, #e6f3ff 0%, #f0f8ff 100%);
  border: 1px solid #409eff;
}

/* 主要金额显示 */
.amount-main {
  display: flex;
  align-items: baseline;
  gap: 4px;
  line-height: 1;
}

.amount-value {
  font-weight: 600;
  font-family: 'Consolas', 'Monaco', monospace;
}

.amount-odds {
  font-size: 0.85em;
  opacity: 0.8;
  font-weight: normal;
}

/* 次要信息 */
.amount-secondary {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  font-size: 0.8em;
  opacity: 0.9;
}

.amount-percentage {
  color: #606266;
  font-weight: 500;
}

.amount-change {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.9em;
  font-weight: 500;
}

.amount-change.change-positive {
  color: #67c23a;
}

.amount-change.change-negative {
  color: #f56c6c;
}

.amount-change.change-neutral {
  color: #909399;
}

.amount-count {
  color: #909399;
  font-size: 0.85em;
}

/* 热度指示器 */
.heat-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(0, 0, 0, 0.05);
}

.heat-bar {
  height: 100%;
  background: linear-gradient(90deg, #67c23a 0%, #e6a23c 50%, #f56c6c 100%);
  transition: width 0.6s ease;
}

/* 等级图标 */
.level-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
  opacity: 0.6;
}

/* 金额等级样式 */
.amount-zero .amount-value {
  color: #c0c4cc;
}

.amount-low .amount-value {
  color: #67c23a;
}

.amount-medium .amount-value {
  color: #409eff;
}

.amount-high .amount-value {
  color: #e6a23c;
  font-weight: bold;
}

.amount-ultra .amount-value {
  color: #f56c6c;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(245, 108, 108, 0.3);
}

/* 赔率等级样式 */
.odds-basic .amount-odds {
  color: #67c23a;
}

.odds-low .amount-odds {
  color: #409eff;
}

.odds-medium .amount-odds {
  color: #e6a23c;
}

.odds-high .amount-odds {
  color: #f56c6c;
}

.odds-very-high .amount-odds {
  color: #f56c6c;
  font-weight: bold;
}

.odds-ultra .amount-odds {
  color: #f56c6c;
  font-weight: bold;
  animation: pulse 2s infinite;
}

/* 显示模式样式 */
.display-overview {
  text-align: right;
}

.display-detailed {
  text-align: right;
}

.display-complete {
  text-align: center;
}

/* 悬停提示 */
.amount-tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  transform: translateY(-5px);
}

.bet-amount-cell:hover .amount-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.tooltip-label {
  opacity: 0.8;
}

.tooltip-value {
  font-weight: 500;
}

/* 粒子效果 */
.particles {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #409eff;
  border-radius: 50%;
  opacity: 0;
  animation: particle-float 1.5s ease-out forwards;
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes particle-float {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
}

.bet-amount-cell.amount-increase {
  animation: amount-increase 0.6s ease;
}

@keyframes amount-increase {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 暗色主题 */
.bet-amount-cell[data-theme="dark"] {
  background: rgba(0, 0, 0, 0.05);
  color: #e4e7ed;
}

.bet-amount-cell[data-theme="dark"] .amount-value {
  color: #f0f2f5;
}

/* 彩色主题 */
.bet-amount-cell[data-theme="colorful"] {
  border: 1px solid transparent;
  background-clip: padding-box;
}

.bet-amount-cell[data-theme="colorful"].amount-high {
  background: linear-gradient(135deg, #fff2e8 0%, #ffeedd 100%);
  border-color: rgba(230, 162, 60, 0.3);
}

.bet-amount-cell[data-theme="colorful"].amount-ultra {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
  border-color: rgba(245, 108, 108, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bet-amount-cell {
    min-height: 24px;
    font-size: 12px;
  }
  
  .amount-secondary {
    font-size: 10px;
  }
  
  .amount-tooltip {
    font-size: 10px;
    padding: 6px 8px;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .bet-amount-cell {
    border: 1px solid;
  }
  
  .amount-ultra .amount-value {
    text-shadow: none;
    font-weight: 900;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .bet-amount-cell,
  .heat-bar,
  .amount-tooltip {
    transition: none;
  }
  
  .particle,
  .bet-amount-cell.amount-increase {
    animation: none;
  }
}
</style>