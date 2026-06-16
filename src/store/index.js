import { createStore } from 'vuex'
import axios from '../config'

export default createStore({
  state: {
    count: 0,
    userAccount: {
      userName: '',
      password: '',
      role: '',
      profileName: '',
      domain: '',
    },
  },

  mutations: {
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    },
    updateUserAccount: function (state, value) {
      state.userAccount = value
      if (value.password != undefined) {
        axios.defaults.headers.common['Authorization'] = `${value.password}`
      } else {
        axios.defaults.headers.common['Authorization'] = ``
      }
    },
  },

  actions: {
    increment({ commit }) {
      commit('increment')
    },
  },

  getters: {
    doubleCount(state) {
      return state.count * 2
    },
  },
})
