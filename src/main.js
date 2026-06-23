import { createApp } from 'vue'
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

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: { mdi },
  },
})

// App ကို အရင်ဆောက်ရပါမယ်
const app = createApp(App)

// Middleware တွေကို သုံးမယ် (use)
app.use(router)
app.use(vuetify)
app.use(store)

// အားလုံးပြီးမှ အောက်ဆုံးကနေ တစ်ကြိမ်ပဲ Mount လုပ်ရပါမယ်
app.mount('#app')