import { createRouter,  createWebHashHistory } from 'vue-router'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: "/",
      redirect: "/home",
      name: "home",
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
    },
    
  ]
})

export default router
