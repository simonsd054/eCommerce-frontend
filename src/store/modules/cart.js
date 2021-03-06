import api from '../../api/api'

// initial state
// shape: [{ id, quantity }]
const state = {
  items: [],
  cartItems: [],
  cartProducts: [],
  checkoutStatus: null,
  cartAddStatus: null,
  cartRemoveStatus: null,
  status: null
}

// getters
const getters = {
  cartTotalItems: (state) => {
    return state.items.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  },

  cartTotalPrice: (state) => {
    return state.items.reduce((total, item) => {
      let cartProduct = state.cartProducts.find(cartProduct => cartProduct.id === item.productId)
      return total + item.quantity * cartProduct.cost
    }, 0)
  }
}

// actions
const actions = {
  getCartProducts ({ state, commit }) {
    commit('emptyCartProducts')
    state.items.forEach((item) => {
      api().get(`api/products/${item.productId}`)
        .then(r => commit('setCartProducts', r.data))
        .catch(() => commit('setStatus', 'Cannot get products'))
    })
  },
  // checkout ({ commit, state }, products) {
  //   const savedCartItems = [...state.items]
  //   commit('setCheckoutStatus', null)
  //   // empty cart
  //   commit('setCartItems', { items: [] })
  //   shop.buyProducts(
  //     products,
  //     () => commit('setCheckoutStatus', 'successful'),
  //     () => {
  //       commit('setCheckoutStatus', 'failed')
  //       // rollback to the cart saved before sending the request
  //       commit('setCartItems', { items: savedCartItems })
  //     }
  //   )
  // },

  checkout ({ commit, state, rootState }) {
    api().get(`order/confirmOrder/${rootState.auth.username}`)
      .then(() => commit('setCheckoutStatus', 'Successfully checked out'))
      .catch(() => commit('setCheckoutStatus', 'Cannot Checkout'))
  },

  getCartItems ({ state, commit, rootState, dispatch }) {
    api().get(`order/cartItem/${rootState.auth.username}`)
      .then(r => {
        commit('setCartItems', r.data)
      })
      .catch(() => commit('setStatus', 'Cannot get cart items'))
      .then(() => {
        dispatch('getAllCartProducts', rootState.auth.username)
      })
    // commit('setCartItems', {items})
  },
  getAllCartProducts ({ state, commit }, username) {
    api().get(`order/getAllCartProducts/${username}`)
      .then(r => {
        commit('setCartProducts', r.data)
      })
      .catch(() => commit('setStatus', 'Cannot get cart products'))
  },
  addProductToCart ({ state, commit, rootState }, productId) {
    commit('setCheckoutStatus', null)
    const cartItem = state.items.find(
      item => item.productId === productId)
    if (!cartItem) {
      commit('pushProductToCart', { productId: productId, username: rootState.auth.username })
    } else {
      commit('incrementItemQuantity', cartItem)
    }
    const newItem = state.items.find(
      item => item.productId === productId)
    api()
      .post('/order/addToCart', newItem)
      .then(() => commit('setCartAddStatus', 'Success'))
      .catch(() => commit('setCartAddStatus', 'Failed'))
  },
  removeItemFromCart ({ state, commit, rootState }, productId) {
    api()
      .get(`order/removeCartItem/${rootState.auth.username}/${productId}`)
      .then(() => commit('setCartRemoveStatus', 'Success'))
      .catch(() => commit('setCartRemoveStatus', 'Failed'))
  },
  removeAllItemsFromCart ({ state, commit, rootState }) {
    api()
      .get(`order/removeAllCartItems/${rootState.auth.username}`)
      .then(() => commit('setCartRemoveStatus', 'Success'))
      .catch(() => commit('setCartRemoveStatus', 'Failed'))
  }
}

// mutations
const mutations = {
  setCartProducts (state, product) {
    state.cartProducts = product
  },

  pushProductToCart (state, payload) {
    state.items.push({
      productId: payload.productId,
      username: payload.username,
      quantity: 1
    })
  },

  emptyCardProducts (state) {
    state.cartProducts = null
  },

  setStatus (state, status) {
    state.status = status
  },

  incrementItemQuantity (state, cart) {
    const cartItem = state.items.find(item => item.productId === cart.productId)
    cartItem.quantity++
  },

  setCartItems (state, items) {
    state.items = items
  },

  setCheckoutStatus (state, status) {
    state.checkoutStatus = status
  },

  setCartAddStatus (state, cartAddStatus) {
    state.cartAddStatus = cartAddStatus
  },
  setCartRemoveStatus (state, cartRemoveStatus) {
    state.cartRemoveStatus = cartRemoveStatus
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
