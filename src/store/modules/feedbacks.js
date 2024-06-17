import request from '@/utils/request'

const feedbacks = {
    state: {
      feedbacks: [],
      pagination: {}
    },
    getters: {
      paginationFeedbacks: state => state.pagination,
      feedbacks: state => state.feedbacks
    },
    mutations: {
      GET_FEEDBACK: (state, feedbacks) => {
          state.feedbacks = feedbacks
      },
      GET_FEEDBACK_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getFeedbacks ({ commit }, page = { pageSize: null, current: null, slug: null, episode: null }) {
        return new Promise((resolve, reject) => {
        console.log(page)
        request({
            url: '/feedback',
            method: 'get',
            params: { limit: page.pageSize, page: page.current, movie_key: page.slug, episode_key: page.episode }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_FEEDBACK_PAGINATION', pagination)
          commit('GET_FEEDBACK', result.feedbacks)
          console.log(page, result.feedbacks)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default feedbacks
