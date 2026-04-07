<template>
    <q-layout>
      <q-page-container>
        <q-page>
          <div class="column window-height backgound-profile">
            <div class="row justify-center">
              <div class="col-12 col-sm-12 col-md-12 col-lg-12 div-thank-you">
                <q-card class="card-thank-you row justify-center">
                  <div class="q-my-auto">
                    <div class="col-12 row justify-center text-center">
                        <div class="text-h3 text-bold q-pb-lg">
                            Thank You For Creating Your VNAmazing Profile
                        </div>
                        <div class="col-8 text-h5 q-pt-xl q-pb-lg">
                            You now have access to our digital marketplace and the opportunity to earn more revenue with your business. Add your safaris & adventure tours, request a publication and go online within a few hours
                        </div>
                        <div class="col-12 text-h5 q-pt-xl row justify-center">
                            <div class="col-3">
                                <q-btn label="Start adding your safaris & adventure tours" @click="handle_click()" type="submit" class="full-width text-capitalize btn-thank-you" unelevated />
                            </div>
                        </div>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  <script>
  import {reactive, ref} from 'vue'
  import {useRouter, useRoute} from "vue-router"
  import {use_api} from 'src/composibles/api'
  import {useStore} from 'vuex'

  export default {
      components:{
      },
      data () {
        return {
        }
      },
      setup () {
        const router = useRouter()

        return {
            router
        }
      },
      methods: {
        handle_click() {
            this.router.push('/auth')
        }
      }
  }
  </script>
