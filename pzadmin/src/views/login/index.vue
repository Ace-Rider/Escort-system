<script setup>
import { computed, ref, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
import { getCode, userAuthentication, login, menuPermissions } from '@/api/index.js'
import router from '@/router/index.js'
import { useDataStore } from '@/stores/index.js'

const imgURL = new URL('../../../public/images/login-head.png', import.meta.url).href
const formType = ref(0)
const handleChange = () => {
  formType.value = formType.value ? 0 : 1
}
const validateUser = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入账号'))
  } else {
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    phoneReg.test(value) ? callback() : callback(new Error('手机号格式不对，请输入正确的手机号'))
  }
}
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    const pwdReg = /^[a-zA-Z0-9_-]{4,16}$/
    pwdReg.test(value) ? callback() : callback(new Error('密码格式不对'))
  }
}

const rules = ref({
  userName: [{ validator: validateUser, trigger: 'blur' }],
  passWord: [{ validator: validatePass, trigger: 'blur' }],
})

const loginForm = ref({
  userName: '',
  passWord: '',
  validCode: '',
})
const countDown = ref({
  validText: '获取验证码',
  time: 60,
})
let flag = false
const countDownChange = () => {
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if (!loginForm.value.userName || !phoneReg.test(loginForm.value.userName)) {
    return ElMessage({
      message: '手机号格式错误',
      type: 'error',
    })
  }
  if (flag === true) {
    return
  }
  const timeout = setInterval(() => {
    if (countDown.value.time === 1) {
      countDown.value.time = 60
      countDown.value.validText = '获取验证码'
      clearInterval(timeout)
    } else {
      countDown.value.time -= 1
      countDown.value.validText = `剩余${countDown.value.time}s`
    }
  }, 1000)
  flag = true
  getCode({ tel: loginForm.value.userName }).then((data) => {
    console.log('data', data)
    if (data.code === 10000) {
      ElMessage.success('发送成功')
    }
  })
}

const loginFormRef = ref()

const store = useDataStore()

const routerList = computed(() => store.routerList)
const submitForm = async (form) => {
  if (!form) {
    return
  }
  await form.validate((valid, fields) => {
    if (valid) {
      console.log('提交成功', loginForm)
      if (formType.value) {
        userAuthentication(loginForm.value).then((result) => {
          console.log('返回', result)
          if (result.data.code === 10000) {
            ElMessage.success('注册成功，请登录')
            formType.value = 0
          }
        })
      } else {
        login(loginForm.value).then((result) => {
          console.log('login', result.data)
          if (result.data.code === 10000) {
            ElMessage.success('登录成功')
            localStorage.setItem('pz_token', result.data.data.token)
            localStorage.setItem('pz_userInfo', JSON.stringify(result.data.data.userInfo))
            menuPermissions().then((result) => {
              console.log('result.data.data', result.data.data)
              store.dynamicMenu(result.data.data)
              console.log('routerList', routerList.value)
              toRaw(routerList.value).forEach((item) => {
                router.addRoute('main', item)
              })
              const firstMenu = store.routerList[0]
              const firstPath = firstMenu.children ? firstMenu.children[0].meta.path : firstMenu.path
              router.push(firstPath) // 直接跳转到具体页面
            })
          }
        })
      }
    } else {
      console.log('提交失败', fields)
    }
  })
}
</script>

<template>
  <el-row class="login-container" justify="center" align="middle">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgURL" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{
          formType ? '返回登录' : '注册账号'
        }}</el-link>
      </div>
      <el-form :model="loginForm" lacbe-width="120px" :rules="rules" ref="loginFormRef">
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="手机号"
            prefix-icon="UserFilled"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock">
            <template #append>
              <span class="validCode" @click="countDownChange">{{ countDown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm(loginFormRef)" type="primary" style="width: 100%">{{
            formType ? '注册账号' : '登录'
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<style scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100vh;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
  .validCode {
    cursor: pointer;
  }
}
</style>
