import Vue from 'vue'
import {
  SET_PRODUCT_LIST,
  SELECT_PRODUCT,
  UNSELECT_ALL_PRODUCT,
  CLEAR_PRODUCT_LIST
} from '../mutation-types'

const state = {
  productList: []
}

const getters = {
  productList: state => state.productList,
  productListHot: state => state.productList.filter(item => item.is_hot),
  productListSuit: state => state.productList.filter(item => item.is_suit),
  productListSingle: state => state.productList.filter(item => !item.is_suit),
  productSelectedList: state => state.productList.filter(item => item.selectCount > 0),
  totalSelectCount: state => {
    const reducer = (total, item) => total + item.selectCount
    return state.productList.reduce(reducer, 0)
  },
  totalPrice: state => {
    const reducer = (total, item) => {
      let price = item.vip_price
      if (!price) {
        price = item.price
      }
      return total + item.selectCount * parseInt(price, 10)
    }
    return state.productList.reduce(reducer, 0)
  },
  totalPriceOrigin: state => {
    const reducer = (total, item) => total + item.selectCount * parseInt(item.price, 10)
    return state.productList.reduce(reducer, 0)
  }
}

const mutations = {
  [SET_PRODUCT_LIST] (state, list) {
    const count = getters.totalSelectCount(state)
    if (count === 0 || state.productList.length !== list.length) {
      state.productList = list
    }
  },
  [CLEAR_PRODUCT_LIST] (state) {
    state.productList = []
  },
  [SELECT_PRODUCT] (state, payload) {
    Vue.set(payload.target, 'selectCount', payload.count)
  },
  [UNSELECT_ALL_PRODUCT] (state) {
    getters.productSelectedList(state).forEach(item => {
      Vue.set(item, 'selectCount', 0)
    })
  }
}

export default {
  state,
  getters,
  mutations
}
