
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
          label: 'Home',
          icon: 'home'
        },
        component: () => import('pages/main/home'),
      },
       {
        name: 'main.users',
        path: 'users',
        component: () => import('pages/main/users'),
        meta: {
          admin_require: true
        },
      },
    ]
  },
  {
    name: 'auth',
    path: '/auth',
    component: () => import('pages/auth.vue'),
  }
]
