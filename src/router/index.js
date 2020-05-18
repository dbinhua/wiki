import Vue from 'vue'
import Router from 'vue-router'
import Wiki from '@/components/wiki'
import search from '@/components/search'
// import devlog from '@/components/devlog'
import page404 from '@/components/404'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'search',
      component: search,
      meta: {
        title: 'Api Wiki'
      }
    },
    {
      path: '/wiki',
      name: 'Wiki',
      component: Wiki,
      meta: {
        title: 'Api Wiki'
      }
    },
    // {
    //   path: '/devlog',
    //   name: 'devlog',
    //   component: devlog
    // },
    {
      path: '/404',
      name: 'page404',
      compoment: page404
    }
  ]
})
