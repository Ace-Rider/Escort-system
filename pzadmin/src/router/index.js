import { createRouter, createWebHashHistory } from 'vue-router'
import { useDataStore } from '@/stores/index.js'
import { getActivePinia } from 'pinia'

const localData = JSON.parse(localStorage.getItem('dataStore'))

const routes = [
  {
    path: '/',
    component: () => import('@/views/Main.vue'),
    name: 'main',
    children: [],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  if (!token && to.path !== '/login') {
    return '/login'
  }
  else if (token && to.path === '/login') {
    return '/'
  }
  else if (token && to.path === '/') {
    const route = localData.routerList[0].children ? localData.routerList[0].children[0] : localData.routerList[0]
    const path = route.meta.path
    return path
  }
    else {
    return true
  }
})

router.afterEach((to, from) => {
  if (to.meta && to.meta.name) {
    const pinia = getActivePinia()
    if (pinia) {
      const store = useDataStore(pinia)
      // 避免重复添加
      if (!store.selectMenu.some((item) => item.path === to.path)) {
        store.addMenu(to.meta)
      }
    }
  }
})


export default router
