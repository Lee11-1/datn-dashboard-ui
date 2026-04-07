<template>
    <q-dialog v-model="showed" persistent>
      <q-card style="width: 700px; max-width: 99vw;">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">Update User</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn dense flat round icon="close" @click="toggle"/>
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-card-section class="q-pa-none">
          <user-form v-model="form_data"
                          :isUpdate="true"
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
          <q-btn @click="update"
                 :loading="process.in_progress"
                 color="primary" label="Submit"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  <script>
  import {ref, reactive} from 'vue'
  import {useQuasar} from 'quasar'
  
  import {use_api} from 'src/composibles/api'
  
  import UserForm from '../form'
  
  export default {
    components: {
        UserForm
    },
    props: {
      
    },
    setup (props, context) {
      const api = use_api()
      const $q = useQuasar()
      const showed = ref(false)
      const form = ref(null)
      const form_data = ref({})
      const process = reactive({
        in_progress: false,
        error: null,
        error_message: null
      })
  
  
      const toggle = (data) => {
        if (showed.value) {
          // closing logic
          form_data.value = {}
        } else {
          form_data.value = data
        }
        showed.value = !showed.value
      }
  
      const update = async () => {
        process.in_progress = true
        process.error = null
        let payload = {
          ...form_data.value,
          b2b_user_id: form_data.value.id
        }
        const response = await api.update_user(payload)
        console.log('update user response', response)
        if (response.status === 200) {
          context.emit('updated', response.data.data)
          $q.notify({
            type: 'positive',
            message: 'User updated!'
          })
          toggle()
        } else {
          $q.notify({
            type: 'negative',
            message: response.data.message || 'Server Error'
          })
        }
        process.in_progress = false
      }
  
      return {
        showed,
        form,
        form_data,
        process,
        toggle,
        update
      }
    }
  }
  </script>
  