<template>
    <q-dialog v-model="showed_diaglog" persistent>
      <q-card style="width: 500px; max-width: 90vw" v-if="showed_diaglog">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6 text-center">Forgot Password</q-item-label>
          </q-item-section>
          <q-item-section avatar v-if="!processes.forget.in_progress">
            <q-item-label>
              <q-btn flat round dense icon="close" @click="close"/>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-card-section class="q-pt-xl">
          <div class="row q-row-gutter-xl">
            <q-form @submit="forget" class="col-12" greedy>
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
                <div class="col-12 q-pt-none"
                      v-if="processes.forget.error">
                  <q-chip outline color="red" square size="sm">
                    {{ processes.forget.error }}
                  </q-chip>
                </div>
                <div class="col-12 q-px-lg">
                  <q-btn label="Submit" type="submit" class="full-width" unelevated
                          style="background-color: #E622B3; color: white"
                          :loading="processes.forget.in_progress"
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
        showed_diaglog: false,
        processes: {
          forget: {
            in_progress: false,
            platform_id: null,
            error: null,
          }
        },
        form: {
          values: {
            email: '',
          },
          rules: {
            text: [
              v => (!!v && !!v.trim()) || 'Required!'
            ]
          }
        },
        api: use_api()
      }
    },
    methods: {
      open () {
        this.showed_diaglog = true
      },
      close () {
        this.showed_diaglog = false
      },
      async forget (platform_id) {
        let payload = {
            ...this.form.values
        }
        let process = this.processes.forget
        process.in_progress = true
        process.platform_id = platform_id
        const response = await this.api.forget_b2b(payload)
        if (response.status === 200) {
          this.$q.notify({
            type: 'positive',
            message: 'Password has been sent to your email. Please check!'
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
  