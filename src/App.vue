<template>
  <v-app class="travelgo-premium-app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <svg class="brand-logo-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#ffffff"
              d="M12 2v7l9 6v-2l-9-5.5V3.5c0-.83-.67-1.5-1.5-1.5S9 2.67 9 3.5V9L0 14.5v2l9-6V19l-2 1.5V22l3.5-1 3.5 1v-1.5L12 19v-9.5z"
            />
            <path fill="#38bdf8" d="M12 9l8.5 5.5V16L12 11.5v-2.5z M9 11.5L0.5 16v-1.5L9 9v2.5z" />
          </svg>
          <span class="logo-text">Travel<span class="text-accent">Go</span></span>
        </div>

        <div class="nav-menu">
          <router-link to="/" class="nav-link" replace>Home</router-link>
          <router-link to="/packages" class="nav-link" replace>Packages</router-link>
          <router-link to="/destinations" class="nav-link" replace>Destinations</router-link>
          <router-link to="/about" class="nav-link" replace>About Us</router-link>
          <router-link to="/contact" class="nav-link" replace>Contact</router-link>
        </div>

        <div class="nav-actions">
          <template v-if="!$store.state.user">
            <button
              class="btn-login"
              @click="$router.replace('/login')"
              style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"
            >
              Login
            </button>
            <button class="btn-signup" @click="$router.replace('/signup')">Sign Up</button>
          </template>
          <template v-else>
            <v-menu
              min-width="150px"
              max-width="170px"
              rounded="lg"
              offset-y
              content-class="small-profile-menu-card"
            >
              <template v-slot:activator="{ props }">
                <v-btn variant="text" class="profile-trigger-btn" v-bind="props">
                  <v-avatar color="primary" size="32" class="mr-2 text-white font-weight-bold">
                    {{
                      ($store.state.user.name || $store.state.user.full_name || 'U')
                        .charAt(0)
                        .toUpperCase()
                    }}
                  </v-avatar>

                  <span class="user-display-name">
                    {{ $store.state.user.name || $store.state.user.full_name || 'User' }}
                  </span>
                  <v-icon icon="mdi-chevron-down" size="small" class="ml-1 text-white" />
                </v-btn>
              </template>

              <v-list
                class="mt-1 dropdown-card-list"
                density="compact"
                style="padding: 6px 0 !important"
              >
                <v-list-item
                  :to="profileRoute"
                  prepend-icon="mdi-account-outline"
                  min-height="36px"
                  class="px-4"
                >
                  <v-list-item-title
                    class="font-weight-medium"
                    style="font-size: 0.9rem; color: #334155"
                  >
                    My Profile
                  </v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click="handleLogout"
                  prepend-icon="mdi-logout"
                  class="text-red-darken-1 px-4"
                  min-height="36px"
                >
                  <v-list-item-title class="font-weight-medium" style="font-size: 0.9rem"
                    >Logout</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </div>
      </div>
    </nav>

    <main class="main-router-content">
      <router-view />
    </main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    // 💡 အသစ်ထည့်သွင်းလိုက်သည့် Computed Property ဖြစ်ပါသည်
    profileRoute() {
      const user = this.$store.state.user;
      
      // အကယ်၍ user ရှိပြီး role က ADMIN ဖြစ်နေလျှင် admin dashboard သို့ လွှတ်မည်
      if (user && user.role === 'ADMIN') {
        return '/admin/dashboard';
      }
      
      // ပုံမှန် user ဖြစ်လျှင် user profile သို့ သွားမည်
      return '/profile';
    }
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('logout').then(() => {
        if (this.$route.path !== '/') {
          this.$router.push('/')
        }
      })
    },
  },
}
</script>

<style>
body,
html {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow-y: auto !important;
  background-color: #f8fafc !important;
}

.small-profile-menu-card {
  min-width: 170px !important;
  max-width: 190px !important;
  width: 180px !important;
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.travelgo-premium-app {
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

.main-router-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Navbar styles */
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 20px 0;
  background-color: #0f172a !important; /* နမူနာ - AdminLayout ထဲကလို Dark Slate အရောင် */

  /* Solid ဖြစ်သွားတဲ့အတွက် အောက်က content တွေနဲ့ ကွဲပြားအောင် shadow လေး ထည့်ပေးနိုင်ပါတယ် */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo-svg {
  width: 32px;
  height: 32px;
  transform: rotate(45deg);
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.text-accent {
  color: #38bdf8;
}

.nav-menu {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Buttons style */
.btn-login {
  background: transparent;
  border: 1px solid #2563eb;
  color: white;
  padding: 8px 20px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #2563eb;
}

.btn-signup {
  background: #2563eb;
  color: white;
  border: none;
  padding: 9px 22px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-signup:hover {
  background: #1d4ed8;
}

/* Vuetify Profile Menu Button Styles */
.profile-trigger-btn {
  color: white !important;
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  padding: 0 12px !important;
  height: 40px !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 20px !important;
}

.profile-trigger-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
}

.user-display-name {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

/* Dropdown Menu List Card Shadow custom ညှိချက် */
.dropdown-card-list {
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08) !important;
  border: 1px solid #e2e8f0 !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
}
</style>
