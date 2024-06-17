import axiosInit from '@/utils/axios_init'
export default {
  state: {
    data: [],
    loading: false,
    pagination: {}
  },
  getters: {
    allGuide: (state) => state.data,
    loadGuide: (state) => state.loading,
    paginationGuide: (state) => state.pagination
  },
  mutations: {
    GET_ALL_GUIDE(state, payload) {
      state.data = payload
    },
    GET_LOAD_GUIDE(state, payload) {
      state.loading = payload
    },
    GET_GUIDE_PAGINATION(state, payload) {
      state.pagination = payload
    }
  },
  actions: {
    getAllGuides({ commit }, payload) {
      return new Promise((resolve, reject) => {
        let { pagination } = payload
        commit('GET_LOAD_GUIDE', true)
        // axios
        axiosInit.get('/guides')
          .then(res => {
            resolve()
            pagination.total = parseInt(res.guides.length)
            commit('GET_GUIDE_PAGINATION', pagination)
            commit('GET_ALL_GUIDE', res.guides)
            console.log(res.guides)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
          .finally(() => {
            commit('GET_LOAD_GUIDE', false)
          })
      })
    },
    updateGuide({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axiosInit.put(`/guides/${payload.id}`, payload.data)
          .then(res => {
            resolve(res)
            console.log(res)
          })
          .catch(error => {
            reject(error)
            console.log(error.message)
          })
      })
    },
    deleteGuide({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axiosInit.delete(`/guides/${payload}`)
          .then(res => {
            resolve()
            console.log(res)
          })
          .catch(error => {
            reject(error)
            console.log(error.message)
          })
      })
    },
    postGuide({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axiosInit.post('/guides', payload).then(res => {
          resolve(res)
          console.log(res)
        })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
