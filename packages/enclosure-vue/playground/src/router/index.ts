import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BridgeView from '../views/BridgeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: '/bridge/:pathMatch(.*)*',
      name: 'bridge',
      component: BridgeView,
    }
  ]
})

export default router
