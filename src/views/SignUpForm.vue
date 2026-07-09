<template>
  <div class="signup-container">
    <main class="signup-card">


      <h2 class="card-title">Create Your Account</h2>
      <p class="card-subtitle">
        
        Unlock exclusive travel deals & book your dream trip!
      
      </p>

      <form @submit.prevent="handleSubmit" class="form-content">

        <!-- FULL NAME -->

        <!-- FULL NAME -->
        <div class="input-group">
          <i class="fa-solid fa-user input-icon"></i>
          <input
            type="text"
            v-model="fullName"
            placeholder="Full Name"
            required
          />
        </div>

        <!-- PHONE -->
        <div class="input-group">
          <i class="fa-solid fa-phone input-icon"></i>
          <input
            type="text"
            v-model="phone"
            placeholder="Phone Number"
            required
          />
        </div>
        <!-- EMAIL -->
        <div class="input-group">
          <i class="fa-solid fa-envelope input-icon"></i>
          <input
            type="email"
            v-model="email"
            placeholder="Email Address"
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
            required
          />
          <span class="toggle-password" @click="showPassword = !showPassword">
            👁
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
          <span class="toggle-password" @click="showConfirm = !showConfirm">
            👁
          </span>
        </div>

        <!-- SUBMIT -->
        <button type="submit" class="btn-submit" @click="saveUser">
          Create Account →
        </button>


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
import { useAuthStore } from '@/store/auth'

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
      authStore: useAuthStore()
    }
  },

  methods: {
      saveUser(){
          let user = {};
          user.profileName = this.fullName;
          user.phone = this.phone;
          user.email = this.email;
          user.password = this.password;
          user.userType = "CUSTOMER";
    },
    handleSubmit() {

      // ❗ password check
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!')
        return
      }

      const existingUser = localStorage.getItem('user_account')
      if (existingUser) {
        const savedUser = JSON.parse(existingUser)
        if (this.formData.email === savedUser.email) {
          alert('Account already exists! Please log in instead.')
          this.$router.push('/login')
          return
        }
      }

      const userData = {
        full_name: this.formData.fullName,
        phone: this.formData.phone,
        email: this.formData.email,
        password: this.formData.password
      }
      localStorage.setItem('user_account', JSON.stringify(userData))
      
      localStorage.setItem('is_logged_in', 'true')
      
      this.$store.commit('SET_USER', userData)
      
      alert('Account Created Successfully!')

      // 🚀 redirect logic
      const goBooking = localStorage.getItem('goBooking')

      if (goBooking) {
        localStorage.removeItem('goBooking')
        this.$router.push(`/booking/${goBooking}`)
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>
<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),
  url('/signupimg.png');
  background-size: cover;
  background-position: center;
}

.signup-card {
  width: 420px;
  background: rgba(255,255,255,0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}

.card-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.card-subtitle {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 12px 40px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.btn-submit {
  background: #00bcd4;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

.card-footer {
  text-align: center;
  margin-top: 15px;
}
</style>