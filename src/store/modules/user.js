import storage from 'store'
import { logout, login, getInfo } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const token = response.access_token
          storage.set('username', response.username)
          storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', token)
          setTimeout(function () { resolve() }, 1000)
        }).catch(error => {
          reject(error)
        })
      })
    },

    
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          var result
          var roleObj = {}
          result = {
            'id': response.id,
            'name': response.name,
            'username': response.username,
            'phone': response.phone,
            'roleId': 'admin',
            'role': {}
          }
            roleObj = {
              id: 'admin',
              'permissions': response.permissions.map((act) => {
                return ({
                  'roleId': 'admin',
                  'permissionId': act.key,
                  'permissionName': 'permission',
                  'actionEntitySet': [{
                    'action': 'add',
                    'defaultCheck': false
                  }, {
                    'action': 'query',
                    'defaultCheck': false
                  }, {
                    'action': 'get',
                    'defaultCheck': false
                  }, {
                    'action': 'update',
                    'defaultCheck': false
                  }, {
                    'action': 'delete',
                    'defaultCheck': false
                  }],
                  'actionList': null,
                  'dataAccess': null
                })
              })
            }

          result.role = roleObj
          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          }
          commit('SET_NAME', { name: result.username, welcome: welcome() })
          resolve(result)
        }).catch(err => {
          reject(err)
        })
      })
    },

    
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
