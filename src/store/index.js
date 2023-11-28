import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: localStorage.getItem(`uname`) || '',
    token: localStorage.getItem(`token`) || '',
  },
  getters: {
  },
  mutations: {
    setUserName(value) {
      this.userName = value
      localStorage.setItem(`uname`, value)
    },
    setToken(value) {
      this.token = value
      localStorage.setItem(`token`, value)
    },
  },
  actions: {
  },
  modules: {
  }
})
