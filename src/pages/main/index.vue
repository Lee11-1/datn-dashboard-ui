<template>
  <q-layout view="hHh Lpr lff"
            class="shadow-2 rounded-borders">
    <template v-if="processes.getting_context.in_progress">
      <q-page-container>
        <q-page class="window-height">
          <div class="row items-center full-height justify-center">
            <q-spinner-hourglass color="primary" size="100"/>
          </div>
        </q-page>
      </q-page-container>
    </template>
    <template v-else>
      <layout-header @menu_btn_clicked="$refs.left_drawer.toggle()"/>
      <layout-left-drawer ref="left_drawer"/>
      <q-page-container>
        <q-page class="q-pa-sm">
          <div class="row q-col-gutter-sm">
            <div class="col-12 desktop-only">
              <breadcrumbs/>
            </div>
            <div class="col-12">
              <router-view/>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </template>
  </q-layout>
</template>
<script>
import LayoutHeader from 'src/components/layout/header'
import LayoutLeftDrawer from 'src/components/layout/left-drawer'
import Breadcrumbs from 'src/components/layout/breadcrumbs'

import {reactive, onBeforeMount} from 'vue'
import {useStore} from 'vuex'

import {use_api} from 'src/composibles/api'

export default {
  components: {
    LayoutHeader,
    LayoutLeftDrawer,
    Breadcrumbs,
  },
  setup () {
    const store = useStore()
    const api = use_api()

    const processes = reactive({
      getting_context: {
        in_progress: false,
        error: null
      }
    })

    const get_context = async () => {
      let process = processes.getting_context
      process.in_progress = true

      const response = await api.get_context()
      if (response.status === 200) {
        store.commit('Context/loaded', response.data)
      } else {
        process.error = response.data.error
      }
      process.in_progress = false
    }

    onBeforeMount(() => {
      get_context()
    })

    return {
      processes
    }
  }
}
</script>
