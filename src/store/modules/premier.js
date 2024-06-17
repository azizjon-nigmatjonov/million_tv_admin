import request from '@/utils/request'

const premiers = {
  state: {
    premierPackets: [],
  },
  getters: {
    premierPackets: state => state.premierPackets
  },
  mutations: {
    GET_PREMIERS: (state, premierPackets) => {
      state.premierPackets = premierPackets
    }
  },
  actions: {
    getPremierPackets({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/premier/packets',
          method: 'get',
        })
        .then(res => {
          commit('GET_PREMIERS', res)
          resolve(res)
        })
        .catch(err => {
          console.log(err)
        })
      })
    }
  }
}

export default premiers
