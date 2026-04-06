import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../pages/Main.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        meta: {
          icon: 'home-o',
          name: '首页',
        },
        component: () => import('../pages/home/index.vue'),
      },
      {
        path: 'order',
        meta: {
          icon: 'orders-o',
          name: '订单',
        },
        component: () => import('../pages/order/index.vue'),
      },
      {
        path: 'user',
        meta: {
          icon: 'user-circle-o',
          name: '我的',
        },
        component: () => import('../pages/user/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/index.vue'),
  },
  {
    path: '/createOrder',
    name: 'createOrder',
    component: () => import('../pages/createOrder/index.vue'),
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('../pages/detail/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

router.beforeEach((to, from) => {
  if (to.path !== '/login') {
    if (!localStorage.getItem('h5_token')) {
      return '/login'
    }
  }
})

export default router
