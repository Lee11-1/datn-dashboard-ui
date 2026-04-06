import createPersistedState from 'vuex-persistedstate'


export default async ({app, store}) => {
  // vuex persisted state
  createPersistedState({
    key: process.env.VUEX_KEY || 'DASHBOARD_APP',
    reducer (state) {
      return {
        Auth: {
          access_token: state.Auth.access_token,
          user: state.Auth.user,
          roles: state.Auth.user.roles,
        },
      }
    }
  })(store)
}
