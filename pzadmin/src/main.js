import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@/style.css'
import ElementPlus, { localeContextKey } from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import panelHead from './components/panelHead.vue'
import { useDataStore } from '@/stores/index.js'





const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)


// pinia-plugin-persistedstate 持久化时会将状态序列化为 JSON，函数（如 component）会被丢弃
// 导致 store.routerList 中的 component 变为 undefined。
// 因此，路由无法找到对应的组件，页面显示空白。
// 以下是错误示例
// const store = useDataStore()
// store.routerList.forEach((item) => {
//     router.addRoute('main', item)
//   })

// 刷新后需要重新构建带函数的路由数据，而不是直接使用持久化存储的残缺数据

// 刷新后的路由动态添加的问题，不然刷新后没有路由数据
const localData = JSON.parse(localStorage.getItem('dataStore'))
const store = useDataStore()
if (localData) {
  store.dynamicMenu(localData.routerList)
  store.routerList.forEach((item) => {
    router.addRoute('main', item)
  })
}


app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('panelHead', panelHead)
app.mount('#app')
