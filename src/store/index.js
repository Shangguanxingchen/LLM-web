import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: localStorage.getItem(`name`) || '',
    token: localStorage.getItem(`token`) || '',
    activeMenu: localStorage.getItem(`activeMenu`) || 'index',
    modelType: 'qs', //模型
    context: false, //上下文
    permit:'' //快捷提问
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
    setModelType(state,value) {
      state.modelType = value
    },
    setContext(state,value) {
      state.context = value
    },
    setActiveMenu(state,value) {
      state.activeMenu = value
      localStorage.setItem(`activeMenu`, value)
    },
    setPermit(state,value) {
      state.permit = value
    },
  },
  actions: {
  },
  modules: {
  }
})
