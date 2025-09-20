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
      path: '/about/oursong',
      name: 'about-oursong',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/about/tianci',
      name: 'about-tianci',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/about/qiche',
      name: 'about-qiche',
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
      path: '/concert/universe/:city',
      name: 'concert',
      component: () => import('../views/ConcertView.vue'),
    },
    {
      path: '/concert/open/:city',
      name: 'concert-open',
      component: () => import('../views/ConcertView.vue'),
    },
    {
      path: '/related',
      name: 'related',
      component: () => import('../views/RelatedView.vue'),
    },
    {
      path: '/collection/haoshengyin',
      name: 'collection-haoshengyin',
      component: () => import('../views/CollectionView.vue'),
    },
    {
      path: '/collection/tianci',
      name: 'collection-tianci',
      component: () => import('../views/CollectionView.vue'),
    },
    {
      path: '/collection/liutang',
      name: 'collection-liutang',
      component: () => import('../views/CollectionView.vue'),
    },
    {
      path: '/collection/oursong',
      name: 'collection-oursong',
      component: () => import('../views/CollectionView.vue'),
    },
    {
      path: '/collection/singer',
      name: 'collection-singer',
      component: () => import('../views/CollectionView.vue'),
    },
    {
      path: '/collection/hit',
      name: 'collection-hit',
      component: () => import('../views/CollectionView.vue'),
    },
    {
      path: '/collection/fresh',
      name: 'collection-fresh',
      component: () => import('../views/CollectionView.vue'),
    },
    {
      path: '/collection/mask',
      name: 'collection-mask',
      component: () => import('../views/CollectionView.vue'),
    },
  ],
})

export default router
