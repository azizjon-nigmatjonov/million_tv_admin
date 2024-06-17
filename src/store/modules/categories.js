import request from '@/utils/request'

const categories = {
  state: {
    categories: [],
    pagination: {},
    tvcategories: [],
    tvpagination: {},
    tvchannel: [],
    tvchannelpagination: {},
    tvprograms: [],
    tvprogrampaginations: {},
  },
  getters: {
    paginationCategories: state => state.pagination,
    categories: state => state.categories,
    tvcategories: state => state.tvcategories,
    tvpagination: state => state.tvpagination,
    tvchannel: state => state.tvchannel,
    tvchannelpagination: state => state.tvchannelpagination,
    tvprograms: state => state.tvprograms,
    tvprogrampaginations: state => state.tvprogrampaginations,
  },
  mutations: {
    GET_CATEGORIES: (state, categories) => {
      state.categories = categories
    },
    GET_CATEGORIES_PAGINATION: (state, pagination) => {
      state.pagination = pagination
    },
    GET_TVCATEGORIES: (state, tvcategories) => {
      state.tvcategories = tvcategories
    },
    GET_TVCATEGORIES_PAGINATION: (state, tvpagination) => {
      state.tvpagination = tvpagination
    },
    GET_TVCHANNEL: (state, tvchannel) => {
      state.tvchannel = tvchannel
    },
    GET_TVCHANNEL_PAGINATION: (state, tvchannelpagination) => {
      state.tvchannelpagination = tvchannelpagination
    },
    GET_TVPROGRAMS: (state, tvprograms) => {
      state.tvprograms = tvprograms
    },
    GET_TVPROGRAMS_PAGINATION: (state, tvprogrampaginations) => {
      state.tvprogrampaginations = tvprogrampaginations
    }
  },
  actions: {
    getCategories({ commit }, page) {
      if (!page) {
        page = { current: 1, pageSize: 10, total: null, search: null, active: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/categories',
          method: 'get',
          params: { page: page.current, limit: page.pageSize, search: page.search, lang: page.lang, active: page.active }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_CATEGORIES_PAGINATION', pagination)
            commit('GET_CATEGORIES', result.categories)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getTvCategories({ commit }, page) {
      if (!page) {
        page = { current: 1, pageSize: 10, total: null, search: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/tv/category',
          method: 'get',
          params: { page: page.current, limit: page.pageSize, search: page.search }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_TVCATEGORIES_PAGINATION', pagination)
            commit('GET_TVCATEGORIES', result.categories)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getTvChannel({ commit }, page) {
      if (!page) {
        page = { current: 1, pageSize: 10, total: null, search: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/tv/channel',
          method: 'get',
          params: { page: page.current, limit: page.pageSize, search: page.search }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_TVCHANNEL_PAGINATION', pagination)
            commit('GET_TVCHANNEL', result.tv_channels)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getTvPrograms({ commit }, payload) {
      // if (!page) {
      //   page = { current: 1, pageSize: 10, total: null, search: null }
      // }
      return new Promise((resolve, reject) => {
        const url = payload.type === 'local' ? '/local-tv-programs' : '/international-tv-programs'
        request({
          url: url,
          method: 'get',
          // params: { page: page.current, limit: page.pageSize, search: page.search }
          params: {
            xml_title: payload.xmlTitle
          }
        })
          .then(result => {
            console.log('result', result)
            // const pagination = { ...page }
            // pagination.total = parseInt(result.count)
            // commit('GET_TVPROGRAM_PAGINATIONS', pagination)
            commit('GET_TVPROGRAMS', result.programme)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default categories
