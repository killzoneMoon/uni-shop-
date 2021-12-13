import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import store from './store/index.js'
Vue.use(uView)
Vue.config.productionTip = false

App.mpType = 'app'

Vue.config.productionTip = false
const app = new Vue({
    ...App,
	store,
	beforeMount(){
		Vue.prototype.$bus = this
	},
})

import httpInterceptor from '@/common/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)

import utils from '@/common/utils.js'
Vue.use(utils,app)

app.$mount()