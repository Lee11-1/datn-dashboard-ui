<template>
  <q-layout>
    <q-page-container>
      <q-page class="auth-background">
        <div class="column window-height">
          <div class="row justify-center q-my-auto">
            <div class="row justify-center col-12 col-lg-4">
              <q-img :ratio="1" width="390px" :src="ota_logo"/>
            </div>
            <div class="row justify-center col-12 col-lg-4">
              <div class="window">
                <div class="text-h3 q-py-lg text-primary text-weight-medium">Sign In</div>
                <div>
                  <q-form @submit="authenticate" greedy>
                    <div class="row q-col-gutter-sm">
                      <div class="col-12 q-py-sm">
                        <input type="email" required
                               v-model="form.values.email"
                               class="full-width form-control"
                               placeholder="Your email">
                      </div>
                      <div class="col-12 q-py-sm">
                        <input type="password" required
                               v-model="form.values.password"
                               class="full-width form-control"
                               placeholder="Your password">
                      </div>
                      <div class="col-12"
                           v-if="processes.authenticating.error_code">
                        <q-chip outline color="red" square size="sm">
                          {{ processes.authenticating.error_code }}
                        </q-chip>
                      </div>
                      <div class="col-12">
                        <div class="row q-py-lg">
                          <q-btn label="Sign in"
                                 size="lg" no-caps
                                 type="submit" dense
                                 class="full-width"
                                 :loading="processes.authenticating.in_progress"
                                 unelevated color="primary"/>
                        </div>
                      </div>
                    </div>
                  </q-form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import {reactive} from 'vue'
import {useRouter, useRoute} from "vue-router"

import {use_api} from 'src/composibles/api'
import {useStore} from 'vuex'

export default {
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const api = use_api()
    const ota_logo = require('src/assets/images/ota_logo.svg')

    const form = reactive({
      valid: false,
      values: {
        email: '',
        password: '',
      }
    })

    const processes = reactive({
      authenticating: {
        in_progress: false,
        error_code: null,
        error_message: null
      }
    })

    const authenticate = async () => {
      let process = processes.authenticating
      if (process.in_progress) return
      process.in_progress = true
      process.error_code = null
      process.error_message = null

      const response = await api.authenticate(form.values)
      if (response.status === 200) {
        store.commit('Auth/signed_in', response.data)
        await router.push(route.query.callback || '/')
      } else {
        process.error_code = response.data.error
        process.error_message = response.data.message
      }
      process.in_progress = false
    }

    return {
      form,
      processes,
      authenticate,
      ota_logo
    }
  }
}
</script>
<style lang="scss">
.window{
  width:400px;
  height:380px;
  padding:40px;
  text-align:center;
  // border:1px solid white;
  border-radius:20px;
  backdrop-filter:blur(35px) brightness(200%);
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  color:white;
}
input[type="email"], input[type="password"]{
  padding: 0 10px;
  height: 40px;
  border:1px solid white;
  color:white !important;
  background:transparent;
}

input[type="email"]:focus, input[type="password"]:focus{
  background:#00000040;
  box-shadow:none;
  border:1px solid white;
}
input[type="email"]::placeholder, input[type="password"]::placeholder{
  color:white;
}
</style>