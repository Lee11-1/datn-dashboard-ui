<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn flat round
             @click="$emit('menu_btn_clicked')"
             dense icon="menu"/>
      <q-toolbar-title>Dashboard</q-toolbar-title>
      <q-item>
        <q-item-section avatar>
          <q-avatar text-color="white" icon="person" size="lg" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-capitalize" style="font-size: 15px;">{{ full_name }}</q-item-label>
          <q-item-label caption style="color: #ffffff">{{ email }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator dark vertical />
      <q-item clickable @click="logout">
        <q-item-section>
          <q-icon name="logout" size="sm"/>
        </q-item-section>
      </q-item>
    </q-toolbar>
  </q-header>
</template>
<script>
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
export default {
  setup () {
    const store = useStore()
    const router = useRouter()

    const logout = () => {
      store.commit('Auth/signed_out')
      return router.push({name: 'auth'})
    }
    const redirect_to_app = (app_id) => {
      return router.push({
        name: 'main.app',
        params: {
          id: app_id
        }
      })
    }
    const local_storage_key = process.env.VUEX_KEY
    const data = JSON.parse(localStorage.getItem(local_storage_key))
    const full_name = data.Auth.user.fullName
    const email = data.Auth.user.email
    
    return {
      logout,
      full_name,
      email
    }
  }
}
</script>
