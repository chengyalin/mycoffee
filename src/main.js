// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import { WechatPlugin, AjaxPlugin } from 'vux'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
Vue.use(AjaxPlugin)
Vue.use(WechatPlugin)
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import App from './App'
import store from './store'
import Home from './components/PageHome'
import Library from './components/PageLibrary'
import Order from './components/PageOrder'
import AddOrder from './components/PageAddOrder'
import OrderComplete from './components/PageOrderComplete'
import AllBank from './components/PageAllBank'
import AllCoupon from './components/PageAllCoupon'
import GetCoupon from './components/PageGetCoupon'

Vue.http.defaults.withCredentials = true;
//isDev开发模式下为true, 要部署了就改为false
window.isDev = true
if (isDev) {
  Vue.http.defaults.baseURL = '/api'
}
//wxc59b077d6c26e6ff
// 'http://www.zhongkakeji.com'
Vue.http.get('/accounts/config/query/', {
  params: {
    url: encodeURIComponent(location.href.split('#')[0])
  }
}).then(({data}) => {
  if (data.ok) {
    data.data.debug = false
    data.data.jsApiList = [
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'chooseWXPay',
      'closeWindow',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'hideMenuItems'
    ]
    Vue.wechat.config(data.data)
  }
})

const routes = [{
  path: '/',
  component: Home
}, {
  path: '/lib',
  component: Library
}, {
  path: '/order',
  component: Order
}, {
  path: '/addorder',
  component: AddOrder
}, {
  path: '/ordercomplete',
  component: OrderComplete
}, {
  path: '/allbank',
  component: AllBank
}, {
  path: '/allcoupon',
  component: AllCoupon
}, {
  path: '/getcoupon',
  component: GetCoupon
}]

const router = new VueRouter({
  routes
})

if (!isDev) {
  router.beforeEach((to, from, next) => {
    // console.log('next to', next())
    const user_id = Vue.cookies.get('user_id')
    if (!store.getters.userInfo && !user_id) {
      Vue.http.get('/accounts/oauth/query/').then(({data}) => {
        if (data.ok) {
          window.location.href = data.data.oauth_link
        }
      })
    } else if (!store.getters.userInfo) {
      Vue.http.get('/accounts/userinfo/query/', {
        params: {
          user_id
        }
      }).then(({data}) => {
        if (data.ok) {
          store.commit('SET_USER_INFO', data.data)
          next()
        }
      })
    } else {
      next()
    }
  })
}

FastClick.attach(document.body)

Vue.config.productionTip = false

//微信开发者工具查看
/*Vue.wechat.ready(() => {
  console.log('okkk')
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app-box')
})
Vue.wechat.error((res) => {
  console.log(res)
})*/

//谷歌查看
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
