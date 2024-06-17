import request from '@/utils/request'

const customers = {
    state: {
      customers: [],
      pagination: {}
    },
    getters: {
      paginationCustomers: state => state.pagination,
      customers: state => state.customers
    },
    mutations: {
      GET_CUSTOMERS: (state, customers) => {
          state.customers = customers
      },
      GET_CUSTOMERS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getCustomers ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null, search: '' }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/customer',
            method: 'get',
            params: { page: page.current, limit: page.pageSize, search: page.search, lang: page.lang }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_CUSTOMERS_PAGINATION', pagination)
          commit('GET_CUSTOMERS', result.customers)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default customers
