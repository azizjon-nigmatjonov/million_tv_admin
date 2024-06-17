import request from '@/utils/request'

const tags = {
    state: {
      tags: [],
      pagination: {}
    },
    getters: {
      paginationTags: state => state.pagination,
      tags: state => state.tags
    },
    mutations: {
      GET_TAGS: (state, tags) => {
        state.tags = tags
      },
      GET_TAGS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getTags ({ commit }, page = { pageSize: null, current: null, active: null }) {
        return new Promise((resolve, reject) => {
        if (!page) {
          page = { lang: 'ru' }
        }
        request({
            url: '/tags',
            method: 'get',
            params: { lang: page.lang, page: page.current, limit: page.pageSize, search: page.search, active: page.active }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_TAGS_PAGINATION', pagination)
          commit('GET_TAGS', result.tag)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default tags
