import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import Context from './context'
import Auth from './auth'
import App from './app'
import Device from './device'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  return  createStore({
    modules: {
      Context,
      Auth,
      App,
      Device
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })
})
