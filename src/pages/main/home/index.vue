<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-center" style="min-height: 500px;">
      <div class="col-12 col-md-8 text-center">
        <h1 class="text-h2 text-primary q-mb-md">Welcome to Dashboard</h1>
        <p class="text-h6 text-grey-8 q-mb-lg">
          Hello {{ userName }}, welcome to your personal dashboard
        </p>
        <p class="text-subtitle1 text-grey-7 q-mb-xl">
          Manage your applications and resources from here
        </p>
        
        <div class="row q-gutter-md justify-center q-mt-lg">
          <q-card class="col-12 col-sm-5" flat bordered>
            <q-card-section>
              <q-icon name="dashboard" size="48px" color="primary" />
            </q-card-section>
            <q-card-section class="text-center">
              <div class="text-h6">My Applications</div>
              <p class="text-caption text-grey">View and manage your apps</p>
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-5" flat bordered>
            <q-card-section>
              <q-icon name="settings" size="48px" color="info" />
            </q-card-section>
            <q-card-section class="text-center">
              <div class="text-h6">Settings</div>
              <p class="text-caption text-grey">Manage your account</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
    
    const userName = computed(() => {
      return store.state.Auth.account?.name || 'User'
    })

    return {
      userName
    }
  }
}
</script>

<style lang="scss" scoped>
.q-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
</style>
