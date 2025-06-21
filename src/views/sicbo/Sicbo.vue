<template>
  <div class="sicbo-monitor">
    <header class="sicbo-header">
      <h1>骰宝监控中心</h1>
      <div class="header-info">
        <span class="refresh-time">最后刷新: {{ lastRefreshTime }}</span>
        <span class="online-count">在线: {{ onlineCount }}人</span>
      </div>
    </header>
    
    <el-tabs v-model="activeTab" class="sicbo-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="总体监控" name="overview">
        <overview-table 
          :refresh-interval="refreshInterval"
          @data-updated="handleDataUpdated"
        />
      </el-tab-pane>
      
      <el-tab-pane label="个人监控" name="personal">
        <personal-search />
      </el-tab-pane>
      
      <el-tab-pane label="统计分析" name="statistics">
        <stats-overview />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import OverviewTable from './components/overview/OverviewTable.vue'
import PersonalSearch from './components/personal/PersonalSearch.vue'
import StatsOverview from './components/statistics/StatsOverview.vue'

export default {
  name: 'SicboMonitor',
  components: {
    OverviewTable,
    PersonalSearch,
    StatsOverview
  },
  setup() {
    const activeTab = ref('overview')
    const refreshInterval = ref(3000) // 3秒刷新间隔
    const lastRefreshTime = ref('')
    const onlineCount = ref(0)
    const timer = ref(null)

    // 处理Tab切换
    const handleTabChange = (tabName) => {
      console.log('切换到:', tabName)
      // 可以在这里添加Tab切换的逻辑
    }

    // 处理数据更新
    const handleDataUpdated = (data) => {
      lastRefreshTime.value = new Date().toLocaleTimeString()
      onlineCount.value = data.onlineCount || 0
    }

    // 更新时间显示
    const updateTime = () => {
      if (!lastRefreshTime.value) {
        lastRefreshTime.value = new Date().toLocaleTimeString()
      }
    }

    // 定时更新时间显示
    const startTimeUpdate = () => {
      timer.value = setInterval(() => {
        if (lastRefreshTime.value) {
          // 可以添加相对时间显示逻辑
        }
      }, 1000)
    }

    onMounted(() => {
      updateTime()
      startTimeUpdate()
    })

    onBeforeUnmount(() => {
      if (timer.value) {
        clearInterval(timer.value)
      }
    })

    return {
      activeTab,
      refreshInterval,
      lastRefreshTime,
      onlineCount,
      handleTabChange,
      handleDataUpdated
    }
  }
}
</script>

<style scoped src="./styles/sicbo-common.less" lang="less"></style>