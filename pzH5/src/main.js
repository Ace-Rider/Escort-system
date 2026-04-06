import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import api from './api/index.js'
const app = createApp(App)
app.config.globalProperties.$api = api
app.use(createPinia())
app.use(router)

app.mount('#app')
