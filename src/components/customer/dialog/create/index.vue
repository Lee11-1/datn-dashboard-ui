<template>
    <q-dialog v-model="showed" persistent>
      <q-card style="width: 1500px; max-width: 99vw;">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">Create Customer</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn dense flat round icon="close" @click="toggle"/>
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-card-section class="q-pa-none">
          <customer-form v-model="form_data"
                        :isUpdate="false"
                        ref="form"/>
        </q-card-section>
        <q-card-section v-if="process.error">
          <q-item dark class="bg-negative">
            <q-item-section side>
              <q-icon name="error"/>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ process.error }}</q-item-label>
              <q-item-label class="text-weight-bold">
                {{ process.error_message || 'Ops! Something wrong happened.' }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" flat @click="toggle"/>
          <q-btn @click="create"
                 :loading="process.in_progress"
                 color="primary" label="Submit"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  <script>
  import {ref, reactive} from 'vue'
  import {useQuasar} from 'quasar'
  import {useStore} from 'vuex'
  import {use_api} from 'src/composibles/api'
  
  import CustomerForm from '../form'
  
  export default {
    components: {
        CustomerForm
    },
    props: {
      
    },
    setup (props, context) {
      const api = use_api()
      const $q = useQuasar()
      const showed = ref(false)
      const form = ref(null)
      const form_data = ref({})
      const store = useStore()

      const process = reactive({
        in_progress: false,
        error: null,
        error_message: null
      })
  
      const toggle = () => {
        if (showed.value) {
          form_data.value = {}
        }
        showed.value = !showed.value
      }
  
      const create = async () => {
        process.in_progress = true
        process.error = null
        const payload = {
          ...form_data.value,
          createdBy: store.state.Auth.user.id
        }
        const response = await api.create_customer(payload)
        console.log('create customer response', response)
        if (response.status === 201) {
          context.emit('updated', response.data)
          $q.notify({
            type: 'positive',
            message: 'Customer created!'
          })
          toggle()
        } else {
          $q.notify({
            type: 'negative',
            message: response.message || 'Server Error'
          })
        }
        process.in_progress = false
      }

      return {
        showed,
        form_data,
        form,
        process,
        toggle,
        create,
      }
    }
  }
  </script>
