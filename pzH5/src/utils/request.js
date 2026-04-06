import axios from 'axios'

const http = axios.create({
  baseURL: 'https://v3pz.itndedu.com/v3pz',
  timeout: 10000,
  headers: {"terminal": "h5"},
})

http.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('h5_token')
    const whiteURL = [ '/login']
    if (token && !whiteURL.includes(config.url)) {
      config.headers['h-token'] = token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  function (response) {
    if (response.data.code === -1) {
    }
    if (response.data.code === -2) {
      localStorage.removeItem('h5_token')
      localStorage.removeItem('h5_userInfo')
      window.location.href = window.location.origin
    }
    return response
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default http
