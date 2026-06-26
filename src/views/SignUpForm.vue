<template>
  <div class="signup-container">
    <header class="app-header">
     
    </header>

    <main class="signup-card">
      <h2 class="card-title">Create Your Account</h2>
      <p class="card-subtitle">Unlock exclusive travel deals & book your dream trip!</p>

      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="input-group">
          <i class="fa-solid fa-circle-user input-icon"></i>
          <input type="text" v-model="formData.fullName" placeholder="Full Name" required>
        </div>
        <div class="input-group">
          <i class="fas fa-phone-alt input-icon"></i>
          <input type="text" v-model="formData.phone" placeholder="Phone No" required>
        </div>

        <div class="input-group">
          <i class="fa-solid fa-envelope input-icon"></i>
          <input type="email" v-model="formData.email" placeholder="Email Address" required>
        </div>

        <div class="input-group">
  <i class="fa-solid fa-lock input-icon"></i>
  <input
    :type="isPasswordVisible ? 'text' : 'password'"
    v-model="formData.password"
    placeholder="Password"
    required
  />
  <span class="toggle-password" @click.stop="togglePasswordVisibility">
    <svg
      v-if="isPasswordVisible"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="svg-icon"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>

    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="svg-icon"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  </span>
</div>

<div class="input-group">
  <i class="fa-solid fa-lock input-icon"></i>
  <input
    :type="isConfirmPasswordVisible ? 'text' : 'password'"
    v-model="formData.confirmPassword"
    placeholder="Confirm Password"
    required
  />
  <span class="toggle-password" @click.stop="toggleConfirmPasswordVisibility">
    <svg
      v-if="isConfirmPasswordVisible"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="svg-icon"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>

    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="svg-icon"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  </span>
</div>

        <button type="submit" class="btn-submit">
          Create Account <span class="arrow">→</span>
        </button>
      </form>

      <footer class="card-footer">
  <p>Already have an account? <router-link to="/login">Login</router-link></p>
</footer>
    </main>
  </div>
</template>

<script>
export default {
  name: 'SignUpForm',
  data() {
    return {
      formData: {
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
      },
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
    }
  },mounted(){
const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    }
    window.addEventListener('resize', appHeight);
    appHeight();
  }
  ,
  
  
 methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible
    },
    toggleConfirmPasswordVisibility() {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible
    },
    handleSubmit() {
      if (this.formData.password !== this.formData.confirmPassword) {
        alert('Passwords do not match!')
        return
      }

      // ၁။ အကောင့်ရှိပြီးသား ဟုတ်မဟုတ် အရင်စစ်ဆေးမယ်
      const existingUser = localStorage.getItem('user_account')
      if (existingUser) {
        const savedUser = JSON.parse(existingUser)
        // ရိုက်ထည့်လိုက်တဲ့ email က ရှိပြီးသား email နဲ့ တူနေရင် တားဆီးမယ်
        if (this.formData.email === savedUser.email) {
          alert('Account already exists! Please log in instead.')
          this.$router.push('/login')
          return
        }
      }

      // ၂။ အကောင့်အသစ်ကို ဒေတာစုစည်းပြီး LocalStorage ထဲ သိမ်းမယ်
      const userData = {
        full_name: this.formData.fullName,
        phone: this.formData.phone,
        email: this.formData.email,
        password: this.formData.password
      }
      localStorage.setItem('user_account', JSON.stringify(userData))
      
      // ၃။ Sign Up လုပ်ပြီးတာနဲ့ တစ်ပြိုင်နက် Login အခြေအနေကို true ပေးလိုက်မယ်
      localStorage.setItem('is_logged_in', 'true')
      
      alert('Account Created Successfully!')
      
      // ၄။ Login စာမျက်နှာကို မသွားတော့ဘဲ Home Page (/) ဆီကို တိုက်ရိုက် လွှတ်လိုက်ပါမယ်
      this.$router.push('/')
    },
    signUpWithSocial(platform) {
      console.log(`Signing up with ${platform}`)
    },
    navigateToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
}

.signup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: var(--app-height, 100vh);
  background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('img/signupimg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden; 
}
.signup-scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.app-header {
  width: 100%;
  max-width: 450px;
  display: flex;
  justify-content: flex-start;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
}

.logo-icon {
  font-size: 2rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.brand-tagline {
  font-size: 0.85rem;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.signup-card {
  background: rgba(255, 255, 255, 0.95);
  width: 100%;
  max-width: 420px; 
  border-radius: 24px;
  padding: 30px 35px; 
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  position: relative;
  
  /* မလှုပ်အောင် ထိန်းထားခြင်း */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  will-change: transform;
  margin:60px auto;
}
.card-title {
  color: #0b1a30;
  font-size: 1.7rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}

.card-subtitle {
  color: #4a5568;
  font-size: 0.85rem;
  text-align: center;
  margin-bottom: 25px;
  line-height: 1.4;
}

.social-signup-section {
  text-align: center;
  margin-bottom: 25px;
}

.divider-text {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  line-height: 0.1em;
  margin: 10px 0 20px;
  color: #718096;
  font-size: 0.85rem;
}

.divider-text span {
  background: #ffffff;
  padding: 0 15px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.btn-social {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.btn-social:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.btn-social img {
  width: 24px;
  height: 24px;
}

.or-text {
  font-size: 0.8rem;
  color: #a0aec0;
  font-weight: 600;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  position: relative;
  width: 100%;
  display: block;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #a0aec0;
  font-size: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.input-group input {
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #334155;
  background-color: #f8fafc;
  outline: none;
}

.input-group input:focus {
  border-color: #00bcd4;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(0, 188, 212, 0.1);
}

.toggle-password {
  position: absolute !important;
  right: 16px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  cursor: pointer !important;
  user-select: none;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3 !important;
}
.svg-icon {
  width: 22px;
  height: 22px;
  color: #a0aec0;
  transition: color 0.2s;
}
.toggle-password:hover .svg-icon {
  color: #00bcd4;
}

.btn-submit {
  background: #00bcd4;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  transition:
    background 0.2s,
    transform 0.1s;
}

.btn-submit:hover {
  background: #00acc1;
}

.btn-submit:active {
  transform: scale(0.98);
}

.arrow {
  font-size: 1.1rem;
}

.card-footer {
  text-align: center;
  margin-top: 25px;
  font-size: 0.9rem;
  color: #4a5568;
}

.card-footer a {
  color: #00bcd4;
  text-decoration: none;
  font-weight: 600;
}

.card-footer a:hover {
  text-decoration: underline;
}
.hidden-icon {
  display: none !important;
}

@media (max-width: 480px) {
  .signup-container {
    padding: 20px;
    justify-content: center;
    align-items: center;
  }
  .signup-card {
    padding: 25px 20px;
  }
}
</style>
