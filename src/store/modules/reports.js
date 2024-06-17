import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json',
}

const seasons = {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getRecentlySubscriptions({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/recently-subcriptions',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
            category: params.category
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostViewedTvChannels({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/most-viewed-tv-channels',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostViewedSerials({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/most-viewed-serials',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostViewedMovies({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/most-viewed-movies',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostFamedPlatforms({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/most-active-platforms',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostViewedAges({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/ages-of-customers',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            // console.log('age', result);
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getHourlyVisitors({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/hourly-views-report',
          method: 'get',
          params,
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getCountSubscriptions({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/count-subscriptions',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostActiveUsers({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/most-active-users',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMorePaidUsers({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/more-paid-user',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getUserInformation({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: 'report/user-informations',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getConnectedSubscription({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: 'report/connected-subscription',
          method: 'get',
          params: {
            status: params.status,
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getProfitReport({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/profit-report',
          method: 'get',
          params: {
            filter: params.filter,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getUsersActivityPeriod({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/report/users-activity-period',
          method: 'get',
          params: {
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getTvod({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: 'report/report-for-tvod',
          method: 'get',
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // excel
    getTransactionsExcel(_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/transactions-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            search: params.search
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    getCountSubscriptionsExcel(_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/count-subscriptions-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    getRecentlySubscriptionsExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/recently-subscriptions-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
            category: params.category
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getTvodExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/report-for-tvod-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostViewedTvChannelsExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/most-viewed-tv-channels-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostViewedMoviesExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/most-viewed-movies-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostViewedSerialsExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/most-viewed-serials-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostActiveUsersExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/most-active-users-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostFamedPlatformsExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/most-active-platforms-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMostViewedAgesExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/ages-of-customers-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getHourlyVisitorsExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/hourly-views-report-excel`,
          headers: headers,
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getMorePaidUsersExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/more-paid-user-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getUserInformationExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/user-informations-excel`,
          headers: headers,
          params: {
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getConnectedSubscriptionExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/connected-subscription-excel`,
          headers: headers,
          params: {
            status: params.status,
            limit: params.pagination.pageSize,
            page: params.pagination.current,
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getUsersActivityPeriodExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/users-activity-period-excel`,
          headers: headers,
          params: {
            start_date: params.start_date,
            end_date: params.end_date,
          },
        })
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getProfitReportExcel (_, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/excel/profit-report-excel`,
          headers: headers,
          params: {
            filter: params.filter,
            start_date: params.start_date,
            end_date: params.end_date,
          },
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
export default seasons
