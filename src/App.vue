<template>
  <v-app>
    <!-- Top Navbar -->
    <v-app-bar app elevation="2">
      <v-btn icon @click="drawer = !drawer">
        <v-icon icon="mdi-menu" />
      </v-btn>

      <router-link to="/" class="text-decoration-none text-white">
        <v-toolbar-title class="d-flex align-center">
          <v-avatar size="36">
            <v-img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" />
          </v-avatar>
          Shop Name
        </v-toolbar-title>
      </router-link>

      <v-spacer />
      <!-- LEFT SIDE NAV LINKS -->
      <div class="d-flex align-center ml-4">
        <v-btn to="/" variant="text" class="nav-link d-none d-md-flex"> Home </v-btn>

        <v-btn to="/about" variant="text" class="nav-link d-none d-md-flex"> Product </v-btn>

        <v-btn to="/contact" variant="text" class="nav-link d-none d-md-flex"> Contact </v-btn>
      </div>

      <v-spacer />

      <!-- RIGHT ICONS -->
      <v-btn icon>
        <v-icon>mdi-cart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-login</v-icon>
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="profile-btn" variant="text">
            <v-avatar size="32" class="mr-2">
              <v-img src="https://i.pravatar.cc/100" />
            </v-avatar>

            <span class="username">Snowy</span>

            <v-icon size="18" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list width="200" class="profile-menu">
          <v-list-item class="nav-link">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-divider />

          <v-list-item class="nav-link" @click="logout">
            <v-list-item-title class="text-red"> Logout </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Sidebar / Drawer -->
    <v-navigation-drawer v-model="drawer" app :temporary="$vuetify.display.smAndDown">
      <v-list nav>
        <v-list-item to="/" title="Home" prepend-icon="mdi-home" />
        <v-list-item to="/about" title="Product" prepend-icon="mdi-package-variant" />
        <v-list-item to="/contact" title="Contact" prepend-icon="mdi-phone" />
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    drawer: false,
  }),
  props: {},
  mounted: function () {},
  methods: {},
  watch: {},
  components: {},
}
</script>
<style scoped>
.shop-brand {
  cursor: pointer;
}

.shop-name {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.nav-link {
  font-size: 16px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.nav-link:hover {
  background-color: rgba(25, 118, 210, 0.1);
  transform: translateY(-2px);
}

.profile-btn {
  text-transform: none;
  border-radius: 12px;
  padding: 6px 10px;
}

.profile-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.username {
  font-weight: 500;
  font-size: 14px;
}

.profile-menu {
  border-radius: 12px;
  padding: 6px;
}
</style>
