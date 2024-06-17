import request from '@/utils/request'

const admins = {
    state: {
      admins: [],
      pagination: {}
    },
    getters: {
      paginationAdmins: state => state.pagination,
      admins: state => state.admins
    },
    mutations: {
      GET_ADMINS: (state, admins) => {
          state.admins = admins
      },
      GET_ADMINS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getAdmins ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null, search: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/admin',
            method: 'get',
            params: { page: page.current, limit: page.pageSize, search: page.search }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_ADMINS_PAGINATION', pagination)
          commit('GET_ADMINS', result.admins)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default admins
