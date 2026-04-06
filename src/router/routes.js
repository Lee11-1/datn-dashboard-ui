
export default [
  {
    name: 'main',
    path: '/',
    component: () => import('pages/main/index.vue'),
    redirect: {name: 'main.home'},
    meta: {
      auth: true
    },
    children: [
      {
        name: 'main.home',
        path: 'home',
        meta: {
          label: 'Applications',
          icon: 'apps'
        },
        component: () => import('pages/main/home'),
      }
    ]
  },
  {
    name: 'auth',
    path: '/auth',
    component: () => import('pages/auth.vue'),
  }
]
