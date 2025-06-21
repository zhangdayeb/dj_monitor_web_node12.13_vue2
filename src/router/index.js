import { createRouter, createWebHistory } from 'vue-router'
import NavigationIndex from '@/views/index.vue'  // 导航首页
import BaccaratMonitor from '@/views/baccarat/BaccaratMonitor.vue'
import BullMonitor from '@/views/bull/BullMonitor.vue'
import DragonMonitor from '@/views/dragon/DragonMonitor.vue'
import ThreeMonitor from '@/views/three/ThreeMonitor.vue'
import SicboMonitor from '@/views/sicbo/SicboMonitor.vue'
import QznnMonitor from '@/views/qznn/QznnMonitor.vue'

const routes = [
  // 导航首页
  {
    path: '/',
    name: 'NavigationIndex',
    component: NavigationIndex,
    meta: {
      title: '游戏监控系统'
    }
  },
  // 百家乐监控
  {
    path: '/bjl',
    name: 'BaccaratMonitor',
    component: BaccaratMonitor,
    meta: {
      title: '百家乐监控'
    }
  },
  // 牛牛监控
  {
    path: '/nn',
    name: 'BullMonitor',
    component: BullMonitor,
    meta: {
      title: '牛牛监控'
    }
  },
  // 抢庄牛牛监控
  {
    path: '/qznn',
    name: 'QznnMonitor',
    component: QznnMonitor,
    meta: {
      title: '抢庄牛牛监控'
    }
  },
  // 龙虎监控
  {
    path: '/lh',
    name: 'DragonMonitor',
    component: DragonMonitor,
    meta: {
      title: '龙虎监控'
    }
  },
  // 三公监控
  {
    path: '/sg',
    name: 'ThreeMonitor',
    component: ThreeMonitor,
    meta: {
      title: '三公监控'
    }
  },
  // 骰宝监控
  {
    path: '/sicbo',
    name: 'SicboMonitor',
    component: SicboMonitor,
    meta: {
      title: '骰宝监控'
    }
  },
  // 404页面重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 投注监控系统`
  }
  next()
})

export default router