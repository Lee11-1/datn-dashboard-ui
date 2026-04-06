<template>
  <q-drawer
    v-model="showed"
    show-if-above
    :mini="miniState"
    bordered
    :width="210"
    :breakpoint="500"
  >
    <q-scroll-area class="fit">
      <q-list class="apps-main-menu">
        <q-item clickable :to="{name: route.name}"
        
                v-ripple v-for="route in routes"
                :key="route.name">
          <!-- <template v-if="route.name == 'main.apps'">
            <q-expansion-item
              class="app-expansion"
              :icon="route.icon"
              :label="route.label"
              dense-toggle
            >
              <q-item class="rounded-borders text-primary" v-for="app in apps" :key="app.id">
                <q-item-section style="color: #242121;font-size: 14px; font-weight: 600;">
                  <router-link :to="redirect_to_app(app.id)">
                    {{ app.name }}
                  </router-link>
                </q-item-section>
              </q-item>
            </q-expansion-item>
          </template>
          <template v-else> -->
            <q-item-section style="padding: 0 16px !important" avatar>
              <q-icon :name="route.icon"/>
            </q-item-section>
            <q-item-section class="text-weight-medium">
              {{route.label}}
            </q-item-section>
          <!-- </template> -->
        </q-item>
        <q-btn
          class="btn-toggle"
          dense
          round
          unelevated
          color="primary"
          :icon="miniState ? 'chevron_right' : 'chevron_left'"
          @click="toggle()"
        />
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>
<script>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {PERMISSIONS} from 'src/constants/permissions'
import {use_api} from 'src/composibles/api'

export default {
  components: {
  },
  data: () => ({
    permissions: null,
    apps: null,
    miniState: true
  }),
  created(){
    this.list_permissions()
    this.list_app()
  },
  methods:{
    async list_permissions (){
      let api = use_api()
      let payload = {
        page: 1,
        per_page: 50,
        sorts: '+created_at'
      }
      let response = await api.get_permission(payload)
      if (response.status === 200) {
        this.permissions = response.data.result
      }
    },
    async list_app (){
      let api = use_api()
      let payload = {
        page: 1,
        per_page: 50,
        sorts: '+created_at'
      }
      let response = await api.list_apps(payload)
      if (response.status === 200) {
        this.apps = response.data.result
      }
    },
    toggle () {
      this.miniState = !this.miniState
    },
  },setup () {
    const showed = ref(true)
    const store = useStore()
    const routes = []

    let role = store.state.Auth.roles;
    let permission = store.state.Auth.permissions;
    let app = store.state.Auth.apps;
    let full_access = role.filter(x => x.is_full_access)

    if(full_access.length > 0) {
      routes.push(
        {
          'name': 'main.apps',
          'label': 'Applications',
          'icon': 'apps'
        },
        {
          'name': 'main.bookings',
          'label': 'All Bookings',
          'icon': 'bookmarks'
        },
        {
          'name': 'main.suppliers',
          'label': 'Suppliers',
          'icon': 'settings_input_component'
        },
        {
          'name': 'main.currencies',
          'label': 'Currencies',
          'icon': 'payments'
        },
        {
          'name': 'main.languages',
          'label': 'Languages',
          'icon': 'translate'
        },
        {
          'name': 'main.storage',
          'label': 'Storage',
          'icon': 'storage'
        },
        {
          'name': 'main.iam',
          'label': 'IAM',
          'icon': 'admin_panel_settings'
        },
        {
          'name': 'main.loggings',
          'label': 'Loggings',
          'icon': 'manage_search'
        },
        {
          'name': 'main.accountlogging',
          'label': 'Account Loggings',
          'icon': 'account_circle'
        }
      )
    } else {
      permission.map(x => {
        if(x.code == PERMISSIONS.Manage_Applications){
          routes.push({
            'name': 'main.apps',
            'label': 'Applications',
            'icon': 'apps'
          })
        }
        if(x.code == PERMISSIONS.Manage_All_Bookings){
          routes.push({
          'name': 'main.bookings',
          'label': 'All Bookings',
          'icon': 'bookmarks'
        })
        }
        if(x.code == PERMISSIONS.Manage_Suppliers){
          routes.push({
          'name': 'main.suppliers',
          'label': 'Suppliers',
          'icon': 'settings_input_component'
        })
        }
        if(x.code == PERMISSIONS.Manage_Currencies){
          routes.push({
          'name': 'main.currencies',
          'label': 'Currencies',
          'icon': 'payments'
        })
        }
        if(x.code == PERMISSIONS.Manage_Languages){
          routes.push({
          'name': 'main.languages',
          'label': 'Languages',
          'icon': 'translate'
        })
        }
        if(x.code == PERMISSIONS.Manage_Storage){
          routes.push({
          'name': 'main.storage',
          'label': 'Storage',
          'icon': 'storage'
        })
        }
        if(x.code == PERMISSIONS.Manage_Iam){
          routes.push({
          'name': 'main.iam',
          'label': 'IAM',
          'icon': 'admin_panel_settings'
        })
        }
        if(x.code == PERMISSIONS.Manage_Loggings){
          routes.push({
          'name': 'main.loggings',
          'label': 'Loggings',
          'icon': 'manage_search'
        })
        }
        if(x.code == PERMISSIONS.Manage_Account_Loggings){
          routes.push({
          'name': 'main.accountlogging',
          'label': 'Account Loggings',
          'icon': 'account_circle'
        })
        }
      })
    }

    const redirect_to_app = (app_id) => {
      let result = {
        name: 'main.app',
        params: {
          id: app_id
        }
      }
      return result
    }

    return {
      showed,
      routes,
      redirect_to_app
    }
  }
}
</script>
