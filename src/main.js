import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './store'

// Font Awesome Icons
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

// Vuetify Setup
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import axios from "axios";
import VueAxios from "vue-axios";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: { mdi },
  },
})

// App ကို အရင်ဆောက်
const app = createApp(App)

// Middleware တွေကို သုံး (use)
app.use(createPinia())
// app.use(axios)
app.use(VueAxios,axios)
app.use(router)
app.use(vuetify)
app.use(store)


app.mount('#app')