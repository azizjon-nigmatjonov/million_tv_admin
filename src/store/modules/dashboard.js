import request from '@/utils/request'

const stats = {
    state: {
      dailyViews: [],
      mostMovies: [],
      lastSubscriptions: [],
      pagination: {}
    },
    getters: {
      dailyViews: state => state.dailyViews,
      mostMovies: state => state.mostMovies,
      lastSubscriptions: state => state.lastSubscriptions
    },
    mutations: {
      GET_DAILY_VIEWS: (state, dailyViews) => {
          state.dailyViews = dailyViews
      },
      GET_MOST_MOVIES: (state, mostMovies) => {
          state.mostMovies = mostMovies
      },
      GET_LAST_SUBSCRIPTIONS: (state, lastSubscriptions) => {
          state.lastSubscriptions = lastSubscriptions
      },
    },
    actions: {
      getDaily ({ commit }, page) {
        var getPrevMonthCount = function () { 
          var now = new Date();
          return new Date(now.getFullYear(), now.getMonth(), 0).getDate();         
        }
        return new Promise((resolve, reject) => {
        request({
            url: 'daily-view-count',
            params: { days: getPrevMonthCount() }
        })
          .then(result => {
          commit('GET_DAILY_VIEWS', result.daily_stats)
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getOnlineUsersCount({ commit }, params) {
      return new Promise((resolve, reject) => {
          request({
              url: '/report/online-users',
              method: 'get',
              params
          })
              .then(result => {
                  resolve(result)
              })
              .catch(error => {
                  reject(error)
              })
      })
  },
    getMostViewed ({ commit }, page) {
      return new Promise((resolve, reject) => {
        request({
            url: 'most-viewed-movies',
            params: { n_movies: 10 }
        })
          .then(result => {
          commit('GET_MOST_MOVIES', result.movies)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getLastSubscriptions ({ commit }, page) {
      return new Promise((resolve, reject) => {
        request({
            url: 'last-active-subscriptions',
            params: { number: 10 }
        })
          .then(result => {
          commit('GET_LAST_SUBSCRIPTIONS', result.transactions)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default stats
