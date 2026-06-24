<template>
  <div class="login-container">
    <main class="login-card">
      <h2 class="card-title">Welcome Back!</h2>
      <p class="card-subtitle">Unlock exclusive travel deals & book your dream trip!</p>
       

      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="input-group">
          <i class="fa-solid fa-envelope input-icon"></i>
          <input 
            type="email" 
            v-model="formData.email" 
            placeholder="Email Address" 
            required 
          />
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

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="formData.rememberMe" />
            <span>Remember Me</span>
          </label>
          <a href="#" @click.prevent="handleForgotPassword" class="forgot-password">
            Forgot Password?
          </a>
        </div>

        <button type="submit" class="btn-submit">
          Log In <span class="arrow">→</span>
        </button>
      </form>

    <footer class="card-footer">
  <p>Don't have an account? <a href="/signup">Sign Up</a></p>
</footer>
    </main>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        rememberMe: false,
      },
      isPasswordVisible: false,
    }
  },
 methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible
    },
    handleSubmit() {
      const savedUser = localStorage.getItem('user_account')

      if (!savedUser) {
        alert('No account found! Please sign up first.')
        return
      }

      const user = JSON.parse(savedUser)

      if (this.formData.email === user.email && this.formData.password === user.password) {
        alert('Logged In Successfully!')
        
        localStorage.setItem('is_logged_in', 'true')
        
        this.$router.push('/profile')
      } else {
        alert('Invalid Email or Password! Please try again.')
      }
    },
    handleForgotPassword() {
      console.log('Redirect to Forgot Password Page')
    }
  },
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

.login-container {
  width: 100%;
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('img/login.avif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100%;
  max-width: 450px;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #0b1a30;
  font-size: 1.8rem;
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

.social-login-section {
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
  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.btn-social:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.btn-social img {
  width: 26px;
  height: 26px;
}

.or-text {
  font-size: 0.8rem;
  color: #a0aec0;
  font-weight: 600;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #a0aec0;
  font-size: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2; 
}

.input-group input {
  width: 100%;
  padding: 14px 45px 14px 45px;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #334155;
  background-color: #f8fafc;
  outline: none;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1; 
}

.input-group input:focus {
  border-color: #00bcd4;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(0, 188, 212, 0.1);
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;  /* ဗမာ့အတိုင်း width ကို ချုံ့လိုက်ပါတယ် */
  height: 24px; /* height ကို ချုံ့လိုက်ပါတယ် */
  z-index: 3;   /* Click နှိပ်လို့ရအောင် အပေါ်ဆုံးမှာ ထားပါတယ် */
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-top: 4px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  cursor: pointer;
}

.remember-me input {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #00bcd4;
}

.forgot-password {
  color: #000000;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
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
  transition: background 0.2s, transform 0.1s;
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

@media (max-width: 480px) {
  .login-container {
    padding: 20px;
  }
  .login-card {
    padding: 25px 20px;
  }
}
</style>