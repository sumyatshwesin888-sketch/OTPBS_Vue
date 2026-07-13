import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

// Views
import HomeView from '../views/HomeView.vue'
import AdminLayout from '../components/layouts/AdminLayout.vue'
import BookingPage from '../components/BookingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [

  
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutUs.vue')
    },

    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpForm.vue')
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginForm.vue')
    },

    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue')
    },

    {
      path: '/packages',
      name: 'packages',
      component: () => import('../views/Packages.vue')
    },
    
    {
      path: '/infopackages',
      name: 'infopackages',

      component: () => import('../views/InfoPackages.vue'),
    },
    {
      path: '/packagedetail/:id',
      name: 'packagedetail',
      component: () => import('../views/PackageDetailView.vue')
    },

    {
      path: '/destinations',
      name: 'destinations',
      component: () => import('../views/Destination.vue')
    },

    {
      path: '/destination/:name',
      name: 'destination',
      component: () => import('../views/DestinationDetail.vue')
    },

   
    {
      path: '/booking/:id',
      name: 'booking',
      component: BookingPage,
    },

    {
      path: '/payment',
      name: 'payment',
      component: () => import('../components/PaymentPage.vue'),
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/confirmation',
      name: 'confirmation',
      component: () => import('../components/ConfirmationPage.vue'),
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/admin',
      component: AdminLayout,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },

        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../components/admin/AdminDashboard.vue')
        },

        {
          path: 'feedback',
          name: 'admin-feedback',
          component: () => import('../components/admin/AdminFeedback.vue')
        },

        {
          path: 'hotels',
          name: 'admin-hotels',
          component: () => import('../components/admin/AdminHotels.vue')
        },

        {
          path: 'itineraries',
          name: 'admin-itineraries',
          component: () => import('../components/admin/AdminItineraries.vue')
        },

        {
          path: 'products',
          name: 'admin-products',
          component: () => import('../components/admin/AdminProducts.vue')
        },

        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('../components/admin/AdminProfile.vue')
        },

        {
          path: 'sales',
          name: 'admin-sales',
          component: () => import('../components/admin/AdminSales.vue')
        },

        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../components/admin/AdminUsers.vue')
        }
      ]
    }
  ],
})
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()

//   const isLoggedIn = authStore.isLoggedIn
//   const user = authStore.user

 
//   if (to.meta.requiresAuth && !isLoggedIn) {
//     return next({
//       path: '/login',
//       query: { redirect: to.fullPath }
//     })
//   }

//   if (to.meta.requiresAdmin) {
//     if (!isLoggedIn || user?.role !== 'ADMIN') {
//       return next('/')
//     }
//   }

 
//   next()
// });

export default router