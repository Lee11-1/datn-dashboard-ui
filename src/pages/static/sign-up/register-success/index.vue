<template>
    <q-dialog v-model="showed">
      <q-card style="width: 500px; max-width: 90vw" v-if="showed">
        <div class="column col-12 window-height-sign-up backgound-welcome">
            <div class="col-5 column">
                <div class="col-4 header-bg-welcome row justify-center q-my-auto">
                    <q-item class="item-welcome">
                        <q-item-section>
                            <q-item-label class="text-h5 text-center text-bold">{{ title_welcome }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </div>
                <div class="col-8 row justify-center q-my-auto">
                    <q-item class="subitem-welcome">
                        <q-item-section>
                            <q-item-label class="text-h6 subtitle-bg-welcome text-center text-bold q-pa-md">{{ subtitle_welcome }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </div>
            </div>
            <div class="col-4 title-bg-welcome q-py-sm q-px-md">
                <div class="col-12 row title-des q-pb-xl">{{ description }}</div>
                <div class="col-12 row justify-center">
                    <div class="col-4">
                        <q-btn label="Close" @click="close" class="full-width text-capitalize btn-sign-up" unelevated />
                    </div>
                </div>
            </div>
            <div class="col-1"></div>
        </div>
      </q-card>
      <b2b-register-dialog ref="b2b_register_dialog"
                           @registered="handle_registered"/>
    </q-dialog>
  </template>
<script>
import B2bRegisterDialog from 'src/pages/static/sign-up/create-account'
export default {
    components:{
        B2bRegisterDialog
    },
    data () {
      return {
        showed: false,
        title_welcome: 'More Revenue for Your Safari & Tour Business',
        subtitle_welcome: 'Reach 400+ million Shoppers',
        description: 'You was register new account successfully, pls go to email to active your account',
      }
    },
   
    methods: {
      open () {
        this.showed = true
      },
      close () {
        this.showed = false
      },
      handle_registered () {
        this.close()
      }
    }
  }
</script>
  