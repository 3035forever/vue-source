// 入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import echarts from 'echarts'

// 导入全局样式表
import './assets/css/global.css'
import VueCookies from 'vue-cookies'
// 导入包
import axios from 'axios'
import defines from './config'
Vue.use(VueCookies)

// 配置请求的根路径
axios.defaults.baseURL = 'http://106.75.154.40:9012/traceability'
// 把包挂载到原型对象上：
Vue.prototype.$http = axios
// 从路径获取当前基地id
Vue.prototype.defines = defines
Vue.prototype.$echarts = echarts
// console.log(this.$baseId)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
