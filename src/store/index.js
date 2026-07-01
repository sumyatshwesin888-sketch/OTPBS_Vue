import { createStore } from 'vuex'
import axios from '../config'

export default createStore({
  state: {
    count: 0,
    user: null,
  },

  mutations: {
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    },
    
    SET_USER(state, value) {
      state.user = value
      
      if (value && value.password !== undefined) {
        axios.defaults.headers.common['Authorization'] = `${value.password}`
      } else {
        axios.defaults.headers.common['Authorization'] = ``
      }
    },

    CLEAR_USER(state) {
      state.user = null
      axios.defaults.headers.common['Authorization'] = ``
    }
  },

  actions: {
    increment({ commit }) {
      commit('increment')
    },
   logout({ commit }) {
  commit('CLEAR_USER')

  localStorage.removeItem('is_logged_in')
  localStorage.removeItem('current_user')
  localStorage.removeItem('user')
}
  },

  getters: {
    doubleCount(state) {
      return state.count * 2
    },
  },
})