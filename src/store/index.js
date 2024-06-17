import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import categories from './modules/categories'
import genres from './modules/genres'
import tags from './modules/tags'
import subscription from './modules/subscription'
import orderTable from './modules/orderTable'
import promocode from './modules/promocode'
import premier from './modules/premier'
import movies from './modules/movies'
import staff from './modules/staff'
import seasons from './modules/seasons'
import episodes from './modules/episodes'
import order from './modules/order'
import admins from './modules/admins'
import permissions from './modules/permissions'
import countries from './modules/countries'
import featuredMovies from './modules/featured-movies'
import attrs from '@/store/modules/attrs'
import feedbacks from './modules/feedbacks'
import customers from './modules/customers'
import tariffs from './modules/tariffs'
import dashboard from './modules/dashboard'
import settings from './modules/settings'
import guide from './modules/guide'
import instructions from './modules/instructions'
import imdb from './modules/imdb'
import reports from './modules/reports'
// default router permission control
import permission from './modules/permission'
import notifications from './modules/notifications'
import comments from './modules/comments'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    attrs,
    user,
    categories,
    dashboard,
    customers,
    genres,
    reports,
    tags,
    subscription,
    orderTable,
    promocode,
    premier,
    movies,
    seasons,
    episodes,
    permissions,
    countries,
    staff,
    imdb,
    admins,
    featuredMovies,
    feedbacks,
    order,
    settings,
    permission,
    tariffs,
    guide,
    instructions,
    notifications,
    comments,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
})
