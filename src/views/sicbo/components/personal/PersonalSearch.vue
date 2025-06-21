<template>
  <div class="personal-search">
    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="search-bar">
        <div class="search-input-group">
          <el-input
            v-model="searchInput"
            placeholder="输入用户ID或用户名进行搜索"
            size="large"
            clearable
            @input="handleSearchInput"
            @keyup.enter="handleSearch"
          >
            <template #prepend>
              <el-select v-model="searchType" style="width: 100px">
                <el-option label="用户ID" value="user_id" />
                <el-option label="用户名" value="user_name" />
              </el-select>
            </template>
            <template #append>
              <el-button 
                type="primary" 
                :loading="searching"
                @click="handleSearch"
              >
                <i class="el-icon-search"></i>
                搜索
              </el-button>
            </template>
          </el-input>
        </div>
        
        <div class="search-options">
          <el-checkbox v-model="includeHistory">包含历史记录</el-checkbox>
          <el-checkbox v-model="onlyActiveUsers">仅显示活跃用户</el-checkbox>
        </div>
      </div>
      
      <!-- 快速搜索按钮 -->
      <div class="quick-search" v-if="recentUsers.length > 0">
        <div class="quick-search-label">最近搜索:</div>
        <div class="quick-search-buttons">
          <el-tag
            v-for="user in recentUsers"
            :key="user.id"
            type="info"
            effect="plain"
            closable
            @click="selectRecentUser(user)"
            @close="removeRecentUser(user.id)"
            class="recent-user-tag"
          >
            {{ user.name }} ({{ user.id }})
          </el-tag>
        </div>
      </div>
    </div>
    
    <!-- 搜索结果列表 -->
    <div class="search-results" v-if="showResults">
      <div class="results-header">
        <h3>搜索结果 ({{ searchResults.length }})</h3>
        <el-button size="small" @click="clearResults">清空结果</el-button>
      </div>
      
      <div class="results-list" v-if="searchResults.length > 0">
        <div
          v-for="user in searchResults"
          :key="user.user_id"
          class="result-item"
          :class="{ active: selectedUserId === user.user_id }"
          @click="selectUser(user)"
        >
          <div class="user-basic-info">
            <div class="user-avatar">
              <i class="el-icon-user"></i>
            </div>
            <div class="user-details">
              <div class="user-name">{{ user.user_name || '未知用户' }}</div>
              <div class="user-id">ID: {{ user.user_id }}</div>
            </div>
          </div>
          
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-label">总投注:</span>
              <span class="stat-value">¥{{ formatAmount(user.totalBet) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">投注次数:</span>
              <span class="stat-value">{{ user.betCount }}次</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最后活动:</span>
              <span class="stat-value">{{ formatTime(user.lastActivity) }}</span>
            </div>
          </div>
          
          <div class="user-actions">
            <el-button size="small" type="primary" @click.stop="viewUserDetail(user)">
              查看详情
            </el-button>
            <el-button size="small" type="default" @click.stop="addToWatch(user)">
              加入监控
            </el-button>
          </div>
        </div>
      </div>
      
      <div class="no-results" v-else>
        <i class="el-icon-search"></i>
        <p>未找到匹配的用户</p>
        <p class="no-results-tip">请尝试其他搜索条件</p>
      </div>
    </div>
    
    <!-- 用户详情展示 -->
    <div class="user-detail-section" v-if="selectedUser">
      <personal-detail 
        :user-data="selectedUser"
        @close="handleCloseDetail"
      />
    </div>
    
    <!-- 空状态提示 -->
    <div class="empty-state" v-if="!showResults && !selectedUser">
      <div class="empty-content">
        <i class="el-icon-user"></i>
        <h3>个人监控</h3>
        <p>在上方搜索框中输入用户ID或用户名，查看特定用户的详细投注信息</p>
        <div class="empty-features">
          <div class="feature-item">
            <i class="el-icon-view"></i>
            <span>实时投注数据</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-pie-chart"></i>
            <span>投注分布分析</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-warning"></i>
            <span>异常行为监控</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import PersonalDetail from './PersonalDetail.vue'
import { useSicboData } from '../../composables/useSicboData'

export default {
  name: 'PersonalSearch',
  components: {
    PersonalDetail
  },
  setup() {
    // 响应式数据
    const searchInput = ref('')
    const searchType = ref('user_id')
    const searching = ref(false)
    const includeHistory = ref(false)
    const onlyActiveUsers = ref(true)
    const searchResults = ref([])
    const selectedUserId = ref(null)
    const selectedUser = ref(null)
    const recentUsers = ref([
      // 模拟最近搜索的用户
      { id: 'user_12345', name: '用户A' },
      { id: 'user_67890', name: '用户B' }
    ])
    
    // 使用数据管理
    const { tableData } = useSicboData()
    
    // 计算属性
    const showResults = computed(() => searchResults.value.length > 0 || searching.value)
    
    // 处理搜索输入
    const handleSearchInput = (value) => {
      // 可以在这里添加实时搜索逻辑
      if (!value.trim()) {
        searchResults.value = []
      }
    }
    
    // 执行搜索
    const handleSearch = async () => {
      if (!searchInput.value.trim()) {
        return
      }
      
      searching.value = true
      
      try {
        // 模拟搜索延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 在实际数据中搜索
        const results = tableData.value.filter(item => {
          const searchValue = searchInput.value.toLowerCase()
          
          if (searchType.value === 'user_id') {
            return item.user_id && item.user_id.toString().includes(searchValue)
          } else {
            return item.user_name && item.user_name.toLowerCase().includes(searchValue)
          }
        })
        
        // 处理搜索结果，聚合用户数据
        const userMap = new Map()
        results.forEach(item => {
          const userId = item.user_id
          if (userMap.has(userId)) {
            const existing = userMap.get(userId)
            existing.totalBet += (item.count || 0)
            existing.betCount += 1
            existing.lastActivity = Math.max(existing.lastActivity, new Date(item.created_at || Date.now()).getTime())
          } else {
            userMap.set(userId, {
              user_id: userId,
              user_name: item.user_name,
              totalBet: item.count || 0,
              betCount: 1,
              lastActivity: new Date(item.created_at || Date.now()).getTime(),
              tableData: [item]
            })
          }
        })
        
        searchResults.value = Array.from(userMap.values())
          .sort((a, b) => b.totalBet - a.totalBet) // 按投注额排序
        
        console.log('搜索完成，找到用户:', searchResults.value.length)
        
      } catch (error) {
        console.error('搜索失败:', error)
      } finally {
        searching.value = false
      }
    }
    
    // 选择用户
    const selectUser = (user) => {
      selectedUserId.value = user.user_id
      // 不直接设置selectedUser，等待点击查看详情
    }
    
    // 查看用户详情
    const viewUserDetail = (user) => {
      selectedUser.value = user
      
      // 添加到最近搜索
      addToRecentUsers(user)
    }
    
    // 关闭详情
    const handleCloseDetail = () => {
      selectedUser.value = null
      selectedUserId.value = null
    }
    
    // 添加到监控列表
    const addToWatch = (user) => {
      console.log('添加到监控:', user.user_id)
      // 这里可以添加到监控列表的逻辑
    }
    
    // 选择最近搜索的用户
    const selectRecentUser = (user) => {
      searchInput.value = user.id
      searchType.value = 'user_id'
      handleSearch()
    }
    
    // 移除最近搜索用户
    const removeRecentUser = (userId) => {
      recentUsers.value = recentUsers.value.filter(user => user.id !== userId)
    }
    
    // 添加到最近搜索
    const addToRecentUsers = (user) => {
      const existing = recentUsers.value.find(item => item.id === user.user_id)
      if (!existing) {
        recentUsers.value.unshift({
          id: user.user_id,
          name: user.user_name || `用户${user.user_id}`
        })
        // 限制最近搜索数量
        if (recentUsers.value.length > 5) {
          recentUsers.value = recentUsers.value.slice(0, 5)
        }
      }
    }
    
    // 清空搜索结果
    const clearResults = () => {
      searchResults.value = []
      selectedUserId.value = null
    }
    
    // 格式化金额
    const formatAmount = (amount) => {
      if (!amount) return '0'
      return amount.toLocaleString()
    }
    
    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return '未知'
      return new Date(timestamp).toLocaleString()
    }
    
    return {
      // 响应式数据
      searchInput,
      searchType,
      searching,
      includeHistory,
      onlyActiveUsers,
      searchResults,
      selectedUserId,
      selectedUser,
      recentUsers,
      
      // 计算属性
      showResults,
      
      // 方法
      handleSearchInput,
      handleSearch,
      selectUser,
      viewUserDetail,
      handleCloseDetail,
      addToWatch,
      selectRecentUser,
      removeRecentUser,
      clearResults,
      formatAmount,
      formatTime
    }
  }
}
</script>

<style scoped>
.personal-search {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 搜索区域 */
.search-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 16px;
}

.search-input-group {
  margin-bottom: 12px;
}

.search-options {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

/* 快速搜索 */
.quick-search {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.quick-search-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.quick-search-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.recent-user-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.recent-user-tag:hover {
  background-color: #409eff;
  color: white;
}

/* 搜索结果 */
.search-results {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  margin-bottom: 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.results-header h3 {
  margin: 0;
  color: #303133;
}

.results-list {
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f8f9fa;
  cursor: pointer;
  transition: all 0.3s;
}

.result-item:hover {
  background-color: #f8f9fa;
}

.result-item.active {
  background-color: #e6f3ff;
  border-left: 4px solid #409eff;
}

.user-basic-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.user-avatar i {
  font-size: 20px;
  color: #909399;
}

.user-details {
  min-width: 0;
}

.user-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.user-id {
  font-size: 12px;
  color: #909399;
}

.user-stats {
  display: flex;
  gap: 20px;
  margin: 0 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.user-actions {
  display: flex;
  gap: 8px;
}

/* 无结果状态 */
.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.no-results i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.no-results-tip {
  font-size: 12px;
  margin-top: 8px;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.empty-content {
  text-align: center;
  padding: 40px;
  max-width: 400px;
}

.empty-content i {
  font-size: 64px;
  color: #c0c4cc;
  margin-bottom: 20px;
  display: block;
}

.empty-content h3 {
  color: #303133;
  margin-bottom: 12px;
}

.empty-content p {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 24px;
}

.empty-features {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 12px;
}

.feature-item i {
  font-size: 24px;
  color: #c0c4cc;
}

/* 用户详情区域 */
.user-detail-section {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .user-stats {
    flex-direction: column;
    gap: 8px;
    margin: 0 12px;
  }
  
  .user-actions {
    flex-direction: column;
  }
  
  .empty-features {
    flex-direction: column;
    gap: 12px;
  }
}
</style>