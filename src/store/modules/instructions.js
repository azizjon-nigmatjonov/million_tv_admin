import axiosInit from '@/utils/axios_init'
import notification from 'ant-design-vue/es/notification'
export default {
  state: {
    data: [],
    loading: false,
    pagination: {}
  },
  getters: {
    allInstruction: (state) => state.data,
    loadInstruction: (state) => state.loading,
    paginationInstruction: (state) => state.pagination
  },
  mutations: {
    GET_ALL_INSTRUCTION(state, payload) {
      state.data = payload
    },
    GET_LOAD_INSTRUCTION(state, payload) {
      state.loading = payload
    },
    GET_INSTRUCTION_PAGINATION(state, payload) {
      state.pagination = payload
    }
  },
  actions: {
    getAllInstruction({ commit }, payload) {
      return new Promise((resolve, reject) => {
        let { pagination } = payload
        commit('GET_LOAD_INSTRUCTION', true)
        // axios
        axiosInit.get(`/instructions/${payload.guid}`)
          .then(res => {
            resolve()
            const data = res.instructions ? res.instructions : []
            const total = (res.instructions && res.instructions.length) ? parseInt(res.instructions.length) : 0
            pagination.total = total
            commit('GET_INSTRUCTION_PAGINATION', pagination)
            commit('GET_ALL_INSTRUCTION', data)
          })
          .catch(error => {
            reject(error)
            notification.error({
              message: error.message
            })
          })
          .finally(() => {
            commit('GET_LOAD_INSTRUCTION', false)
          })
      })
    },
    updateInstruction({ commit }, payload) {
      console.log(payload)
      return new Promise((resolve, reject) => {
        axiosInit.put(`/instructions/${payload.guide_id}/${payload.insid}`, payload.data)
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
    deleteInstruction({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axiosInit.delete(`/instructions/${payload.guid}/${payload.insid}`)
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
    postInstruction({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axiosInit.post(`/instructions`, payload.data).then(res => {
          resolve(res)
          console.log(res)
        })
          .catch(error => {
            reject(error)
          })
      })
    },
    getInstructionById({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axiosInit.get(`/instructions/${payload.guid}/${payload.insid}`).then(res => {
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
