import request from '@/utils/request'

const episodes = {
    state: {
      episodes: [],
      pagination: {}
    },
    getters: {
      paginationEpisodes: state => state.pagination,
      episodes: state => state.episodes
    },
    mutations: {
      GET_EPISODES: (state, episodes) => {
          state.episodes = episodes
      },
      GET_EPISODES_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getEpisodes ({ commit }, page) {
        return new Promise((resolve, reject) => {
        request({
            url: '/movie-serials/' + page.movie + '/season-episodes/' + page.season,
            params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_EPISODES_PAGINATION', pagination)
          commit('GET_EPISODES', result.episodes)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default episodes
