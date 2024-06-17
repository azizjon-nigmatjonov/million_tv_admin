import request from '@/utils/request'

const orderTable = {
  state: {
    orderTableDatas: [],
    pagination: {},
    orderTableDatasModel: [],
    paginationOrderTableModel: {},
  },
  getters: {
    orderTableDatas: (state) => state.orderTableDatas,
    paginationOrderTable: (state) => state.pagination,
    orderTableDatasModel: (state) => state.orderTableDatasModel,
    paginationOrderTableModel: (state) => state.paginationOrderTableModel,
  },
  mutations: {
    GET_ORDER_TABLE: (state, orderTableDatas) => {
      state.orderTableDatas = orderTableDatas
    },
    GET_ORDER_TABLE_PAGINATION: (state, pagination) => {
      state.pagination = pagination
    },
    GET_ORDER_TABLE_MODEL: (state, orderTableDatasModel) => {
      state.orderTableDatasModel = orderTableDatasModel
    },
    GET_ORDER_TABLE_MODEL_PAGINATION: (state, pagination) => {
      state.paginationOrderTableModel = pagination
    },
  },
  actions: {
    getOrders({ commit }, payload) {
      return new Promise((resolve, reject) => {
        if (!payload.page) {
          payload.page = { lang: 'ru' }
        }
        request({
          url: `/order/get-list-order`,
          method: 'get',
          params: {
            lang: payload.lang,
            page: payload.current,
            limit: payload.pageSize,
            search: payload.search,
          },
        })
          .then((result) => {
            const pagination = { ...payload.page }
            pagination.total = parseInt(result.count ?? 0)
            commit('GET_ORDER_TABLE_PAGINATION', pagination)
            commit('GET_ORDER_TABLE', result.response ?? [])
            resolve(result.response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getOrderById({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/order/get-order-table/` + params.object_id,
          method: 'get',
          params: {},
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getOrdersTableModel({ commit }, payload) {
      return new Promise((resolve, reject) => {
        if (!payload) {
          payload = { lang: 'ru' }
        }
        request({
          url: '/subscriptionmodel',
          method: 'get',
          params: {
            category: payload.category_id,
            search: payload.search,
          },
        })
          .then((result) => {
            const pagination = { ...payload }
            pagination.total = parseInt(result.count)
            commit('GET_SUBSCRIPTIONS_MODEL_PAGINATION', pagination)
            commit('GET_SUBSCRIPTIONS_MODEL', result.orderTableDatas)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
}

export default orderTable
