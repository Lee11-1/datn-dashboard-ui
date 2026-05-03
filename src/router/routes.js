
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
      {
        name: 'main.products',
        path: 'products',
        component: () => import('pages/main/products'),
        meta: {
          admin_require: true
        },
        children: [
          {
            name: 'main.products.detail',
            path: 'detail/:id',
            component: () => import('pages/main/products/detail'),
            meta: {
              admin_require: true
            }
          }
        ]
      },
      {
        name: 'main.categories',
        path: 'categories',
        component: () => import('pages/main/categories'),
        meta: {
          admin_require: true
        },
      },
       {
        name: 'main.customers',
        path: 'customers',
        component: () => import('pages/main/customers'),
        meta: {
          admin_require: true
        },
      },
      {
        name: 'main.zones',
        path: 'zones',
        component: () => import('pages/main/zones'),
        meta: {
          admin_require: true
        },
      },
      {
        name: 'main.schedules',
        path: 'schedules',
        component: () => import('pages/main/schedules'),
        meta: {
          admin_require: true
        },
      },
      {
        name: 'main.warehouses',
        path: 'warehouses',
        component: () => import('pages/main/warehouses'),
        meta: {
          admin_require: true
        },
      },
      {
        name: 'main.inventory',
        path: 'inventory',
        component: () => import('pages/main/inventory'),
        meta: {
          admin_require: true
        },
      }
    ]
  },
  {
    name: 'auth',
    path: '/auth',
    component: () => import('pages/auth.vue'),
  }
]
