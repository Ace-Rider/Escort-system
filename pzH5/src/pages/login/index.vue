<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/index.js'

defineOptions({
  name: 'LoginPage',
})

const form = ref({
  userName: '',
  passWord: '',
})

const router = useRouter()

const onSubmit = async () => {
  const result = await api.login(form.value)

  if (result.data.code === 10000) {
    localStorage.setItem('h5_token', result.data.data.token)
    localStorage.setItem('h5_userInfo', JSON.stringify(result.data.data.userInfo))
    router.push('/home')
  }
}
</script>

<template>
  <h1>用户登录</h1>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="form.userName"
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="form.passWord"
        type="password"
        name="password"
        label="密码"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div class="submit-wrap">
      <van-button round block type="primary" native-type="submit">提交</van-button>
    </div>
  </van-form>
</template>

<style scoped>
h1 {
  text-align: center;
}

.submit-wrap {
  margin: 16px;
}
</style>
