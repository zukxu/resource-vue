import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home'),
    meta: {
      title: ' 资源管理系统'   // 标题设置
    },
    children: []
  },
  {
    path: '/admin',
    name: 'layout',
    component: () => import('@/layouts/BaseLayout'),
    meta: {
      title: ' 资源管理系统'   // 标题设置
    },
    children: [{
      path: '/addResource',
      name: 'addResource',
      component: () => import('@/views/admin/AddResource')
    }, {
      path: '/resource',
      name: 'resource',
      component: () => import('@/views/admin/Resource')
    },{
      path: '/upload',
      name: 'upload',
      component: () => import('@/views/admin/Upload')
    },
    ]
  }, {
    path: '*',
    name: '/404',
    component: () => import('@/views/404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

/*router.beforeEach((to,from,next)=>{
  if (store.state.userInfo || to.path === '/login') {
    next()
  }else{
    next({
      path:'/login'
    })
  }
})*/
export default router
