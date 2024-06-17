import request from '@/utils/request'

const tariffs = {
    state: {
      tariffs: [],
      pagination: {}
    },
    getters: {
      paginationTarifs: state => state.pagination,
      tariffs: state => state.tariffs
    },
    mutations: {
      GET_TARIFS: (state, tariffs) => {
          state.tariffs = tariffs
      },
      GET_TARIFS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getTarifs ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null, search: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/tariff',
            method: 'get',
            params: { page: page.current, limit: page.pageSize, search: page.search }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_TARIFS_PAGINATION', pagination)
          commit('GET_TARIFS', result.tariffs)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getTariffById ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/tariff/' + params.id,
            method: 'get',
            params: { lang: params.lang }
        })
          .then(result => {
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
  }
  }
}
  export default tariffs
