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
  }, {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test'),
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
      component: () => import('@/views/admin/resources/component/AddResource')
    }, {
      path: '/resource',
      name: 'resource',
      component: () => import('@/views/admin/resources/Resource')
    },{
      path: '/upload',
      name: 'upload',
      component: () => import('@/views/admin/upload/Upload')
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
