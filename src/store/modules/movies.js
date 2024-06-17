import request from '@/utils/request'

const movies = {
  state: {
    movies: [],
    pagination: {},
    masterclass: [],
    paginationM: {},
    story: [],
    paginationS: {}
  },
  getters: {
    paginationMovies: state => state.pagination,
    movies: state => state.movies,
    paginationMasterclass: state => state.paginationM,
    masterclass: state => state.masterclass,
    paginationStory: state => state.paginationS,
    story: state => state.story
  },
  mutations: {
    GET_MOVIES: (state, movies) => {
      state.movies = movies
    },
    GET_MOVIES_PAGINATION: (state, pagination) => {
      state.pagination = pagination
    },
    GET_MASTERCLASS: (state, movies) => {
      state.masterclass = movies
    },
    GET_MASTERCLASS_PAGINATION: (state, pagination) => {
      state.paginationM = pagination
    },
    GET_STORY: (state, movies) => {
      state.story = movies
    },
    GET_STORY_PAGINATION: (state, pagination) => {
      state.paginationS = pagination
    }
  },
  actions: {
    getMovies({ commit }, page) {
      if (!page) {
        page = { current: 1, pageSize: 10, total: null, search: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/movies',
          method: 'get',
          params: { page: page.current, limit: page.pageSize, search: page.search, lang: page.lang }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_MOVIES_PAGINATION', pagination)
            commit('GET_MOVIES', result.movies)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getMasterclass({ commit }, page) {
      if (!page) {
        page = { current: 1, pageSize: 10, total: null, search: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/movies',
          method: 'get',
          params: {
            page: page.current,
            limit: page.pageSize,
            search: page.search,
            lang: page.lang,
            category: '61f295dfbacce21c16325181'
          }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_MASTERCLASS_PAGINATION', pagination)
            commit('GET_MASTERCLASS', result.movies)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getStory({ commit }, page) {
      if (!page) {
        page = { current: 1, pageSize: 10, total: null, search: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/movies',
          method: 'get',
          params: {
            page: page.current,
            limit: page.pageSize,
            search: page.search,
            lang: page.lang,
            category: '61f2950bbacce2ec5b3250fb'
          }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_STORY_PAGINATION', pagination)
            commit('GET_STORY', result.movies)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default movies
