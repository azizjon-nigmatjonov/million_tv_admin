import request from '@/utils/request'

const featuredMovies = {
    state: {
      featuredMovies: [],
      pagination: {},
      featuredMoviesT: [],
      paginationT: {}
    },
    getters: {
      paginationFeaturedMovies: state => state.pagination,
      featuredMovies: state => state.featuredMovies,
      paginationFeaturedMoviesT: state => state.paginationT,
      featuredMoviesT: state => state.featuredMoviesT
    },
    mutations: {
      GET_FEATURED_MOVIES: (state, featuredMovies) => {
          state.featuredMovies = featuredMovies
      },
      GET_FEATURED_MOVIES_PAGINATION: (state, pagination) => {
        state.paginationT = pagination
      },
      GET_FEATURED_MOVIEST: (state, featuredMovies) => {
        state.featuredMoviesT = featuredMovies
      },
      GET_FEATURED_MOVIES_PAGINATIONT: (state, pagination) => {
        state.paginationT = pagination
      },
    },
    actions: {
      getFeaturedMovies ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null, search: '' }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/featured-list',
            method: 'get',
            params: { page: page.current, limit: page.pageSize, search: page.search, lang: page.lang, is_selection: false }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_FEATURED_MOVIES_PAGINATION', pagination)
          commit('GET_FEATURED_MOVIES', result.featured_lists)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getFeaturedMoviesT ({ commit }, page) {
      if (!page) {
        page = { current: 1, pageSize: 10, total: null, search: '' }
      }
      return new Promise((resolve, reject) => {
      request({
          url: '/featured-list',
          method: 'get',
          params: { page: page.current, limit: page.pageSize, search: page.search, lang: page.lang, is_selection: true }
      })
        .then(result => {
          console.log('true', result.featured_lists)
        const pagination = { ...page }
        pagination.total = parseInt(result.count)
        commit('GET_FEATURED_MOVIES_PAGINATIONT', pagination)
        commit('GET_FEATURED_MOVIEST', result.featured_lists)
        resolve()
      })
      .catch(error => {
        reject(error)
      })
    })
  }
  }
}
  export default featuredMovies
