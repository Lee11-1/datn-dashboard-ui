export default async ({router, store}) => {
  router.beforeEach((to, from) => {
    const access_token = store.state.Auth.access_token
    if (to.meta.auth && !access_token) {
      return {
        name: 'auth',
        query: {callback: to.fullPath}
      }
    }
  })
}
