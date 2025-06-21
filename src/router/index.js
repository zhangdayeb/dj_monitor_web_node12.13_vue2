import { createRouter, createWebHistory } from 'vue-router'
import Baccarat from '@/views/baccarat/Baccarat.vue'
import Bull from '@/views/bull/Bull.vue'
import Dragon from '@/views/dragon/Dragon.vue'
import Three from '@/views/three/Three.vue'
import SicboMonitor from '@/views/sicbo/SicboMonitor.vue'  // 更改为新的监控组件
import Qznn from '@/views/qznn/Qznn.vue'

const routes = [
  {
    path: '/bjl',
    name: 'Baccarat',
    component: Baccarat
  },
  {
    path: '/nn',
    name: 'Bull',
    component: Bull
  },
  {
    path: '/qznn',
    name: 'Qznn',
    component: Qznn
  },
  {
    path: '/lh',
    name: 'Dragon',
    component: Dragon
  },
  {
    path: '/sg',
    name: 'Three',
    component: Three
  },
  {
    path: '/sicbo',
    name: 'SicboMonitor',  // 更新组件名
    component: SicboMonitor  // 指向新的监控组件
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router