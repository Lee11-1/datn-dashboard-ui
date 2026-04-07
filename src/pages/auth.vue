<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="column window-height backgound">
          <div class="row justify-center q-my-auto">
            <div class="col-12 col-sm-12 col-md-6 col-lg-3">
              <q-card>
                <div class="row items-center q-py-xl text-center">
                  <div class="col-12 text-weight-bolder text-h5 tittle-login">
                    <a @click="redirec_tazoom()">MY DASHBOARD</a>
                  </div>
                </div>
                <q-card-section class="q-pb-xl">
                  <q-form @submit="login" greedy>
                    <div class="row q-col-gutter-sm q-ml-none">
                      <div class="col-12 q-px-lg">
                        <q-input
                          outlined dense
                          clearable
                          v-model="form.values.username"
                          label="Username"
                          :rules="form.rules.username"
                        >
                          <template v-slot:append>
                            <q-icon name="mdi-email"/>
                          </template>
                        </q-input>
                      </div>
                      <div class="col-12 q-px-lg">
                        <q-input
                          outlined dense
                          type="password"
                          v-model="form.values.password"
                          label="Password"
                          :rules="form.rules.password"
                        >
                          <template v-slot:append>
                            <q-icon name="mdi-lock"/>
                          </template>
                        </q-input>
                      </div>
                      <div class="col-12"
                           v-if="processes.authenticating.error_code">
                        <q-chip outline color="red" square size="sm">
                          {{ processes.authenticating.error_code }}
                        </q-chip>
                      </div>
                      <div class="col-12 q-px-lg">
                        <q-btn label="Sign In"
                                type="submit"
                                class="full-width"
                                :loading="processes.authenticating.in_progress"
                                unelevated color="primary"/>
                      </div>
                      <div class="col-12 text-center q-pt-md cursor-pointer" @click="this.$refs.b2b_forget_password_dialog.open()">
                        Forgot Password?
                      </div>
                      <div class="col-12 text-center q-pt-xs">
                        Don't have an account? 
                        <a class="text-primary cursor-pointer" @click="get_redirect()">
                        Sign Up
                        </a>
                      </div>
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
             <b2b-welcome-dialog ref="b2b_welcome_dialog"
                                 @registered="this.$refs.b2b_register_success_dialog.open()"/>
             <b2b-forget-password-dialog ref="b2b_forget_password_dialog" />
             <!-- <b2b-register-success-dialog ref="b2b_register_success_dialog" /> -->
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
// import B2bWelcomeDialog from 'src/pages/static/sign-up/welcome'
// import B2bRegisterSuccessDialog from 'src/pages/static/sign-up/b2c-register/index.vue'
// import B2bForgetPasswordDialog from 'src/pages/static/forget-password-dialog.vue'
import {use_api} from 'src/composibles/api'
import {useStore} from 'vuex'

export default {
  components:{
    // B2bWelcomeDialog,
    // B2bForgetPasswordDialog,
    // B2bRegisterSuccessDialog,
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const api = use_api()
    const get_redirect = () => {
      let result = {
        name: 'main.sign-up',
      }
      router.push(result)
    }
    const form = reactive({
      valid: false,
      values: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          v => (!!v && !!v.trim()) || 'Required!'
        ],
        password: [
          v => (!!v && !!v.trim()) || 'Required!'
        ]
      }
    })

    const processes = reactive({
      authenticating: {
        in_progress: false,
        error_code: null,
        error_message: null
      }
    })

    const login = async () => {
      let process = processes.authenticating
      if (process.in_progress) return
      process.in_progress = true
      process.error_code = null
      process.error_message = null

      let payload = {...form.values}
      // payload.password = btoa(form.values.password)

      const response = await api.authenticate(form.values)
      if (response.status === 200) {
        // success
        store.commit('Auth/signed_in', response.data.data)
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
      login,
      get_redirect
    }
  },
  methods:{
    redirec_tazoom(){
      let tazoom_link = process.env.FRONTEND_URL
      if(tazoom_link){
          window.location.href = tazoom_link
      }else{
          window.location.reload()
      }
    }
  }
}
</script>


