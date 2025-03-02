import { createRouter, createWebHashHistory } from 'vue-router'
import Blog from '../views/Blog.vue'
import Books from '../views/Books.vue'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/blog',
      name: 'Blog',
      component: Blog,
    },
    {
      path: '/books',
      name: 'Books',
      component: Books,
    },
  ],
})

export default router
