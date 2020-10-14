import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from './views/Login.vue'
import Boards from '@/views/Boards.vue'
import Board from '@/views/Board.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Boards',
    component: Boards,
  },
  {
    path: '/board/:id',
    name: 'Board',
    props: true,
    component: Board
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Login' || to.name === 'Register') {
    next()
    return
  }

  const token = localStorage.getItem('access_token')
  if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router
