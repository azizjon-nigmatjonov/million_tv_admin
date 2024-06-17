import request from '@/utils/request'

const genres = {
    state: {
      genres: [],
      pagination: {}
    },
    getters: {
      paginationGenres: state => state.pagination,
      genres: state => state.genres
    },
    mutations: {
      GET_GENRES: (state, genres) => {
          state.genres = genres
      },
      GET_GENRES_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getGenres ({ commit }, page = { pageSize: null, current: null, active: null }) {
        return new Promise((resolve, reject) => {
        if (!page) {
          page = { lang: 'ru' }
        }
        request({
            url: '/genres',
            method: 'get',
            params: { lang: page.lang, page: page.current, limit: page.pageSize, search: page.search, active: page.active }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_GENRES_PAGINATION', pagination)
          commit('GET_GENRES', result.genres)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default genres
