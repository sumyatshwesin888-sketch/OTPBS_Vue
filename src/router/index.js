import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import PackageDetailView from '../components/PackageDetailView.vue';
import BookingPage from '../components/BookingPage.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },

    

    {
      path: '/booking',
      name: 'booking',
      
      component: () => import('../components/BookingPage.vue'),
    },
        
  {
  path: '/booking/:id',
  name: 'Booking',
  component: () => import('../components/BookingPage.vue') // Your booking component
},

    

   

     {
      path: '/payment',
      name: 'PaymentPage',
      
      component: () => import('../components/PaymentPage.vue'),
    },
   
    
 {
      path: '/confirmation',
      name: 'Confirmation',
      
      component: () => import('../components/ConfirmationPage.vue'),
    },






  ],
})

export default router
