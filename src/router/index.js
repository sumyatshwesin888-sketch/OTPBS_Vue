import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
<<<<<<< HEAD
import { useAuthStore } from '../store/auth';
=======
import AdminLayout from '../components/layouts/AdminLayout.vue'
>>>>>>> 5451f28041e7e291ceb676b99865bb1e8a5f583a

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
      component: () => import('../views/AboutUs.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpForm.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginForm.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
    },

    {
      path: '/booking',
      name: 'booking',

      component: () => import('../components/BookingPage.vue'),
    },

    {
      path: '/booking/:id',
      name: 'Booking',
      component: () => import('../components/BookingPage.vue'), // Your booking component
    },

    {
      path: '/payment',
      name: 'Payment',

      component: () => import('../components/PaymentPage.vue'),
    },

    {
      path: '/confirmation',
      name: 'Confirmation',

      component: () => import('../components/ConfirmationPage.vue'),
    },
    {
      path: '/packages',
      name: 'packages',

      component: () => import('../views/Packages.vue'),
    },
    {
      path: '/packagedetail/:id',
      name: 'packagedetail',

      component: () => import('../views/PackageDetailView.vue'),
    },

    {
      path: '/destinations',
      name: 'destinations',

      component: () => import('../views/Destination.vue'),
    },

    {
      path: '/destination/:name',
      name: 'destination',

      component: () => import('../views/DestinationDetail.vue'),
    },
    
    // ADMIN PAGES
    {
      path: '/admin',
      component:AdminLayout, // Admin အတွက် ဘေးတိုက် Frame/Layout
      children: [
        {
          path: '', // /admin နှိပ်ရင် Dashboard သို့ တိုက်ရိုက်သွား
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../components/admin/AdminDashboard.vue'),
        },
        {
          path: 'feedback',
          name: 'admin-feedback',
          component: () => import('../components/admin/AdminFeedback.vue'),
        },
        {
          path: 'hotels',
          name: 'admin-hotels',
          component: () => import('../components/admin/AdminHotels.vue'),
        },
        {
          path: 'itineraries',
          name: 'admin-itineraries',
          component: () => import('../components/admin/AdminItineraries.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('../components/admin/AdminProducts.vue'),
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('../components/admin/AdminProfile.vue'),
        },
        {
          path: 'sales',
          name: 'admin-sales',
          component: () => import('../components/admin/AdminSales.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../components/admin/AdminUsers.vue'),
        },
      ]
    }
  ],
})
router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'Login' };
  }
});
export default router
