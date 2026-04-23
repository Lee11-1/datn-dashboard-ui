import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import Context from './context'
import Auth from './auth'
import App from './app'
import Device from './device'

export default store(function (/* { ssrContext } */) {
  return  createStore({
    modules: {
      Context,
      Auth,
      App,
      Device
    },
    strict: process.env.DEBUGGING
  })
})
