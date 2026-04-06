import axios from 'axios';
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: 'https://v3pz.itndedu.com/v3pz',
  timeout: 10000,
})


http.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('pz_token');
    const whiteURL = ['/get/code', '/user/authentication', '/login']
    if (token && !whiteURL.includes(config.url)) {
      config.headers['x-token'] = token
    }
    return config;
  },
  function (error) {

    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  function (response) {
    if (response.data.code === -1) {
      ElMessage.warning(response.data.message)
    }
    if (response.data.code === -2) {
      localStorage.removeItem('pz_token');
      localStorage.removeItem('pz_userInfo')
      localStorage.removeItem('dataStore')
      window.location.href = window.location.origin
    }
    return response
  },
  function (error) {

    return Promise.reject(error)
  },
)


export default http
