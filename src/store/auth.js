import { defineStore } from 'pinia';
import { ref, computed } from 'vue';


export const useAuthStore = defineStore('auth', () => {
  // State: 'user' is the active session, 'registered_user'
  // 
  //  is the account storage

  
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const profile = ref(null); // Kept for compatibility with your existing components
  
  const isLoggedIn = computed(() => !!user.value);
  const currentUser = computed(() => user.value);

  // 1. Sign Up: Saves account credentials and automatically logs in
 function signUp(email, password, fullName, phone) {
  const users = JSON.parse(localStorage.getItem('users')) || []

  const newUser = {
    email,
    password,
    fullName,
    phone,
    role: 'USER'
  }

  // prevent duplicate email
  const exists = users.find(u => u.email === email)
  if (exists) {
    throw new Error('Email already exists')
  }

  users.push(newUser)

  localStorage.setItem('users', JSON.stringify(users))

  // auto login
  setUser(newUser)
}

  // 2. Sign In: Validates against registered account
 function signIn(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || []

  const user = users.find(
    u => u.email === email && u.password === password
  )

  if (!user) {
    throw new Error('Invalid email or password')
  }

  setUser(user)
  return true
}

  function loadUser() { //new
  const savedUser = JSON.parse(localStorage.getItem('user'));

  if (savedUser) {
   user.value = savedUser;
  }
}

  // 3. Set User: Helper to save the active login session
  function setUser(userData) {
 user.value = {
    name: userData.name || userData.fullName || '',
    fullName: userData.fullName || userData.name || '',
    phone: userData.phone || '',
    email: userData.email || '',
    role: userData.role || 'USER'
  }

  localStorage.setItem('user', JSON.stringify(user.value))
}
  // 4. Logout: Removes only the login session, keeps account data
  function logout() {
    user.value = null;
    profile.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem("is_logged_in");
localStorage.removeItem("current_user");
  }

  // Placeholder for compatibility if your components call this
  async function fetchProfile() {
    return profile.value;
  }

  return { user, profile, isLoggedIn,currentUser, signUp, signIn, setUser, logout, fetchProfile ,loadUser};
});