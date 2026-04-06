
export default [
  {
    name: 'main',
    path: '/',
    component: () => import('pages/main/index.vue'),
    redirect: {name: 'main.apps'},
    meta: {
      auth: true
    }
  },
  {
    name: 'auth',
    path: '/auth',
    component: () => import('pages/auth.vue'),
  }
]
