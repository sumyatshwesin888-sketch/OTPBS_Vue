<template>
  <div class="signup-container">
    <main class="signup-card">
      <h2 class="card-title">Create Your Account</h2>
      <p class="card-subtitle">Unlock exclusive travel deals & book your dream trip!</p>

      <form @submit.prevent="saveUser" class="form-content">
        <div class="input-group">
          <i class="fa-solid fa-user input-icon"></i>
          <input type="text" v-model="fullName" placeholder="Full Name" required />
        </div>
        <div class="input-group">
          <i class="fa-solid fa-phone input-icon"></i>
          <input type="text" v-model="phone" placeholder="Phone Number" required />
        </div>
        <div class="input-group">
          <i class="fa-solid fa-envelope input-icon"></i>
          <input type="email" v-model="email" placeholder="Email Address" required />
        </div>
        <!-- PASSWORD -->
        <div class="input-group">
          <i class="fa-solid fa-lock input-icon"></i>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            required
          />
          <span class="toggle-password" @click.prevent="showPassword = !showPassword">
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

        <!-- CONFIRM PASSWORD -->
        <div class="input-group">
          <i class="fa-solid fa-lock input-icon"></i>
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="Confirm Password"
            required
          />
          <span class="toggle-password" @click.prevent="showConfirm = !showConfirm">
            <svg
              v-if="showConfirm"
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

        <!-- Password တူမတူ စာတန်းပြရန် (Optional/Realtime Feedback) -->
        <p v-if="confirmPassword && password !== confirmPassword" class="error-text">
          Passwords do not match!
        </p>

        <button type="submit" class="btn-submit">Create Account →</button>
      </form>

      <footer class="card-footer">
        <p>
          Already have an account?
          <router-link to="/login">Login</router-link>
        </p>
      </footer>
    </main>
  </div>
</template>

<script>
import UserAccountService from '@/service/UserAccountService'

export default {
  name: 'SignUpForm',

  data() {
    return {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirm: false,
      loginUser: {},
    }
  },
  mounted() {
    const appHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', appHeight)
    appHeight()
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible
    },
    toggleConfirmPasswordVisibility() {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible
    },

    saveUser() {
      const cleanPhone = this.phone.replace('+', '').replaceAll(' ', '').trim()

      if (isNaN(cleanPhone) || cleanPhone.length < 9) {
        alert('Enter Correct Phone No! ')
        return
      }
      //  Password ရှိမရှိစစ်
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match! Please check again.')
        return
      }
      //   if (this.password.length < 6) {
      //   alert('Password must be at least 6 characters long.')
      //   return
      // }

      const userData = {
        profileName: this.fullName,
        phone: this.phone,
        email: this.email,
        password: this.password,
        userType: 'Customer',
        status: 1,
      }

      UserAccountService.addUserAccount(userData)
        .then((response) => {
          console.log('Backend Response:', response)
          alert('Account Created Successfully!')
          this.$router.push('/login')
        })
        .catch((err) => {
          console.error('API Fetch Error: ', err)
          if (err.response && err.response.data && err.response.data.message) {
            alert(err.response.data.message)
          } else {
            alert('Failed to create account. Please try again.')
          }
        })
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.signup-container {
  width: 100%;
  min-height: calc(110vh);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/signupimg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 20px;
  overflow: hidden;
  position: fixed;
}
.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #94a3b8;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toggle-password:hover {
  color: #2563eb;
}
.signup-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  padding: 25px 30px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  margin: auto;
  animation: fadeIn 0.5s ease-in-out;
}

.card-title {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 4px;
}

.card-subtitle {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 16px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 10px 38px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  font-size: 13.5px;
}
.input-group input:focus {
  border-color: #2563eb;
  outline: none;
  background: white;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}
.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
}

.btn-submit {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 11px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 4px;
}
.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.3);
}

.card-footer {
  text-align: center;
  margin-top: 15px;
  font-size: 13px;
  color: #475569;
}
.card-footer a {
  color: #2563eb;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  margin-left: 4px;
}
.card-footer a:hover {
  color: #2563eb;
}
.error-text {
  color: #ef4444;
  font-size: 12px;
  margin-top: -4px;
  margin-bottom: 4px;
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
