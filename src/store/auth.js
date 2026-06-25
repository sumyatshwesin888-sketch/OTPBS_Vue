import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)
  const isLoggedIn = computed(() => !!user.value)

  async function fetchProfile() {
    if (!user.value) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .maybeSingle()
    profile.value = data
  }

  async function init() {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    if (user.value) {
      await fetchProfile()
    }
    loading.value = false

    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null
      if (!user.value) {
        profile.value = null
      }
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
  }

  async function updateProfile(updates) {
    if (!user.value) return
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.value.id)
      .select()
      .maybeSingle()
    if (error) throw error
    if (data) profile.value = { ...profile.value, ...data }
  }

  return { user, profile, loading, isLoggedIn, init, signOut, updateProfile, fetchProfile }
})
