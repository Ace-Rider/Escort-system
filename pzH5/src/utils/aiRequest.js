import axios from 'axios'

const aiRequest = axios.create({
  baseURL: import.meta.env.VITE_AI_BASE_URL || 'http://127.0.0.1:3001',
  timeout: 20000,
})

export default aiRequest
