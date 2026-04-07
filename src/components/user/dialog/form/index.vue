<template>
    <q-form v-model="form_data.valid" greedy
            ref="form"
            class="row q-col-gutter-sm q-pa-md">
      <div class="col-12 row q-col-gutter-sm">
        <div class="col-12">
            <div class="tour-detail-title">Email</div>
            <q-input v-model="form_data.values.email"
                   dense type="email" :disable="isUpdate" outlined
                   :rules="!isUpdate ? form_data.rules.required : []" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Username</div>
            <q-input v-model="form_data.values.username"
                   dense type="text" outlined
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Full Name</div>
            <q-input v-model="form_data.values.fullName"
                   dense type="text" outlined
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Phone Number</div>
            <q-input v-model="form_data.values.phone"
                   dense type="text" outlined />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Role</div>
            <q-select v-model="form_data.values.role"
                   dense outlined
                   :options="['admin', 'manager', 'sale']"
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Status</div>
            <q-select v-model="form_data.values.status"
                   dense outlined
                   :options="['active', 'inactive', 'suspended']"
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Avatar URL</div>
            <q-input v-model="form_data.values.avatarUrl"
                   dense type="text" outlined />
        </div>
      </div>
    </q-form>
  </template>
  <script>
  import {reactive, ref, watch} from 'vue'
  import {useQuasar} from 'quasar'
  import { object_assign } from 'src/utils'
  
  export default {
    props: {
      modelValue: {type: Object, required: true},
      isUpdate: {type: Boolean, default: false},
    },
    setup (props, context) {
      const $q = useQuasar()
      const form = ref(null)
      const showed = ref(false)
      const default_image = require('src/assets/images/default_image.png')
  
      const init_form_values = () => {
        let form = object_assign({
            id: null,
            email: null,
            username: null,
            fullName: null,
            phone: null,
            role: 'sale',
            status: 'active',
            avatarUrl: null,
        }, props.modelValue)
        return form
    }
  
      const form_data = reactive({
        valid: false,
        values: init_form_values(),
        rules: {
          required: [
            v => (!!v) || 'Required'
          ]
        }
      })
  
    //   const check_date = () => {
    //     let from_date = form_data.values.from_date
    //     let to_date = form_data.values.to_date
        
    //     if (to_date && from_date) {
    //       to_date = moment(to_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
    //       from_date = moment(from_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
  
    //       if (from_date > to_date) {
    //         return false
    //       }
    //     }
    //     return true
    //   }
  
    //   const validate = () => {
    //     if (!check_date()) {
    //       $q.notify({
    //         type: 'negative',
    //         message: 'Date range invalid'
    //       })
    //       return
    //     }
    //     if (form_data.values.meta_price.every(element => !element)) {
    //       $q.notify({
    //         type: 'negative',
    //         message: 'Need at least 1 price fields'
    //       })
    //       return
    //     }
    //     return form.value.validate()
    //   }
  
      watch(
          form_data.values,
          (result) => {
            context.emit('update:modelValue', result)
          }
      )
  
      const toggle = () => {
        if (showed.value) {
          // closing logic
          form_data.value = {}
        }
        showed.value = !showed.value
      }
  
      return {
        showed,
        form_data,
        form,
        // validate,
        toggle,
      }
    }
  }
  </script>
  