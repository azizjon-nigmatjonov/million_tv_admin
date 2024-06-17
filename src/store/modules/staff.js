import request from '@/utils/request'

const staff = {
    state: {
      staff: [],
      pagination: {}
    },
    getters: {
      paginationStaff: state => state.pagination,
      staff: state => state.staff
    },
    mutations: {
      GET_STAFF: (state, staff) => {
          state.staff = staff
      },
      GET_STAFF_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getStaff ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null, search: null, lang: 'ru' }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/staff',
            params: { page: page.current, limit: page.pageSize, search: page.search, lang: page.lang }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_STAFF_PAGINATION', pagination)
          commit('GET_STAFF', result.staffs)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default staff
