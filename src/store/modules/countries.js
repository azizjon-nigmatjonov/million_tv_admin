import request from '@/utils/request'

const countries = {
    state: {
      countries: [],
      pagination: {}
    },
    getters: {
      paginationCountries: state => state.pagination,
      countries: state => state.countries
    },
    mutations: {
      GET_COUNTRIES: (state, countries) => {
          state.countries = countries
      },
      GET_COUNTRIES_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getCountries ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null, search: null, lang: 'ru' }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/country',
            method: 'get',
            params: { page: page.current, limit: page.pageSize, search: page.search ? page.search : '', lang: page.lang }
        })
          .then(result => {
          const pagination = { ...page }
          const newList = []
          if (result?.countries?.length) {
            result.countries.forEach(element => {
              if (element.slug !== 'uzbekistan') {
                newList.push(element)
              } else {
                newList.unshift(element)
              }
            });
          }
          pagination.total = parseInt(result.count)
          commit('GET_COUNTRIES_PAGINATION', pagination)
          commit('GET_COUNTRIES', newList)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default countries
