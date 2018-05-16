import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import home from './modules/home'
import user from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    home,
    user
  },
  strict: debug
})
