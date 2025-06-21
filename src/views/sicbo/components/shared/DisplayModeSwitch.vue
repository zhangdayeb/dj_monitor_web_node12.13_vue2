<template>
  <div class="display-mode-switch">
    <!-- 按钮组模式 -->
    <div v-if="type === 'button'" class="switch-buttons">
      <el-radio-group 
        :model-value="currentMode" 
        @update:model-value="handleModeChange"
        :size="size"
        :disabled="disabled"
      >
        <el-radio-button 
          v-for="mode in availableModes" 
          :key="mode.value"
          :label="mode.value"
          :disabled="mode.disabled"
        >
          <i v-if="mode.icon" :class="mode.icon"></i>
          <span>{{ mode.label }}</span>
          <span v-if="showDescription && mode.description" class="mode-description">
            {{ mode.description }}
          </span>
        </el-radio-button>
      </el-radio-group>
    </div>
    
    <!-- 下拉选择模式 -->
    <div v-else-if="type === 'select'" class="switch-select">
      <el-select
        :model-value="currentMode"
        @update:model-value="handleModeChange"
        :placeholder="placeholder"
        :size="size"
        :disabled="disabled"
        :clearable="false"
        style="width: 140px"
      >
        <el-option
          v-for="mode in availableModes"
          :key="mode.value"
          :label="mode.label"
          :value="mode.value"
          :disabled="mode.disabled"
        >
          <div class="option-content">
            <i v-if="mode.icon" :class="mode.icon"></i>
            <span class="option-label">{{ mode.label }}</span>
            <span v-if="mode.columnCount" class="option-count">{{ mode.columnCount }}列</span>
          </div>
        </el-option>
      </el-select>
    </div>
    
    <!-- 标签页模式 -->
    <div v-else-if="type === 'tabs'" class="switch-tabs">
      <div class="tabs-header">
        <div 
          v-for="mode in availableModes"
          :key="mode.value"
          class="tab-item"
          :class="{ 
            'active': currentMode === mode.value,
            'disabled': mode.disabled 
          }"
          @click="!mode.disabled && handleModeChange(mode.value)"
        >
          <i v-if="mode.icon" :class="mode.icon"></i>
          <span class="tab-label">{{ mode.label }}</span>
          <span v-if="mode.columnCount" class="tab-count">{{ mode.columnCount }}</span>
        </div>
      </div>
    </div>
    
    <!-- 图标模式 -->
    <div v-else-if="type === 'icon'" class="switch-icons">
      <div class="icon-group">
        <div
          v-for="mode in availableModes"
          :key="mode.value"
          class="icon-item"
          :class="{ 
            'active': currentMode === mode.value,
            'disabled': mode.disabled 
          }"
          :title="mode.label + (mode.description ? ' - ' + mode.description : '')"
          @click="!mode.disabled && handleModeChange(mode.value)"
        >
          <i :class="mode.icon || 'el-icon-view'"></i>
        </div>
      </div>
    </div>
    
    <!-- 切换器模式 -->
    <div v-else class="switch-toggle">
      <div class="toggle-container">
        <div 
          class="toggle-track"
          :style="{ width: trackWidth + 'px' }"
        >
          <div 
            class="toggle-thumb"
            :style="thumbStyle"
          ></div>
        </div>
        
        <div class="toggle-labels">
          <div
            v-for="(mode, index) in availableModes"
            :key="mode.value"
            class="toggle-label"
            :class="{ 
              'active': currentMode === mode.value,
              'disabled': mode.disabled 
            }"
            :style="{ width: labelWidth + 'px' }"
            @click="!mode.disabled && handleModeChange(mode.value)"
          >
            <i v-if="mode.icon" :class="mode.icon"></i>
            <span>{{ mode.shortLabel || mode.label }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 模式信息提示 -->
    <div v-if="showModeInfo" class="mode-info">
      <div class="info-content">
        <div class="current-mode">
          <i :class="currentModeConfig.icon || 'el-icon-view'"></i>
          <span class="mode-name">{{ currentModeConfig.label }}</span>
        </div>
        
        <div v-if="currentModeConfig.description" class="mode-description">
          {{ currentModeConfig.description }}
        </div>
        
        <div v-if="currentModeConfig.columnCount" class="mode-stats">
          <span class="stat-item">
            <i class="el-icon-menu"></i>
            {{ currentModeConfig.columnCount }}列
          </span>
          <span v-if="currentModeConfig.maxWidth" class="stat-item">
            <i class="el-icon-full-screen"></i>
            {{ currentModeConfig.maxWidth }}px
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'DisplayModeSwitch',
  props: {
    // 当前模式
    modelValue: {
      type: String,
      default: 'overview'
    },
    
    // 组件类型
    type: {
      type: String,
      default: 'button', // button, select, tabs, icon, toggle
      validator: (value) => ['button', 'select', 'tabs', 'icon', 'toggle'].includes(value)
    },
    
    // 可用模式配置
    modes: {
      type: Array,
      default: () => [
        {
          value: 'overview',
          label: '概览',
          shortLabel: '概览',
          icon: 'el-icon-view',
          description: '显示基础投注区域',
          columnCount: 8,
          maxWidth: 1200
        },
        {
          value: 'detailed',
          label: '详细',
          shortLabel: '详细',
          icon: 'el-icon-menu',
          description: '显示常用投注区域',
          columnCount: 15,
          maxWidth: 1800
        },
        {
          value: 'complete',
          label: '完整',
          shortLabel: '完整',
          icon: 'el-icon-full-screen',
          description: '显示所有投注区域',
          columnCount: 25,
          maxWidth: 2400
        }
      ]
    },
    
    // 界面配置
    size: {
      type: String,
      default: 'default', // large, default, small, mini
      validator: (value) => ['large', 'default', 'small', 'mini'].includes(value)
    },
    
    disabled: {
      type: Boolean,
      default: false
    },
    
    placeholder: {
      type: String,
      default: '选择显示模式'
    },
    
    // 显示选项
    showDescription: {
      type: Boolean,
      default: false
    },
    
    showModeInfo: {
      type: Boolean,
      default: false
    },
    
    // 样式配置
    theme: {
      type: String,
      default: 'default', // default, primary, success, warning
      validator: (value) => ['default', 'primary', 'success', 'warning'].includes(value)
    }
  },
  emits: ['update:modelValue', 'change', 'mode-change'],
  setup(props, { emit }) {
    // 响应式数据
    const currentMode = ref(props.modelValue)
    
    // 计算属性 - 可用模式
    const availableModes = computed(() => {
      return props.modes.filter(mode => !mode.hidden)
    })
    
    // 计算属性 - 当前模式配置
    const currentModeConfig = computed(() => {
      return availableModes.value.find(mode => mode.value === currentMode.value) || availableModes.value[0]
    })
    
    // 计算属性 - 切换器轨道宽度
    const trackWidth = computed(() => {
      return availableModes.value.length * 80
    })
    
    // 计算属性 - 标签宽度
    const labelWidth = computed(() => {
      return 80
    })
    
    // 计算属性 - 滑块样式
    const thumbStyle = computed(() => {
      const index = availableModes.value.findIndex(mode => mode.value === currentMode.value)
      const translateX = index * labelWidth.value
      
      return {
        transform: `translateX(${translateX}px)`,
        width: labelWidth.value + 'px'
      }
    })
    
    // 处理模式变化
    const handleModeChange = (newMode) => {
      if (newMode === currentMode.value) return
      
      const modeConfig = availableModes.value.find(mode => mode.value === newMode)
      if (modeConfig && modeConfig.disabled) return
      
      currentMode.value = newMode
      
      // 触发事件
      emit('update:modelValue', newMode)
      emit('change', newMode)
      emit('mode-change', {
        mode: newMode,
        config: modeConfig
      })
    }
    
    // 监听外部值变化
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== currentMode.value) {
        currentMode.value = newValue
      }
    })
    
    // 获取下一个模式
    const getNextMode = () => {
      const currentIndex = availableModes.value.findIndex(mode => mode.value === currentMode.value)
      const nextIndex = (currentIndex + 1) % availableModes.value.length
      return availableModes.value[nextIndex].value
    }
    
    // 获取上一个模式
    const getPrevMode = () => {
      const currentIndex = availableModes.value.findIndex(mode => mode.value === currentMode.value)
      const prevIndex = currentIndex === 0 ? availableModes.value.length - 1 : currentIndex - 1
      return availableModes.value[prevIndex].value
    }
    
    // 切换到下一个模式
    const switchToNext = () => {
      const nextMode = getNextMode()
      handleModeChange(nextMode)
    }
    
    // 切换到上一个模式
    const switchToPrev = () => {
      const prevMode = getPrevMode()
      handleModeChange(prevMode)
    }
    
    return {
      // 响应式数据
      currentMode,
      
      // 计算属性
      availableModes,
      currentModeConfig,
      trackWidth,
      labelWidth,
      thumbStyle,
      
      // 方法
      handleModeChange,
      getNextMode,
      getPrevMode,
      switchToNext,
      switchToPrev
    }
  }
}
</script>

<style scoped>
.display-mode-switch {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

/* 按钮组模式 */
.switch-buttons .el-radio-group {
  display: flex;
}

.switch-buttons :deep(.el-radio-button__inner) {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  transition: all 0.3s;
}

.switch-buttons .mode-description {
  font-size: 11px;
  opacity: 0.8;
  margin-left: 4px;
}

/* 下拉选择模式 */
.option-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.option-content i {
  margin-right: 6px;
  color: #606266;
}

.option-label {
  flex: 1;
}

.option-count {
  font-size: 11px;
  color: #909399;
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 10px;
}

/* 标签页模式 */
.switch-tabs {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  background: #fafafa;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
  border-right: 1px solid #e4e7ed;
  background: #fafafa;
  color: #606266;
}

.tab-item:last-child {
  border-right: none;
}

.tab-item:hover:not(.disabled) {
  background: #f0f2f5;
  color: #409eff;
}

.tab-item.active {
  background: #409eff;
  color: white;
}

.tab-item.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.tab-label {
  font-size: 13px;
  font-weight: 500;
}

.tab-count {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
}

.tab-item.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

/* 图标模式 */
.switch-icons {
  display: flex;
}

.icon-group {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: #f8f9fa;
  border-radius: 8px;
}

.icon-item {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  color: #606266;
  background: transparent;
}

.icon-item:hover:not(.disabled) {
  background: #e9ecef;
  color: #409eff;
}

.icon-item.active {
  background: #409eff;
  color: white;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
}

.icon-item.disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.icon-item i {
  font-size: 14px;
}

/* 切换器模式 */
.switch-toggle {
  position: relative;
}

.toggle-container {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-track {
  height: 40px;
  background: #f0f2f5;
  border-radius: 20px;
  position: relative;
  transition: background-color 0.3s;
}

.toggle-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  height: 32px;
  background: #409eff;
  border-radius: 16px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 1;
}

.toggle-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 12px;
  font-weight: 500;
  color: #606266;
}

.toggle-label:hover:not(.disabled) {
  color: #409eff;
}

.toggle-label.active {
  color: white;
}

.toggle-label.disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.toggle-label i {
  font-size: 12px;
}

/* 模式信息 */
.mode-info {
  padding: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.current-mode {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #303133;
}

.current-mode i {
  color: #409eff;
}

.mode-name {
  font-size: 14px;
}

.mode-description {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.mode-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #909399;
}

.stat-item i {
  font-size: 10px;
}

/* 主题样式 */
.display-mode-switch[data-theme="primary"] .toggle-thumb {
  background: #409eff;
}

.display-mode-switch[data-theme="success"] .toggle-thumb {
  background: #67c23a;
}

.display-mode-switch[data-theme="warning"] .toggle-thumb {
  background: #e6a23c;
}

/* 尺寸样式 */
.display-mode-switch[data-size="large"] {
  font-size: 14px;
}

.display-mode-switch[data-size="large"] .tab-item {
  padding: 10px 20px;
}

.display-mode-switch[data-size="large"] .icon-item {
  width: 36px;
  height: 36px;
}

.display-mode-switch[data-size="small"] {
  font-size: 12px;
}

.display-mode-switch[data-size="small"] .tab-item {
  padding: 6px 12px;
}

.display-mode-switch[data-size="small"] .icon-item {
  width: 28px;
  height: 28px;
}

.display-mode-switch[data-size="mini"] {
  font-size: 11px;
}

.display-mode-switch[data-size="mini"] .tab-item {
  padding: 4px 8px;
}

.display-mode-switch[data-size="mini"] .icon-item {
  width: 24px;
  height: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .display-mode-switch {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .switch-buttons :deep(.el-radio-group) {
    flex-direction: column;
  }
  
  .switch-buttons :deep(.el-radio-button) {
    margin-bottom: 4px;
  }
  
  .switch-buttons .mode-description {
    display: none;
  }
  
  .tabs-header {
    flex-direction: column;
  }
  
  .tab-item {
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
  }
  
  .tab-item:last-child {
    border-bottom: none;
  }
  
  .icon-group {
    justify-content: center;
  }
  
  .toggle-container {
    justify-content: center;
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .tab-item,
  .icon-item,
  .toggle-thumb,
  .toggle-label {
    transition: none;
  }
}

/* 焦点样式 */
.tab-item:focus,
.icon-item:focus,
.toggle-label:focus {
  outline: 2px solid #409eff;
  outline-offset: 2px;
}
</style>