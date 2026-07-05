import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const profile = ref(null); 
  
  const isLoggedIn = computed(() => !!user.value);
  const currentUser = computed(() => user.value);

  // 1. Sign Up
  function signUp(email, password, fullName, phone) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const newUser = {
      email,
      password,
      fullName,
      phone,
      role: 'USER'
    };

    const exists = users.find(u => u.email === email);
    if (exists) {
      throw new Error('Email already exists');
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    setUser(newUser);
  }

  // 2. Sign In
  function signIn(email, password) {
    const savedUser = JSON.parse(localStorage.getItem('user_credentials'));
    if (savedUser && savedUser.email === email && savedUser.password === password) {
      setUser(savedUser);
      return true;
    }
    throw new Error('Invalid email or password.');
  }

  // 3. Set User
  function setUser(userData) {
    user.value = {
      name: userData.name || userData.fullName || '',
      fullName: userData.fullName || userData.name || '',
      phone: userData.phone || '',
      email: userData.email || '',
      role: userData.role || 'USER'
    };

    localStorage.setItem('user', JSON.stringify(user.value));
  }

  // 4. Logout
  function logout() {
    user.value = null;
    profile.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("current_user");
  }

  async function fetchProfile() {
    return profile.value;
  }

  return { 
    user, 
    profile, 
    isLoggedIn, 
    currentUser, 
    signUp, 
    signIn, 
    setUser, 
    logout, 
    fetchProfile 
  };
});