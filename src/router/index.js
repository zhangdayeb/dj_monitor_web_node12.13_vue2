import { createRouter, createWebHistory } from 'vue-router'
import Baccarat from '@/views/baccarat/Baccarat.vue'
import Bull from '@/views/bull/Bull.vue'
import Dragon from '@/views/dragon/Dragon.vue'
import Three from '@/views/three/Three.vue'
import Sicbo from '@/views/sicbo/Sicbo.vue'
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
    name: 'Sicbo',
    component: Sicbo
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
