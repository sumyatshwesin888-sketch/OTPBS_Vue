<template>
  <div class="login-container">
    <main class="login-card">
      <h2 class="card-title">Welcome Back!</h2>
      <p class="card-subtitle">
        Unlock exclusive travel deals & book your dream trip!
      </p>

      <form @submit.prevent="handleSubmit" class="form-content">

        <!-- EMAIL -->
        <div class="input-group">
          <i class="fa-solid fa-envelope input-icon"></i>
          <input
            type="email"
            v-model="email"
            placeholder="Email Address"
            :disabled="loading"
            required
          />
        </div>

        <!-- PASSWORD -->
        <div class="input-group">
          <i class="fa-solid fa-lock input-icon"></i>

          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            :disabled="loading"
            required
          />

          <span class="toggle-password" @click="showPassword = !showPassword">
            👁
          </span>
        </div>

        <!-- OPTIONS -->
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember Me</span>
          </label>

          <a href="#" @click.prevent="forgotPassword">
            Forgot Password?
          </a>
        </div>

        <!-- SUBMIT -->
        <button
          type="submit"
          class="btn-submit"
          :disabled="loading || !formValid"
        >
          <span v-if="loading">Loading...</span>
          <span v-else>Login →</span>
        </button>

      </form>

      <footer class="card-footer">
        <p>
          Don't have an account?
          <a @click.prevent="$router.push('/signup')">Sign Up</a>
        </p>
      </footer>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth'

export default {
  name: 'LoginForm',

  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      loading: false,
      authStore: useAuthStore()
    }
  },

  computed: {
    formValid() {
      return this.email && this.password.length >= 6
    }
  },

  methods: {

    async handleSubmit() {
      this.loading = true

      try {

        // 🔥 ADMIN LOGIN (hardcoded)
        if (this.email === 'admin@gmail.com' && this.password === '123456') {
          const adminUser = {
            name: 'Admin',
            email: this.email,
            role: 'ADMIN'
          }

          this.authStore.setUser(adminUser)

          this.redirectAfterLogin(adminUser.role)
          return
        }

        // 🔥 NORMAL USER LOGIN (localStorage check)
        const saved = localStorage.getItem('user_credentials')
        if (!saved) throw new Error('No user found')

        const user = JSON.parse(saved)

        if (user.email !== this.email || user.password !== this.password) {
          throw new Error('Invalid credentials')

        }


        this.authStore.setUser({
  // name: user.fullName,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: 'USER'
})

this.redirectAfterLogin('USER')
        

       

      } catch (err) {
        alert(err.message || 'Login failed')
      } finally {
        this.loading = false
      }
    },

    redirectAfterLogin(role) {
     const goBooking = localStorage.getItem('goBooking')

  if (goBooking) {
    localStorage.removeItem('goBooking')
    this.$router.push(`/booking/${goBooking}`)
    return
  }

  if (role === 'ADMIN') {
    this.$router.push('/admin/dashboard')
    return
  }

  const redirect = this.$route.query.redirect || '/'
  this.$router.push(redirect)
 },

    forgotPassword() {
      alert('Forgot password feature coming soon')
    }
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  /* 🔥 Background image + dark overlay */
  background: linear-gradient(
      rgba(0, 0, 0, 0.55),
      rgba(0, 0, 0, 0.55)
    ),
    url('/login.avif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);

  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);

  animation: fadeIn 0.5s ease-in-out;
}

/* TITLE */
.card-title {
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  color: #0f172a;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 13px;
  text-align: center;
  color: #64748b;
  margin-bottom: 25px;
  line-height: 1.5;
}

/* INPUTS */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 14px 45px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 14px;
  background: #f8fafc;
  outline: none;
  transition: 0.3s;
}

.input-group input:focus {
  border-color: #00bcd4;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.15);
}

/* ICON */
.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

/* PASSWORD TOGGLE */
.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
}

/* OPTIONS */
.form-options {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-top: 5px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #334155;
}

.form-options a {
  color: #00bcd4;
  text-decoration: none;
}

.form-options a:hover {
  text-decoration: underline;
}

/* BUTTON */
.btn-submit {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #00bcd4, #0097a7);
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 188, 212, 0.3);
}

.btn-submit:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* FOOTER */
.card-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: #475569;
}

.card-footer a {
  color: #00bcd4;
  font-weight: 600;
  cursor: pointer;
}

/* ANIMATION */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RESPONSIVE */
@media (max-width: 480px) {
  .login-card {
    padding: 25px;
  }

  .card-title {
    font-size: 22px;
  }
}
</style>