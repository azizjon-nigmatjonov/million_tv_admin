import request from '@/utils/request'

const promocode = {
  state: {
    promocodes: [],
    pagination: {},
    promocodeModels: [],
    paginationPromocodeModel: {},
  },
  getters: {
    promocodes: (state) => state.promocodes,
    paginationPromocode: (state) => state.pagination,
    promocodeModels: (state) => state.promocodeModels,
    paginationPromocodeModel: (state) => state.paginationPromocodeModel,
  },
  mutations: {
    GET_PROMOCODES: (state, promocodes) => {
      state.promocodes = promocodes
    },
    GET_PROMOCODE_PAGINATION: (state, pagination) => {
      state.pagination = pagination
    },
    GET_PROMOCODE_MODEL: (state, promocodeModels) => {
      state.promocodeModels = promocodeModels
    },
    GET_PROMOCODE_MODEL_PAGINATION: (state, pagination) => {
      state.paginationPromocodeModel = pagination
    },
  },
  actions: {
    getPromocodes({ commit }, payload) {
      return new Promise((resolve, reject) => {
        if (!payload.page) {
          payload.page = { lang: 'ru' }
        }
        request({
          url: `/promocode/get-promo-code`,
          method: 'get',
          params: {
            lang: payload.lang,
            page: payload.current,
            limit: payload.pageSize,
            search: payload.search,
            type: payload.type,
          },
        })
          .then((result) => {
            const pagination = { ...payload.page }
            pagination.total = parseInt(result.count ?? 0)
            commit('GET_PROMOCODE_PAGINATION', pagination)
            commit('GET_PROMOCODES', result.result ?? [])
            resolve(result.result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getPromocodeById({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/promocode/' + params.id,
          method: 'get',
          params: { lang: params.lang },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
}

export default promocode
