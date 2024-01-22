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
    // name: 'home',
    component: HomeView,
    redirect: `/index`,
    children: [
      {
        path: `index`,
        name: `index`,
        component: () => import('../views/AiTalkStream.vue'),
      },
      {
        path: `translate`,
        name: `translate`,
        component: () => import('../views/TranslateView.vue'),
      },
      {
        path: `annotation`,
        name: `annotation`,
        component: () => import('../views/AnnotationView.vue'),
      },
      {
        path: `optimize`,
        name: `optimize`,
        component: () => import('../views/OptimizeView.vue'),
      },
      {
        path: `generate`,
        name: `generate`,
        component: () => import('../views/GenerateView.vue'),
      },
      {
        path: `sql`,
        name: `sql`,
        component: () => import('../views/SqlView.vue'),
      },
      
    ]
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
  {
    path: '*',
    name: '404',
    component: () => import('../views/NotFound.vue')
  }
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
