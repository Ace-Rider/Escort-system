<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const userInfo = computed(() => {
  return JSON.parse(localStorage.getItem('h5_userInfo')) || {}
})
const router = useRouter()
const goOrder = (value) => {
  router.push(`/order?active=${value}`)
}
const show = ref(false)
const loginOut =  () => {
  localStorage.removeItem('h5_userInfo')
  localStorage.removeItem('h5_token')
  router.push('/login')
}
</script>

<template>
  <div class="container">
    <div class="user">
      <van-image class="img" :src="userInfo.avatar" width="100" height="100"></van-image>
      <div class="text">{{ userInfo.name }}</div>
    </div>
    <div class="order">
      <div class="top">
        <div class="text1"></div>
        <div class="text2"></div>
      </div>
      <div class="bottom">
        <div class="item">
          <van-image
            @click="goOrder(2)"
            width="40"
            height="40"
            src="../../../public/images/od_10.png"
          ></van-image>
          <div>待支付</div>
        </div>
        <div class="item">
          <van-image
            @click="goOrder(3)"
            width="40"
            height="40"
            src="../../../public/images/od_20.png"
          ></van-image>
          <div>待服务</div>
        </div>
        <div class="item">
          <van-image
            @click="goOrder(4)"
            width="40"
            height="40"
            src="../../../public/images/od_30.png"
          ></van-image>
          <div>已完成</div>
        </div>
        <div class="item">
          <van-image
            @click="goOrder(1)"
            width="40"
            height="40"
            src="../../../public/images/od_40.png"
          ></van-image>
          <div>已取消</div>
        </div>
      </div>
    </div>
    <div class="foot">
      <div class="foot1">
        <div class="text1">
          <van-image width="20" height="20" src="../../../public/images/ic_clients.png"></van-image>
          服务对象管理
        </div>
        <div class="text2">
          <van-icon name="arrow"></van-icon>
        </div>
      </div>
      <div class="foot2">
        <div class="text1">
          <van-image width="20" height="20" src="../../../public/images/ic_share.png"></van-image>
          分享转发
        </div>
        <div class="text2">
          <van-icon name="arrow"></van-icon>
        </div>
      </div>
    </div>
    <van-button class="quit" type="danger" size="large" @click="show = true">退出登录</van-button>
    <van-dialog v-model:show="show" @cnacel="show = false" @confirm="loginOut" title="提示" show-cancel-button>
      <div class="quit_text">是否确认退出登录</div>
    </van-dialog>
  </div>
</template>

<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
  overflow: hidden;
  .user {
    width: 95%;
    height: 200px;
    background-color: #fff;
    text-align: center;
    border-radius: 10px;
    margin: 10px;
    .img {
      margin-top: 30px;
    }
    .text {
      line-height: 30px;
      font-weight: bold;
    }
  }
  .order {
    width: 90%;
    margin: 10px;
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;
    .top {
      margin: 10px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      .text1 {
        color: #333;
      }
      .text2 {
        color: #999;
      }
      border-bottom: 0.5px solid #f5f5f5;
    }
    .bottom {
      padding: 10px;
      display: flex;
      justify-content: space-around;
      .item {
        font-size: 14px;
        color: #999;
      }
    }
  }
  .foot {
    margin: 0 10px;
    padding: 10px;
    line-height: 50px;
    background-color: #fff;
    .foot1,
    .foot2 {
      display: flex;
      justify-content: space-between;
      color: #555;
    }
    .foot1 {
      border-bottom: 0.5px solid #f5f5f5;
    }
  }
  .quit {
    width: 90%;
    margin: 20px;
  }
  .quit_text {
    margin: 20px 0;
    text-align: center;
  }
}
</style>
