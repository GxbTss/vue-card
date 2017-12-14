import axios from 'axios'
import qs from 'qs'

const Axios = axios.create({
  baseURL: 'http://api.com',
  responseType: 'json'
})

// 请求拦截器
Axios.interceptors.request.use(
  config => {
    if (config.type === 'post') {
      // 参数序列化
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
Axios.interceptors.response.use(
  response => {
    // 对响应数据做处理
    // const res = response.data
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default Axios
