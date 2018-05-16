import {
  SET_USER_INFO,
  SET_USER_FIRST
} from '../mutation-types'

const state = {
  userInfo: null,
  hasGetFirst: false
}
//isDev开发模式下为true, 要部署了就改为false
//const isDev = false
const getters = {
  userInfo: state => isDev ? {id:6} : state.userInfo,
  hasGetFirst: state => state.hasGetFirst
}

const mutations = {
  [SET_USER_INFO] (state, data) {
    state.userInfo = data
  },
  [SET_USER_FIRST] (state) {
    state.hasGetFirst = true
  }
}

export default {
  state,
  getters,
  mutations
}
