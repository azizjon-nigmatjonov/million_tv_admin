import request from '@/utils/request'

const settings = {
    state: {
      settings: [],
      pagination: {}
    },
    getters: {
      paginationSettings: state => state.pagination,
      settings: state => state.settings
    },
    mutations: {
      GET_SETTINGS: (state, settings) => {
          state.settings = settings
      },
      GET_SETTINGS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getSettings ({ commit }, page = { pageSize: null, current: null }) {
        return new Promise((resolve, reject) => {
        if (!page) {
          page = { lang: 'ru' }
        }
        console.log(page)
        request({
            url: '/settings',
            method: 'get',
            params: { lang: page.lang, page: page.current, limit: page.pageSize, search: page.search }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_SETTINGS_PAGINATION', pagination)
          commit('GET_SETTINGS', result.settings)
          console.log(page, result.settings)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default settings
