<template>
  <div class="navigation-container">
    <div class="header-section">
      <h1 class="main-title">🎮 游戏监控系统</h1>
      <p class="subtitle">实时监控各类游戏投注数据</p>
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-number">6</span>
          <span class="stat-label">游戏类型</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">24/7</span>
          <span class="stat-label">实时监控</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">∞</span>
          <span class="stat-label">数据记录</span>
        </div>
      </div>
    </div>

    <div class="games-grid">
      <div 
        v-for="game in games" 
        :key="game.path"
        class="game-card"
        :class="`game-card-${game.type}`"
        @click="navigateToGame(game.path)"
      >
        <div class="card-header">
          <div class="game-icon">{{ game.icon }}</div>
          <div class="game-info">
            <h3 class="game-title">{{ game.title }}</h3>
            <p class="game-description">{{ game.description }}</p>
          </div>
        </div>
        
        <div class="card-body">
          <div class="features">
            <div class="feature-item" v-for="feature in game.features" :key="feature">
              <span class="feature-icon">✓</span>
              <span class="feature-text">{{ feature }}</span>
            </div>
          </div>
          
          <div class="game-stats">
            <div class="stat">
              <span class="stat-value">{{ game.betTypes }}</span>
              <span class="stat-unit">投注项</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ game.categories }}</span>
              <span class="stat-unit">类别</span>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <el-button 
            type="primary" 
            size="large" 
            :color="game.color"
            class="enter-btn"
          >
            进入监控
            <span class="enter-arrow">→</span>
          </el-button>
        </div>
      </div>
    </div>

    <div class="footer-section">
      <div class="feature-highlights">
        <div class="highlight-item">
          <div class="highlight-icon">📊</div>
          <h4>实时统计</h4>
          <p>投注金额、用户数量、热门投注项实时统计分析</p>
        </div>
        <div class="highlight-item">
          <div class="highlight-icon">🔍</div>
          <h4>智能搜索</h4>
          <p>支持用户名、台桌ID、投注类型等多维度搜索</p>
        </div>
        <div class="highlight-item">
          <div class="highlight-icon">⚡</div>
          <h4>自动刷新</h4>
          <p>5秒自动刷新，确保数据实时性和准确性</p>
        </div>
        <div class="highlight-item">
          <div class="highlight-icon">📱</div>
          <h4>响应式</h4>
          <p>完美适配桌面端和移动端，随时随地监控</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'NavigationIndex',
  setup() {
    const router = useRouter()
    
    // 游戏配置数据
    const games = ref([
      {
        path: '/bjl',
        type: 'baccarat',
        icon: '🃏',
        title: '百家乐监控',
        description: '经典百家乐游戏投注监控',
        color: '#409eff',
        betTypes: '10',
        categories: '3',
        features: ['庄闲和投注', '对子投注', '特殊投注', '路珠分析']
      },
      {
        path: '/nn',
        type: 'bull',
        icon: '🐂',
        title: '牛牛监控',
        description: '传统牛牛游戏投注监控',
        color: '#f56c6c',
        betTypes: '15',
        categories: '2',
        features: ['庄闲投注', '牛牛投注', '对子投注', '倍数分析']
      },
      {
        path: '/qznn',
        type: 'qznn',
        icon: '🎯',
        title: '抢庄牛牛监控',
        description: '抢庄模式牛牛游戏监控',
        color: '#722ed1',
        betTypes: '24',
        categories: '3',
        features: ['抢庄投注', '基础投注', '特殊投注', '抢庄分析']
      },
      {
        path: '/lh',
        type: 'dragon',
        icon: '🐲',
        title: '龙虎监控',
        description: '简单刺激的龙虎游戏监控',
        color: '#67c23a',
        betTypes: '3',
        categories: '1',
        features: ['龙虎投注', '和局投注', '简单易懂', '快速开奖']
      },
      {
        path: '/sg',
        type: 'three',
        icon: '🀄',
        title: '三公监控',
        description: '三公游戏投注实时监控',
        color: '#e6a23c',
        betTypes: '9',
        categories: '3',
        features: ['翻倍投注', '平倍投注', '超级投注', '三公分析']
      },
      {
        path: '/sicbo',
        type: 'sicbo',
        icon: '🎲',
        title: '骰宝监控',
        description: '骰宝游戏投注数据监控',
        color: '#13c2c2',
        betTypes: '52',
        categories: '6',
        features: ['大小投注', '数字投注', '组合投注', '骰子分析']
      }
    ])
    
    // 导航到游戏页面
    const navigateToGame = (path) => {
      const game = games.value.find(g => g.path === path)
      ElMessage.success(`正在进入${game.title}...`)
      router.push(path)
    }
    
    return {
      games,
      navigateToGame
    }
  }
}
</script>

<style scoped>
.navigation-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

/* 头部区域 */
.header-section {
  text-align: center;
  margin-bottom: 60px;
  color: white;
}

.main-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.stats-overview {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

/* 游戏卡片网格 */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto 60px auto;
}

.game-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.game-card-baccarat::before {
  background: linear-gradient(90deg, #409eff 0%, #66b3ff 100%);
}

.game-card-bull::before {
  background: linear-gradient(90deg, #f56c6c 0%, #ff9999 100%);
}

.game-card-qznn::before {
  background: linear-gradient(90deg, #722ed1 0%, #9254de 100%);
}

.game-card-dragon::before {
  background: linear-gradient(90deg, #67c23a 0%, #95d475 100%);
}

.game-card-three::before {
  background: linear-gradient(90deg, #e6a23c 0%, #edb571 100%);
}

.game-card-sicbo::before {
  background: linear-gradient(90deg, #13c2c2 0%, #36cfc9 100%);
}

.game-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.game-icon {
  font-size: 3rem;
  margin-right: 20px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-info {
  flex: 1;
}

.game-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #303133;
}

.game-description {
  color: #606266;
  font-size: 1rem;
  margin: 0;
}

/* 卡片主体 */
.card-body {
  margin-bottom: 25px;
}

.features {
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.feature-icon {
  color: #67c23a;
  font-weight: bold;
  margin-right: 10px;
  font-size: 1.1rem;
}

.feature-text {
  color: #606266;
  font-size: 0.95rem;
}

.game-stats {
  display: flex;
  gap: 30px;
  padding: 15px 0;
  border-top: 1px solid #ebeef5;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-unit {
  font-size: 0.9rem;
  color: #909399;
}

/* 卡片底部 */
.card-footer {
  text-align: center;
}

.enter-btn {
  width: 100%;
  height: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.enter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.enter-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.enter-btn:hover .enter-arrow {
  transform: translateX(5px);
}

/* 底部功能亮点 */
.footer-section {
  max-width: 1200px;
  margin: 0 auto;
}

.feature-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.highlight-item {
  text-align: center;
  color: white;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.highlight-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.highlight-item h4 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  font-weight: bold;
}

.highlight-item p {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.6;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navigation-container {
    padding: 20px 15px;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .stats-overview {
    gap: 30px;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .game-card {
    padding: 20px;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
  }
  
  .game-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .game-stats {
    justify-content: center;
  }
  
  .feature-highlights {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }
  
  .stats-overview {
    flex-direction: column;
    gap: 20px;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
  }
  
  .game-card {
    margin: 0 10px;
  }
}
</style>