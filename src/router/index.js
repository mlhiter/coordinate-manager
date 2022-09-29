import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainView from '../layouts/MainView.vue'
import RegisterView from '../views/RegisterView.vue'
import PlacePart from '../views/PlacePart.vue'
import UserPart from '../views/UserPart.vue'
import MessagePart from '../views/MessagePart.vue'
import AboutView from '../views/AboutView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta:{
      title:"登录界面"
    }
  },
  {
    path: '/manage',
    name: 'main',
    component: MainView,
    children:[
      {
        path:'place',
        component: PlacePart,
        meta:{
          title:"管理界面"
        },
      },
      {
        path:'user',
        component:UserPart,
        meta:{
          title:"管理界面"
        },
      },
      {
        path:'message',
        component:MessagePart,
        meta:{
            title:"管理界面"
        },
      },
      {
        path:'about',
        component:AboutView,
        meta:{
            title:"管理界面"
        },
      }
    ]
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta:{
      title:"注册界面"
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title //在全局后置守卫中获取路由元信息设置title
})

export default router
