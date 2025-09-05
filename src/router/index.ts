import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
    },
    {
      path: '/history/:year',
      name: 'history-year',
      component: () => import('../views/HistoryYearView.vue'),
    },
    // {
    //   path: '/chengdu',
    //   name: 'chengdu',
    //   component: () => import('../views/ChengduView.vue'),
    // },
    {
      path: '/concert/:city',
      name: 'concert',
      component: () => import('../views/ConcertView.vue'),
    },
  ],
})

export default router
