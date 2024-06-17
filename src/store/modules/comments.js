import request from '@/utils/request'

const comments = {
  state: {
    comments: [],
    commentsDislike: [],
    commentsPagination: {},
  },
  getters: {
    comments: state => state.comments,
    commentsDislike: state => state.commentsDislike,
    commentsPagination: state => state.commentsPagination
  },
  mutations: {
    GET_COMMENTS: (state, comments) => {
      state.comments = comments
    },
    GET_DISLIKE_COMMENTS: (state, commentsDislike) => {
      state.commentsDislike = commentsDislike
    },
    GET_COMMENTS_PAGINATION: (state, commentsPagination) => {
      state.commentsPagination = commentsPagination
    }
  },
  actions: {
    getComments({ commit }, page) {
      console.log('GET COMMENTS')
      if (!page) {
        page = { current: 1, pageSize: 10, type: 'like' }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/comment',
          method: 'get',
          params: { page: page.current, limit: page.pageSize, type: 'like' }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            console.log('111', result)
            commit('GET_COMMENTS_PAGINATION', pagination)
            commit('GET_COMMENTS', result.comments)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getDislikeComments({ commit }, page) {
      console.log('GET COMMENTS')
      if (!page) {
        page = { current: 1, pageSize: 10, type: 'dislike' }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/comment',
          method: 'get',
          params: { page: page.current, limit: page.pageSize, type: 'dislike' }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            console.log('222', result)
            commit('GET_COMMENTS_PAGINATION', pagination)
            commit('GET_DISLIKE_COMMENTS', result.comments)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default comments
