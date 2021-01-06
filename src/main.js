import '@/utils/antdesign'
import {message} from 'ant-design-vue'
import less from 'less'
import Vue from 'vue'
import VueWechatTitle from 'vue-wechat-title'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$message = message
message.config({
  duration: 2,// 持续时间
  top: `100px`, // 到页面顶部距离
  maxCount: 3 // 最大显示数, 超过限制时，最早的消息会被自动关闭
})
Vue.use(less)
Vue.use(VueWechatTitle)
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
