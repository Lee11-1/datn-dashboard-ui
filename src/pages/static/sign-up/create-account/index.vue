<template>
    <q-dialog v-model="showed" persistent>
      <q-card class="q-py-md register-dialog" style="width: 650px; max-width: 90vw" v-if="showed">
           <q-btn  icon="close"  flat  round  dense  class="absolute-top-right q-ma-sm" no-caps v-close-popup="2" style="z-index: 1000;"/>
        <q-item>
          <q-item-section>
            <q-item-label class="text-center text-weight-bold sign-up-title">Sign up with Meetings VietNam for free</q-item-label>
          </q-item-section>
        </q-item>
        <q-item style="min-height: 25px;">
          <hr style="width: 100%; margin: 0 10px"/>
        </q-item>
        
        <q-card-section class="q-pt-xl form-sign-up">
          <div class="row q-row-gutter-xl">
            <q-form @submit="register" greedy>
              <div class="row q-col-gutter-sm q-ml-none">
                <div class="col-12 q-px-lg q-py-none sign-up-input">
                  <div class="sign-up-subtitle text-weight-bold q-pb-sm">Name<span class="q-pl-xs txt-required">*</span></div>
                  <q-input
                    outlined
                    v-model="form.values.first_name"
                    :rules="form.rules.text"
                  >
                  </q-input>
                </div>
                <div class="col-12 col-md-7 q-px-lg q-py-none sign-up-input ">
                  <div class="sign-up-subtitle text-weight-bold q-pb-sm ">Email<span class="q-pl-xs txt-required">*</span></div>
                  <q-input
                    outlined
                    v-model="form.values.email"
                    :rules="form.rules.text"
                  >
                  </q-input>
                </div>
                <div class="col-12 col-md-5 q-px-lg q-py-none sign-up-input">
                  <div class="sign-up-subtitle text-weight-bold q-pb-sm ">Phone<span class="q-pl-xs txt-required">*</span></div>
                  <q-input
                    outlined type="number"
                    v-model="form.values.phone"
                    :rules="form.rules.text"
                  >
                  </q-input>
                </div>
                <div class="col-12 col-md-7 q-px-lg q-py-none sign-up-input">
                  <div class="sign-up-subtitle text-weight-bold q-pb-sm ">City / Region<span class="q-pl-xs txt-required">*</span></div>
                  <q-input
                    outlined
                    v-model="form.values.meta.region"
                    :rules="form.rules.text"
                  >
                  </q-input>
                </div>
                <div class="col-12 col-md-5 q-px-lg q-py-none sign-up-input">
                  <div class="sign-up-subtitle text-weight-bold q-pb-sm ">Country<span class="q-pl-xs txt-required">*</span></div>
                  <q-input
                    outlined
                    v-model="form.values.meta.country"
                    :rules="form.rules.text"
                  >
                  </q-input>
                </div>
                <div class="col-12 q-px-lg q-py-none sign-up-input">
                  <div class="sign-up-subtitle text-weight-bold q-pb-sm ">Password<span class="q-pl-xs txt-required">*</span></div>
                  <q-input
                    outlined
                    type="password"
                    v-model="form.values.password"
                    :rules="form.rules.password"
                  >
                  </q-input>
                </div>
                <div class="col-12 q-px-lg q-py-none sign-up-input">
                  <div class="sign-up-subtitle text-weight-bold q-pb-sm ">Confirm Passwords<span class="q-pl-xs txt-required">*</span></div>
                  <q-input
                    outlined type="password"
                    v-model="form.values.confirm_password"
                    :rules="form.rules.confirm_password"
                  >
                  </q-input>
                </div>
                <div class="col-12"
                      v-if="processes.register.error_code">
                  <q-chip outline color="red" square size="sm">
                    {{ processes.register.error_code }}
                  </q-chip>
                </div>
                <div class="col-12 q-px-lg q-pb-md q-pt-none text-weight-bold text-center txt-submitting" style="text-align: left; padding-left: 10px;">
                  By submitting this form you confirm that​ you have read and agree with the <a @click="redirect_terms_conditions('/supplier-term-condition')" style="color:#6FCE66;">Meetings VietNam Supplier T & Cs</a> and <a @click="redirect_terms_conditions('/privacy-policy')" style="color:#6FCE66;">Privacy Policy</a>
                </div>
                <div class="q-mt-md row q-gutter-sm" style="width: 100%; direction: rtl;">
                   <q-btn label="Cancel" class="q-mt-sm register-cancel-btn" unelevated
                            size="17px" no-caps v-close-popup="2"
                            />
                   <q-btn label="Submit" type="submit" unelevated
                        class="q-px-xl button-submit" size="lg" no-caps
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
import cloneDeep from 'lodash/cloneDeep'
import app from 'src/store/app'

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
        default_value: {
          email: '',
          first_name: '',
          password: '',
          confirm_password: '',
          phone: '',
          meta: {
            region: '',
            country: ''
          }
        },
        form: {
          values: {},
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
        this.form.values = cloneDeep(this.default_value || {})
      },
      close () {
        this.showed = false
        this.form.values = cloneDeep(this.default_value || {})
      },
      check_pw (pw) {
        return this.form.values.password === pw
      },
      async register (platform_id) {
        let payload = {
            ...this.form.values
        }

        payload.client_info = window.location.origin

        let process = this.processes.register
        process.in_progress = true
        process.platform_id = platform_id
        const response = await this.api.register_b2b(payload)
        if (response.status === 200 && response.data.status) {
          this.$q.notify({
            type: 'positive',
            message: 'Account created – please check your email for more details!'
          })
          process.in_progress = false
          this.$emit('registered')
          this.close()
          return
        } else {
          this.$q.notify({
            type: 'negative',
            message: response.data.message
          })
        }
        process.in_progress = false
      },
      redirect_terms_conditions(data){
        // let tazoom_link = process.env.FRONTEND_URL
        // if(tazoom_link){
        //   window.location.href = tazoom_link + data
        // }else{
        //   window.location.reload()
        // }
      }
    }
  }
</script>

  