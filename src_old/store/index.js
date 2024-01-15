import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: localStorage.getItem(`name`) || '',
    token: localStorage.getItem(`token`) || '',
  },
  getters: {
  },
  mutations: {
    setUserName(state,value) {
      state.userName = value
      localStorage.setItem(`name`, value)
    },
    setToken(state,value) {
      state.token = value
      localStorage.setItem(`token`, value)
    },
  },
  actions: {
  },
  modules: {
  }
})
