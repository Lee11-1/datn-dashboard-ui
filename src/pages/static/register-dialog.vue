<template>
    <q-dialog v-model="showed" persistent>
      <q-card style="width: 500px; max-width: 90vw" v-if="showed">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6 text-center">Register</q-item-label>
          </q-item-section>
          <q-item-section avatar v-if="!processes.register.in_progress">
            <q-item-label>
              <q-btn flat round dense icon="close" @click="close"/>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-card-section class="q-pt-xl">
          <div class="row q-row-gutter-xl">
            <q-form @submit="register" greedy>
              <div class="row q-col-gutter-md q-ml-none">
                <div class="col-12 q-px-lg">
                  <q-input
                    outlined dense
                    v-model="form.values.email"
                    label="Email"
                    :rules="form.rules.text"
                  >
                  </q-input>
                </div>
                <div class="col-12 q-px-lg">
                  <q-input
                    outlined dense
                    type="password" label="Password"
                    v-model="form.values.password"
                    :rules="form.rules.password"
                  >
                  </q-input>
                </div>
                <div class="col-12 q-px-lg">
                  <q-input
                    outlined dense type="password"
                    v-model="form.values.confirm_password"
                    label="Confirm Password"
                    :rules="form.rules.confirm_password"
                  >
                  </q-input>
                </div>
                <div class="col-12 q-px-lg">
                  <q-input
                    outlined dense
                    v-model="form.values.first_name"
                    label="First Name"
                    :rules="form.rules.text"
                  >
                  </q-input>
                </div>
                <div class="col-12 q-px-lg">
                  <q-input
                    outlined dense
                    v-model="form.values.last_name"
                    label="Last Name"
                    :rules="form.rules.text"
                  >
                  </q-input>
                </div>
                <div class="col-12 q-px-lg">
                  <q-input
                    outlined dense type="number"
                    v-model="form.values.phone"
                    label="Phone"
                  >
                  </q-input>
                </div>
                <div class="col-12"
                      v-if="processes.register.error_code">
                  <q-chip outline color="red" square size="sm">
                    {{ processes.register.error_code }}
                  </q-chip>
                </div>
                <div class="col-12 q-px-lg">
                  <q-btn label="Register" type="submit" class="full-width" unelevated
                          style="background-color: #E622B3; color: white"
                          :loading="processes.register.in_progress"
                          />
                </div>
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
<script>

import {use_api} from 'src/composibles/api'

export default {
    data () {
      return {
        showed: false,
        processes: {
          register: {
            in_progress: false,
            platform_id: null,
            error: null,
          }
        },
        form: {
          values: {
            email: '',
            password: '',
            confirm_password: '',
            first_name: '',
            last_name: '',
            phone: ''
          },
          rules: {
            text: [
              v => (!!v && !!v.trim()) || 'Required!'
            ],
            password: [
              v => (!!v && !!v.trim()) || 'Required!'
            ],
            confirm_password: [
              v => this.check_pw(v) || 'Not match with password!'
            ]
          }
        },
        api: use_api()
      }
    },
   
    methods: {
      open () {
        this.showed = true
      },
      close () {
        this.showed = false
      },
      check_pw (pw) {
        return this.form.values.password === pw
      },
      async register (platform_id) {
        let payload = {
            ...this.form.values
        }
        let process = this.processes.register
        process.in_progress = true
        process.platform_id = platform_id
        const response = await this.api.register_b2b(payload)
        if (response.status === 200) {
          this.$q.notify({
            type: 'positive',
            message: 'Account created – please check your email for more details!'
          })
          process.in_progress = false
          this.close()
          return
        }
        process.in_progress = false
        process.error = response.data.error
      }
    }
  }
</script>
  