<template>
  <q-drawer
    bordered
    v-model="showed"
    :width="250"
    class="left-drawer"
  >
    <q-scroll-area class="fit">
      <div class="q-pa-xl text-white app-name">
        VNAMAZING
      </div>
      <q-list class="q-pl-lg">
        <div v-for="(route, index) in routes" :key="index">
          <q-item v-if="!route.child" clickable :to="route.param ? {name: route.name, param: route.param} : {name: route.name}" v-ripple >
            <q-item-section avatar>
              <q-icon :name="route.icon"/>
            </q-item-section>
            <q-item-section>
              {{route.label}}
            </q-item-section>
          </q-item>
          <q-expansion-item v-else
            :label="route.label"
            :icon="route.icon"
            default-opened
            class="expansion full-width q-pb-md"
          >
            <q-item clickable :to="item.param ? {name: item.name, params: item.param} : {name: item.name}" v-ripple
                    v-for="(item,idx) in route.child" :key="index +'-'+idx">
              <q-item-section>
                {{item.label}}
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </div>
        <q-separator class="separator" />
          <div class="q-pl-md q-py-sm text-white" style="font-weight: 400;">
            OTHERS
          </div>
          <div v-for="route in others_routes" :key="route.name">
            <q-item clickable :to="route.param ? {name: route.name, param: route.param} : {name: route.name}" v-ripple>
              <q-item-section avatar>
                <q-icon :name="route.icon"/>
              </q-item-section>
              <q-item-section>
                {{route.label}}
              </q-item-section>
            </q-item>
          </div>
        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="logout"/>
          </q-item-section>
          <q-item-section>
            Logout
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>
<script>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'
import { ROLE_CODES } from 'src/components/constants'

export default {
  setup () {
    const showed = ref(true)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const site = route.params.site
    let routes = [], others_routes = []
    console.log('check role', store.state.Auth.roles)
    let check_roles = store.state.Auth.roles.some(r => r === ROLE_CODES.admin)
    let tour_child = [

    ]

    if(check_roles){
      routes.push(
        {
          'name': 'main.users',
          'label': 'Users',
          'icon': 'person',
          'order': 2
        },
        {
          'name': 'main.products',
          'label': 'Products',
          'icon': 'grid_view',
          'order': 3
        },
        {
          'name': 'main.categories',
          'label': 'Categories',
          'icon': 'category',
          'order': 4
        },
        {
          'name': 'main.customers',
          'label': 'Customers',
          'icon': 'people',
          'order': 5
        },
        {
          'name': 'main.zones',
          'label': 'Zones',
          'icon': 'map',
          'order': 6
        },
        {
          'name': 'main.schedules',
          'label': 'Schedules',
          'icon': 'schedule',
          'order': 7
        }
      )
    }else{
      routes.push()

      others_routes = [
        {
          'name': 'main.payment_commission',
          'label': 'Payment Commission',
          'icon': 'shopping_bag',
        },
        {
          'name': 'main.support',
          'label': 'Support',
          'icon': 'help',
        },
        {
          'name': 'main.account.change-password',
          'label': 'Change Password',
          'icon': 'autorenew',
        },
      ]
    }

    routes.push(
      {
          'name': 'main.home',
          'label': 'Home',
          'icon': 'home',
          'order': 1
      },
      {
        'name': 'main.bookings',
        'label': 'Bookings',
        'icon': 'book',
        'order': 3
      }
    )

    routes = routes.sort(function(a, b){
        return a.order - b.order
    });

    const logout = () => {
      store.commit('Auth/signed_out')
      return router.push({name: site ? `${site}.auth` : 'auth'})
    }

    const redirect_supplier_terms_conditions = () =>{
      // let tazoom_link = process.env.FRONTEND_URL
      // if(tazoom_link){
      //     window.location.href = tazoom_link + '/supplier-term-condition'
      // }else{
      //     window.location.reload()
      // }
    }

    return {showed, routes, others_routes, site, logout, redirect_supplier_terms_conditions}
  }
}
</script>
<style scoped>
html {
  color: #90959A
}
.q-item.q-router-link--active, .q-item--active {
  color: white;
}
.q-item {
  min-height: 40px;
}

</style>
