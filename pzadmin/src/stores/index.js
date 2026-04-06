import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataStore = defineStore(
  'dataStore',
  () => {
    const isCollapse = ref(false)
    const selectMenu = ref([])
    const routerList = ref([])
    function addMenu(data) {
      const index = selectMenu.value.findIndex((item) => item.path === data.path)
      index === -1 ? selectMenu.value.push(data) : ''
    }
    function updateMenu(data) {
      const index = selectMenu.value.findIndex((item) => item.path === data.path)
      selectMenu.value.splice(index, 1)
    }
    function dynamicMenu(payload) {
      const modules = import.meta.glob('../views/**/**/*.vue')
      function routerSet(data) {
        data.forEach((item) => {
          if (!item.children) {
            const url = `../views${item.meta.path}/index.vue`
            item.component = modules[url]
          } else {
            routerSet(item.children)
          }
        })
      }
      routerSet(payload)
      routerList.value = payload
    }
    return { isCollapse, selectMenu, routerList, addMenu, updateMenu, dynamicMenu }
  },
  {
    // 开启持久化
    persist: true,
  },
)
