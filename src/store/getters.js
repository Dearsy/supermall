const getters = {
  cartCount (state, getters) {
    return getters.cartList.length
  },
  cartList (state) {
    return state.cartList
  }
}
export default getters
