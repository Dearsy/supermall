import { ADD_COUNTER, ADD_TO_CART } from './mutations-types'
export default {
  // context里面有 commit state
  addCart ({ commit, state }, payload) {
    // 1. payload 添加新商品
    // 方法1 for
    // let Oldproduct = null
    // for (const item of state.cartList) {
    //   if (item.iid === payload.iid) {
    //     Oldproduct = item
    //   }
    // }
    // 方法2 arr.indexOf
    // 方法3 arr.find
    // 查找之前数组中是否有该商品
    return new Promise((resolve, reject) => {
      const Oldproduct = state.cartList.find(item => item.iid === payload.iid)
      // 2. 判断oldProduct
      if (Oldproduct) {
        // Oldproduct.count += 1
        commit(ADD_COUNTER, Oldproduct)
        resolve('商品数量加1')
      } else {
        payload.count = 1
        // state.cartList.push(payload)
        commit(ADD_TO_CART, payload)
        resolve('添加新的商品')
      }
    })
  }
}
