<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const active = ref(0)
const router = useRouter()
const route = useRoute()
onMounted(() => {
  const data = router.options.routes[0]
  active.value = data.children.findIndex((item) => '/' + item.path === route.path)
})
</script>

<template>
  <van-tabbar v-model="active">
    <van-tabbar-item
      v-for="item in router.options.routes[0].children"
      :key="item.path"
      :icon="item.meta.icon"
      :url="`#/${item.path}`"
    >
      {{ item.meta.name }}
    </van-tabbar-item>
  </van-tabbar>
  <div class="router-view-wrapper">
    <router-view></router-view>
  </div>
</template>

<style lang="less" scoped>
.router-view-wrapper {
  padding-bottom: 40px;
}
</style>
