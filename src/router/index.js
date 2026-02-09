import { createRouter, createWebHistory } from 'vue-router'
import ArticleList from '@/components/blog/ArticleList.vue'
import BookList from '@/components/books/BookList.vue'
import Home from '@/views/Home.vue'
import ArticlePage from '@/views/ArticlePage.vue'
import BookReviewPage from '@/views/BookReviewPage.vue'
import NotFound from '@/views/NotFound.vue'
import { setupPrefetching } from '@/utils/prefetch.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/blog',
      name: 'Blog',
      component: ArticleList,
    },
    {
      path: '/blog/articles/:id',
      name: 'ArticlePage',
      component: ArticlePage,
      props: true,
    },
    {
      path: '/books',
      name: 'Books',
      component: BookList,
    },
    {
      path: '/books/:id',
      name: 'BookReviewPage',
      component: BookReviewPage,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

// Setup automatic prefetching
setupPrefetching(router)

export default router
