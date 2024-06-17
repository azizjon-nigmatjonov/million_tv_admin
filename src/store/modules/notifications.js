import request from '@/utils/request'
const customUrl = '/notification'
export default {
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    getNotificationTypes({ _ }, params) {
      return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}-type`,
            method: 'get',
            params
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
      })
    },
    getNotifications({ _ }, params) {
      return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get',
            params
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
      })
    },
    getNotification({ _ }, id) {
      return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${id}`,
            method: 'get'
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
      })
    },
    postCustomNotification({ _ }, data) {
      return new Promise((resolve, reject) => {
        request({
            url: '/send-custom-notifcation',
            method: 'post',
            data
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
      })
    },
    postNotification({ _ }, data) {
      return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'post',
            data
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
      })
    },
    putNotification({ _ }, { id, ...data }) {
      return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${id}`,
            method: 'put',
            data: {
              ...data,
              id: parseInt(id)
            }
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
      })
    },
    deleteNotification({ _ }, id) {
      return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${id}`,
            method: 'delete'
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
      })
    }
  }
}
