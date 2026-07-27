<template>
  <div class="login-container">
    <main class="login-card">
      <h2 class="card-title">Welcome Back!</h2>
      <p class="card-subtitle">Unlock exclusive travel deals & book your dream trip!</p>

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

          <span class="toggle-password" @click.prevent="showPassword = !showPassword"
            >
            <!-- Password မြင်နေရချိန် (slash တုတ်ချောင်းပါသော မျက်လုံး) -->
            <svg
              v-if="showPassword"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
              ></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>

            <!-- Password ဖုံးထားချိန် (ရိုးရိုးမျက်လုံး) -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </span>
        </div>

        <!-- OPTIONS -->
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember Me</span>
          </label>

<a href="#" @click.prevent="showForgotModal = true"> Forgot Password? </a>        </div>

        <!-- SUBMIT -->
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading">Loading...</span>
          <span v-else @click="clickLogin">Login →</span>
        </button>
      </form>

      <footer class="card-footer">
        <p>
          Don't have an account?
          <a @click.prevent="$router.push('/signup')">Sign Up</a>
        </p>
      </footer>
    </main>
    <div v-if="showForgotModal" class="modal-overlay">
  <div class="forgot-modal-card">
    <h3 class="modal-title">Reset Password</h3>
    <p class="modal-subtitle">Enter your account email and new password.</p>

    <form @submit.prevent="handleResetPassword" class="modal-form">
      <div class="input-group">
        <i class="fa-solid fa-envelope input-icon"></i>
        <input type="email" v-model="forgotForm.email" placeholder="Enter your Email" required />
      </div>

      <div class="input-group">
        <i class="fa-solid fa-lock input-icon"></i>
        <input type="password" v-model="forgotForm.newPassword" placeholder="New Password" required />
      </div>

      <div class="input-group">
        <i class="fa-solid fa-lock input-icon"></i>
        <input type="password" v-model="forgotForm.confirmPassword" placeholder="Confirm Password" required />
      </div>

      <div class="modal-actions">
        <button type="button" class="btn-cancel" @click="showForgotModal = false">Cancel</button>
        <button type="submit" class="btn-reset" :disabled="loading">
          <span v-if="loading">Updating...</span>
          <span v-else>Update Password</span>
        </button>
      </div>
    </form>
  </div>
</div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth'
import userAccountService from '@/service/UserAccountService'
export default {
  name: 'LoginForm',

  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      loading: false,
      authStore: useAuthStore(),
      loginUser: {},
      showForgotModal: false,
    forgotForm: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  
    }
  },

  computed: {
    formValid() {
      return this.email && this.password.length >= 6
    },
  },
  mounted() {
    this.loginUser = JSON.parse(localStorage.getItem('loginUser'))
    // if(this.loginUser.userAccountId>0 || this.loginUser != undefined){
    //    this.$router.push('/');
    // }
  },
  methods: {
    // loginMethod(){
    //   console.log(this.email);
    //   console.log(this.password);
    // },

    async handleSubmit() {
      this.loading = true

      try {
        // 🔥 ADMIN LOGIN (hardcoded)
        // if (this.email === 'admin@gmail.com' && this.password === '123456') {
        //   const adminUser = {
        //     name: 'Admin',
        //     email: this.email,
        //     role: 'ADMIN'
        //   }

        //   this.authStore.setUser(adminUser)

        //   this.redirectAfterLogin(adminUser.role)
        //   return
        // }

        //  await this.authStore.signIn(
        //     this.email,
        //     this.password
        //   )

        //   this.redirectAfterLogin('USER'
        userAccountService
          .getLogin(this.email, this.password)
          .then((response) => {
            if (response.userAccountId == 0) {
              alert(' Email and Password is Wrong.')
            } else {
              localStorage.setItem('loginUser', JSON.stringify(response))

              this.loginUser = JSON.parse(localStorage.getItem('loginUser'))
              console.log(this.loginUser)

              if (this.loginUser.userType == 'ADMIN') {
                this.$router.push('/admin/dashboard')
              } else {
                this.$router.push('/')
              }
              // location.reload();
            }
          })
          .catch((err) => {
            console.error('API Fetch Error: ', err)
          })
      } catch (err) {
        alert(err.message || 'Login failed')
      } finally {
        this.loading = false
      }
    },

    // redirectAfterLogin(role) {
    //   const goBooking = localStorage.getItem('goBooking')

    //   if (goBooking) {
    //     localStorage.removeItem('goBooking')
    //     this.$router.push(`/booking/${goBooking}`)
    //     return
    //   }

    //   if (role === 'ADMIN') {
    //     this.$router.push('/admin/dashboard')
    //     return
    //   }

    //   const redirect = this.$route.query.redirect || '/'
    //   this.$router.push(redirect)
    // },

   async handleResetPassword() {
    // ၁. Password နှစ်ခု တူမတူ စစ်မည်
    if (this.forgotForm.newPassword !== this.forgotForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    this.loading = true;
    try {
      const payload = {
        email: this.forgotForm.email,
        password: this.forgotForm.newPassword,
      };

      // JS Service ထဲက updatePassword() ကို လှမ်းခေါ်မည်
      await userAccountService.updatePassword(payload);

      alert('Password Reset Successfully! You can now login.');
      
      // Modal ပြန်ပိတ်ပြီး Form ကို Reset လုပ်မည်
      this.showForgotModal = false;
      this.forgotForm = { email: '', newPassword: '', confirmPassword: '' };
    } catch (error) {
      console.error('Password Reset Error:', error);
      alert('Failed to reset password. Please try again!');
    } finally {
      this.loading = false;
    }
  }
  },
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
  min-height: calc(110vh);
  display: flex;
  justify-content: center;
  align-items: center;

  /*  Background image + dark overlay */
  background: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('/login.avif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  overflow: hidden;
  position: fixed;
}

.login-card {
  width: 100%;
  max-width: 380px;
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
  border-color: #2563eb;
  background: white;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
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
  font-size: 16px;
  color: #94a3b8;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toggle-password:hover {
  color:#2563eb;
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
  color: #2563eb;
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
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
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
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
}
/* 💡 FORGOT PASSWORD MODAL STYLES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.forgot-modal-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 15px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.btn-cancel {
  padding: 10px 16px;
  border: none;
  background: #e2e8f0;
  color: #475569;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-reset {
  padding: 10px 16px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-reset:disabled {
  background: #93c5fd;
  cursor: not-allowed;
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
