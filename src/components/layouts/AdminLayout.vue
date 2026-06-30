<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AdminLayout',
  data() {
    return {
      drawer: true,
      rail: false,
      currentUser: null as { email: string; name: string; role: string } | null,
      navigationItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard-variant', value: 'dashboard', route: '/admin/dashboard' },
        { title: 'User Accounts', icon: 'mdi-account-group', value: 'users', route: '/admin/users' },
        { title: 'Products', icon: 'mdi-package-variant-closed', value: 'products', route: '/admin/products' },
        { title: 'Sales & Bookings', icon: 'mdi-receipt-text', value: 'sales', route: '/admin/sales' },
        { title: 'Hotels & Cities', icon: 'mdi-city', value: 'hotels', route: '/admin/hotels' },
        { title: 'Itineraries', icon: 'mdi-map-marker-path', value: 'itineraries', route: '/admin/itineraries' },
        { title: 'Feedback', icon: 'mdi-comment-quote', value: 'feedback', route: '/admin/feedback' },
      ]
    }
  },
  computed: {
    currentTitle(): string {
      const routeName = this.$route.name as string
      const item = this.navigationItems.find(i => i.value === routeName)
      return item ? item.title : 'Dashboard'
    },
    userInitial(): string {
      return this.currentUser?.name?.charAt(0).toUpperCase() || 'A'
    }
  },
  mounted() {
    this.checkAuth()
  },
  methods: {
    checkAuth() {
      const localAuth = localStorage.getItem('travelAdminAuth')
      const sessionAuth = sessionStorage.getItem('travelAdminAuth')

      if (localAuth === 'true') {
        this.currentUser = JSON.parse(localStorage.getItem('travelAdminUser') || '{"name": "Admin", "email": "admin@gmail.com", "role": "ADMIN"}')
      } else if (sessionAuth === 'true') {
        this.currentUser = JSON.parse(sessionStorage.getItem('travelAdminUser') || '{"name": "Admin", "email": "admin@gmail.com", "role": "ADMIN"}')
      }
    },
    handleLogout() {
      localStorage.removeItem('travelAdminAuth')
      localStorage.removeItem('travelAdminUser')
      sessionStorage.removeItem('travelAdminAuth')
      sessionStorage.removeItem('travelAdminUser')
      this.$router.push('/login')
    },
    goToProfile() {
      this.$router.push('/admin/profile')
    },
    toggleRail() {
      this.rail = !this.rail
    },
    navigateTo(route: string) {
      this.$router.push(route)
    }
  }
})
</script>

<template>
  <!-- Global Top Navigation Bar -->
  

  <!-- Admin Panel Layout: Sidebar + Content -->
  <div class="admin-layout">
    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      class="admin-sidebar"
      :width="rail ? 72 : 260"
    >
      <!-- Sidebar Header -->
      <div class="sidebar-header" :class="{ 'sidebar-header-rail': rail }">
        <v-btn
          icon
          variant="text"
          size="small"
          class="sidebar-toggle-btn"
          @click="toggleRail"
        >
          <v-icon size="20">{{ rail ? 'mdi-chevron-right' : 'mdi-menu' }}</v-icon>
        </v-btn>
        <span v-if="!rail" class="sidebar-title">Admin Panel</span>
      </div>

      <v-divider class="sidebar-divider"></v-divider>

      <!-- Navigation Items -->
      <v-list nav class="sidebar-list py-2">
        <v-list-item
          v-for="item in navigationItems"
          :key="item.value"
          :active="$route.path === item.route"
          class="sidebar-item"
          :class="{ 'sidebar-item-rail': rail }"
          @click="navigateTo(item.route)"
        >
          <template #prepend>
            <div class="sidebar-icon-wrap">
              <v-icon size="20">{{ item.icon }}</v-icon>
            </div>
          </template>
          <v-list-item-title v-if="!rail" class="sidebar-item-title">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <template #append>
        <v-divider class="sidebar-divider"></v-divider>
        <v-list-item
          class="sidebar-item sidebar-logout"
          :class="{ 'sidebar-item-rail': rail }"
          @click="handleLogout"
        >
          <template #prepend>
            <div class="sidebar-icon-wrap sidebar-icon-logout">
              <v-icon size="20">mdi-logout</v-icon>
            </div>
          </template>
          <v-list-item-title v-if="!rail" class="sidebar-item-title">Logout</v-list-item-title>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main class="admin-main">
      <v-container fluid class="admin-container pt-3">
        <!-- Page Title Bar -->
        <div class="page-title-bar mb-4">
          <div>
            <h1 class="page-title">{{ currentTitle }}</h1>
            <p class="page-subtitle">Manage your travel booking system</p>
          </div>
        </div>

        <router-view v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </v-container>
    </v-main>
  </div>
</template>

<style scoped>
/* Global Top Bar */
.global-topbar {
  background: #0f172a !important;
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
  z-index: 1100 !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15) !important;
}

.global-topbar :deep(.v-toolbar__content) {
  padding: 0 16px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 24px;
  margin-right: 16px;
  border-right: 1px solid rgba(255,255,255,0.08);
}

.topbar-logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topbar-logo-text {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.topbar-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.topbar-link {
  color: rgba(255,255,255,0.7) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  padding: 0 10px !important;
}

.topbar-link:hover {
  color: #ffffff !important;
  background: rgba(255,255,255,0.04) !important;
}

.topbar-link :deep(.v-icon) {
  color: rgba(255,255,255,0.5) !important;
  font-size: 16px !important;
  margin-right: 6px !important;
}

.topbar-user {
  display: flex;
  align-items: center;
}

.topbar-avatar-btn {
  color: rgba(255,255,255,0.85) !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  padding: 4px 8px !important;
  border-radius: 8px !important;
}

.topbar-avatar-btn:hover {
  background: rgba(255,255,255,0.06) !important;
}

.topbar-avatar {
  background: #2563eb;
}

.topbar-avatar-initial {
  color: white;
  font-weight: 700;
  font-size: 13px;
}

.topbar-user-name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.85);
  margin-left: 8px;
}

/* User Menu Dropdown */
.user-menu-card {
  border-radius: 10px !important;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06) !important;
}

.menu-user-header {
  display: flex;
  align-items: center;
}

.menu-item {
  min-height: 40px !important;
  padding: 0 12px !important;
  border-radius: 6px !important;
  margin: 0 4px !important;
}

.menu-item:hover {
  background: #f1f5f9 !important;
}

.menu-icon {
  color: #64748b;
  margin-right: 8px;
}

/* Admin Layout */
.admin-layout {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  padding-top: 80px;
}

/* Sidebar */
.admin-sidebar {
  background: #1e293b !important;
  border-right: 1px solid rgba(255,255,255,0.04) !important;
  flex-shrink: 0;
  top: 80px !important; /* Navbar ရဲ့ အောက်ကနေ စေချင်ရင် */
  height: calc(100vh - 80px) !important;
}

.admin-sidebar :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  min-height: 56px;
}

.sidebar-header-rail {
  justify-content: center;
  padding: 16px 0;
}

.sidebar-toggle-btn {
  color: rgba(255,255,255,0.5) !important;
  width: 32px;
  height: 32px;
}

.sidebar-toggle-btn:hover {
  color: rgba(255,255,255,0.85) !important;
  background: rgba(255,255,255,0.06) !important;
}

.sidebar-title {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.2px;
}

.sidebar-divider {
  border-color: rgba(255,255,255,0.06) !important;
  margin: 0 16px;
}

.sidebar-list {
  flex: 1;
}

.sidebar-item {
  margin: 2px 8px;
  border-radius: 8px !important;
  min-height: 44px;
  padding: 0 12px !important;
  transition: all 0.2s ease;
  color: rgba(255,255,255,0.6) !important;
}

.sidebar-item:hover {
  background: rgba(255,255,255,0.05) !important;
  color: rgba(255,255,255,0.9) !important;
}

.sidebar-item.v-list-item--active {
  background: rgba(59, 130, 246, 0.15) !important;
  color: #60a5fa !important;
}

.sidebar-item.v-list-item--active .sidebar-icon-wrap {
  background: rgba(59, 130, 246, 0.2);
}

.sidebar-item-rail {
  justify-content: center !important;
  padding: 0 !important;
  margin: 2px auto !important;
  width: 48px;
}

.sidebar-item-rail :deep(.v-list-item__prepend) {
  margin-inline-end: 0 !important;
}

.sidebar-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: rgba(255,255,255,0.5);
}

.sidebar-item:hover .sidebar-icon-wrap {
  color: rgba(255,255,255,0.8);
}

.sidebar-item.v-list-item--active .sidebar-icon-wrap {
  color: #60a5fa;
}

.sidebar-icon-logout {
  color: rgba(239, 68, 68, 0.6);
}

.sidebar-logout:hover .sidebar-icon-logout {
  color: rgba(239, 68, 68, 0.9);
}

.sidebar-item-title {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1px;
  margin-left: 4px;
}

/* Main Content */
.admin-main {
  flex: 1;
  background: #f4f6f9;
  min-height: calc(100vh - 56px);
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.admin-container {
  max-width: 1400px;
  padding: 12px 28px 24px 28px;
}

.page-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 2px;
  letter-spacing: -0.3px;
}

.page-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* Page Transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 960px) {
  .topbar-links {
    display: none;
  }

  .topbar-brand {
    border-right: none;
    margin-right: 0;
  }
}
</style>
