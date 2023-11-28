import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'

Vue.use(VueRouter)

NProgress.configure({ showSpinner: false })

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: `/login`,
    name: `login`,
    component: Login,
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  let token = localStorage.getItem(`token`)
  if (to.name !== `login` && token == null) {
    next({ name: `login` })
  } else {
    next()
  }
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
