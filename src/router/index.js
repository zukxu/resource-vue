import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  //前端页面设置
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home'),
    meta: {
      title: ' 资源管理系统'   // 标题设置
    },
    children: []
  },
  //后端管理页面
  {
    path: '/admin',
    name: 'layout',
    component: () => import('@/layouts/BaseLayout'),
    //TODO 没有登录，直接重定向到资源页面
    redirect: '/resource',
    meta: {
      title: ' 资源管理系统'   // 标题设置
    },
    children: [
      {
        path: '/resource',
        name: 'resource',
        component: () => import('@/views/admin/resources/Resource'),
        meta: {
          title: '资源管理'
        }
      },{
        path: '/type',
        name: 'type',
        component: () => import('@/views/admin/resources/Type'),
        meta: {
          title: '分类管理'
        }
      }, {
        path: '/upload',
        name: 'upload',
        component: () => import('@/views/admin/upload/Upload'),
        meta: {
          title: '图片上传'
        }
      },
    ]
  }, {
    path: '*',
    name: '/404',
    component: () => import('@/views/404'),
    meta: {
      title: 'Page Not Found -资源管理系统'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
  /*if (store.state.userInfo || to.path === '/login') {
    next()
  }else{
    next({
      path:'/login'
    })
  }
*/
})
export default router
