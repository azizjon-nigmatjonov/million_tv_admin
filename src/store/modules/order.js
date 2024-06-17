import axiosInit from '@/utils/axios_init'
export default {
  state: {
    orders: [],
    loadOrder: false,
    pagination: {}
  },
  getters: {
    allOrders: (state) => state.orders,
    loadOrder: (state) => state.loadOrder,
    paginationOrder: (state) => state.pagination
  },
  mutations: {
    GET_ALL_ORDER(state, payload) {
      state.orders = payload
    },
    GET_LOAD_ORDER(state, payload) {
      state.loadOrder = payload
    },
    GET_ORDER_PAGINATION(state, payload) {
      state.pagination = payload
    }
  },
  actions: {
    getAllOrder({ commit }, payload) {
      return new Promise((resolve, reject) => {
        let { pagination, search } = payload
        commit('GET_LOAD_ORDER', true)
        // axios
        axiosInit.get('/orders', {
          limit: pagination.pageSize,
          offset: (pagination.current - 1) * pagination.pageSize,
          vendor_id: '5f50b5b8ac4f380011954421',
          search: search
        })
          .then(res => {
            resolve()
            console.log(res)
            pagination.total = parseInt(res.count)
            commit('GET_ORDER_PAGINATION', pagination)
            commit('GET_ALL_ORDER', res.orders)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
          .finally(() => {
            commit('GET_LOAD_ORDER', false)
          })
      })
    },
    // updateProduct ({ commit }, payload) {
    //   if (payload.locker) {
    //     payload.data.active = !payload.data.active
    //   }
    //   return new Promise((resolve, reject) => {
    //     axiosInit.put(`/products/${payload.id}`, payload.data)
    //       .then(res => {
    //         resolve(res)
    //         console.log(res)
    //       })
    //       .catch(error => {
    //         reject(error)
    //         console.log(error.message)
    //       })
    //   })
    // },
    // deleteProduct({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     axiosInit.delete(`/products/${payload}`)
    //       .then(res => {
    //         resolve()
    //         console.log(res)
    //       })
    //       .catch(error => {
    //         reject(error)
    //         console.log(error.message)
    //       })
    //   })
    // },
    // postProduct({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     axiosInit.post('/products', payload).then(res => {
    //       resolve(res)
    //       console.log(res)
    //     })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    // getProductBySlug({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     axiosInit.get(`/products/${payload.slug}`, {
    //       lang: payload.lang
    //     }).then(res => {
    //       resolve(res)
    //       console.log(res)
    //     }).catch(err => {
    //       reject(err)
    //     })
    //   })
    // }
  }
}
