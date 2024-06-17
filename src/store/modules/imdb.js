import request from '@/utils/request'

export default {
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    getImbdRating({ _ }, id) {
      return new Promise((resolve, reject) => {
        request({
            url: `/imdb-rating/${id}`,
            method: 'get',
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getImbdSearchMovies({ _ }, { expression, lang }) {
      return new Promise((resolve, reject) => {
        request({
            url: `/${lang}/imdb-search-movies/${expression}`,
            method: 'get',
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getImbdSearchSeries({ _ }, { expression, lang }) {
      return new Promise((resolve, reject) => {
        request({
            url: `/${lang}/imdb-search-series/${expression}`,
            method: 'get',
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
