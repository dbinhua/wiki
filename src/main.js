import Vue from 'vue'
import App from './App'
import search from './components/search'
import wiki from './components/wiki'
import page404 from './components/404'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'
import router from './router'

Vue.config.productionTip = false
Vue.use(iView)

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App, search, wiki, page404 },
  template: '<App/>'
})
