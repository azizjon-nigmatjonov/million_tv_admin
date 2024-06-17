import request from '@/utils/request'

const subscripton = {
  state: {
    subscriptions: [],
    pagination: {},
    subscriptionsModel: [],
    paginationSubscriptionsModel: {}
  },
  getters: {
    subscriptions: state => state.subscriptions,
    paginationSubscription: state => state.pagination,
    subscriptionsModel: state => state.subscriptionsModel,
    paginationSubscriptionsModel: state => state.paginationSubscriptionsModel
  },
  mutations: {
    GET_SUBSCRIPTIONS: (state, subscriptions) => {
      state.subscriptions = subscriptions
    },
    GET_SUBSCRIPTIONS_PAGINATION: (state, pagination) => {
      state.pagination = pagination
    },
    GET_SUBSCRIPTIONS_MODEL: (state, subscriptionsModel) => {
      state.subscriptionsModel = subscriptionsModel
    },
    GET_SUBSCRIPTIONS_MODEL_PAGINATION: (state, pagination) => {
      state.paginationSubscriptionsModel = pagination
    }
  },
  actions: {
    getSubscriptions({ commit }, payload) {
      console.log('page', payload)
      return new Promise((resolve, reject) => {
        if (!payload.page) {
          payload.page = { lang: 'ru' }
        }
        request({
          url: `/subscription/category`,
          method: 'get',
          params: {
            lang: payload.lang,
            page: payload.current,
            limit: payload.pageSize,
            search: payload.search,
            type: payload.type
          }
        })
          .then(result => {
            const pagination = { ...payload.page }
            pagination.total = parseInt(result.count ?? 0)
            commit('GET_SUBSCRIPTIONS_PAGINATION', pagination)
            commit('GET_SUBSCRIPTIONS', result.categories ?? [])
            resolve(result.categories)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getSubscriptionsModel({ commit }, payload) {
      return new Promise((resolve, reject) => {
        if (!payload) {
          payload = { lang: 'ru' }
        }
        request({
          url: '/subscriptionmodel',
          method: 'get',
          params: {
            category: payload.category_id,
            search: payload.search
          }
        })
          .then(result => {
            console.log('pageeee', payload)
            console.log('subscriptionModel', result.Subscriptions)
            const pagination = { ...payload }
            pagination.total = parseInt(result.count)
            commit('GET_SUBSCRIPTIONS_MODEL_PAGINATION', pagination)
            commit('GET_SUBSCRIPTIONS_MODEL', result.subscriptions)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default subscripton
