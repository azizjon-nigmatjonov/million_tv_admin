import request from '@/utils/request'

const permissions = {
    state: {
      permissions: [],
      pagination: {}
    },
    getters: {
      paginationPermissions: state => state.pagination,
      permissions: state => state.permissions
    },
    mutations: {
      GET_PERMISSIONS: (state, permissions) => {
          state.permissions = permissions
      },
      GET_PERMISSIONS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getPermissions ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null, search: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/permission',
            method: 'get',
            params: { page: page.current, limit: page.pageSize, search: page.search }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_PERMISSIONS_PAGINATION', pagination)
          commit('GET_PERMISSIONS', result.permissions)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default permissions
