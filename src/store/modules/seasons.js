import request from '@/utils/request'

const seasons = {
    state: {
      seasons: [],
      pagination: {}
    },
    getters: {
      paginationSeasons: state => state.pagination,
      seasons: state => state.seasons
    },
    mutations: {
      GET_SEASONS: (state, seasons) => {
          state.seasons = seasons
      },
      GET_SEASONS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getSeasons ({ commit }, page) {
        return new Promise((resolve, reject) => {
        request({
            url: '/movie-serials/' + page.movie + '/seasons',
            params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_SEASONS_PAGINATION', pagination)
          commit('GET_SEASONS', result.seasons)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default seasons
