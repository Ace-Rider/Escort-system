<script setup>
import Aside from '@/components/aside.vue'
import NavHeader from '@/components/navHeader.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <Aside></Aside>
      <el-container>
        <el-header>
          <nav-header></nav-header>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>

</style>
