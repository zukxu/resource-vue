import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8099',
  timeout: 6000
})
axios.interceptors.request.use(config => {
  //在发送请求之前做些什么
  return config
}, err => {
//  请求错误时处理,没有到达后端
  return Promise.reject(err)
})
axios.interceptors.response.use(res => {
//请求成功，对响应数据进行处理
  return res
}, err => {
//响应错误，后端返回错误
  return Promise.reject(err)
})

export default instance
