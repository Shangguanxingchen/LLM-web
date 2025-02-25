import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const enable = true
// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "/" : "" ,
  timeout: 120 * 1000, // 请求超时时间
})

service.interceptors.request.use(
  (config) => {
    // if (/^(post)|(put)|(delete)$/i.test(config.method)) {
    //   if (config.data && config.data.upload) {
    //     config.headers[`Content-Type`] = `multipart/form-data`
    //   }
    // }
    if (config.url !== `user_sign`) {
      config.headers[`ck`] = localStorage.getItem(`token`)
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res) => {
    if (res.data.code === 201 && enable) {
      Message.error(`登录态失效，请重新登录！`)
      localStorage.removeItem(`token`)
      // enable = false
      setTimeout(() => {
        router.replace(`/login`)
      }, 1000)
      // setTimeout(() => {
      //   enable = true
      // }, 6000)
    }
    return res.data ? res.data : Promise.reject(res)
  },
  (error) => Promise.reject(error)
)

export default service