<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed} from 'vue'
import { useDataStore } from '@/stores/index.js'

const router = useRouter()
const store = useDataStore()

const menuData = computed(() => store.routerList)
console.log(menuData.value)
const width = computed(() => (store.isCollapse ? '64px' : '230px'))

const noChildren = menuData.value.filter((item) => !item.children)
const hasChildren = menuData.value.filter((item) => item.children)

const handleClick = (item) => {
  store.addMenu(item.meta)
  router.push(item.meta.path)
}
const route = useRoute()
</script>

<template>
  <el-menu
    :style="{ width: width }"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    :default-active="route.path"
    text-color="#fff"
    :collapse="store.isCollapse"
    :popper-offset="4"
  >
    <h2 v-if="!store.isCollapse">DIDI陪诊</h2>
    <h2 v-else>DIDI</h2>
    <el-menu-item
      v-for="(item, index) in noChildren"
      :index="item.meta.path"
      :key="index"
      @click="handleClick(item)"
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span v-show="!store.isCollapse">{{ item.meta.name }}</span>
    </el-menu-item>
    <el-sub-menu v-for="(item, index) in hasChildren" :index="item.meta.id" :key="index">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span v-show="!store.isCollapse">{{ item.meta.name }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          v-for="(item, index) in item.children"
          :index="item.meta.path"
          :key="index"
          @click="handleClick(item)"
        >
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.name }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<style lang="less" scoped>
.aside-container {
  height: 100vh;
  transition: width 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
  h2 {
    color: white;
    text-align: center;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
  }
}
</style>
