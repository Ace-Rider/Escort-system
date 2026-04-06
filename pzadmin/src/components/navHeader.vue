<script setup>
import { Fold } from '@element-plus/icons-vue'
import { useDataStore } from '@/stores/index.js'
import { computed } from 'vue'
import router from '@/router/index.js'
import { useRoute } from 'vue-router'
const store = useDataStore()
const handleCollapse = () => {
  store.isCollapse = !store.isCollapse
}
const MenuList = computed(() => store.selectMenu)
console.log('MenuList.value', MenuList.value)
const handleClick = (path) => {
  router.push(path)
}
const route = useRoute()

const handleClose = (data) => {
  if (data.path === route.path) {
    const index = store.selectMenu.findIndex((item) => item.path === data.path)
    store.updateMenu(data)
    if (store.selectMenu.length === 0) {
      router.push('/')
    } else {
      if (index === store.selectMenu.length) {
        router.push(store.selectMenu[index - 1].path)
      } else {
        router.push(store.selectMenu[index].path)
      }
    }
  } else {
    store.updateMenu(data)
  }
}

const handleLoginOut = (command) => {
  if (command === 'cancel') {
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    localStorage.removeItem('dataStore')
    // window.location.href = window.location.origin
    router.push('/login')
  }
}

const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))
</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <el-icon class="icon" size="20" @click="handleCollapse"><Fold /></el-icon>
      <ul>
        <li
          v-for="(item, index) in MenuList"
          :key="index"
          @click="handleClick(item.path)"
          :class="{ active: route.path === item.path }"
        >
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.name }}</span>
          <el-icon @click.stop="handleClose(item)"><Close /></el-icon>
          <span></span>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleLoginOut">
        <div class="el-dropdown-link">
          <el-avatar :src="userInfo.avatar" />
          <p class="user-name">{{ userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: white;
  padding-right: 25px;
  .header-left {
    display: flex;
    align-items: center;
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
    ul {
      display: flex;
      height: 100%;
      line-height: 50px;
      li {
        width: 120px;
        height: 100%;
        text-align: center;
        padding-left: 5px;
        padding-right: 5px;
        display: flex;
        justify-content: center;
        align-items: center;

        .icons {
          width: 20px;
          height: 20px;
          margin-right: 7px;
        }
        span {
          margin-right: 5px;
        }
        .el-icon {
          visibility: hidden;
        }
      }
      li:hover {
        cursor: pointer;
        background-color: #f5f5f5;
        border-bottom: 1px solid rgb(230, 233, 235);
        .el-icon {
          visibility: visible;
        }
      }
      .active {
        background-color: #f5f5f5;
        color: dodgerblue;
      }
    }
  }
  .el-dropdown-link {
    display: flex;
    justify-content: center;
    align-items: center;
    .user-name {
      margin-left: 10px;
    }
  }
}
</style>
