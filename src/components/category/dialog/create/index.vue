<template>
    <q-dialog v-model="showed" persistent>
      <q-card style="width: 700px; max-width: 99vw;">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">Create Category</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn dense flat round icon="close" @click="toggle"/>
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-card-section class="q-pa-none">
          <category-create-form v-model="form_data"
                                :parentCategories="parentCategories"
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
  
  import {use_api} from 'src/composibles/api'
  
  import CategoryCreateForm from '../form-create'
  
  export default {
    components: {
        CategoryCreateForm
    },
    props: {
      parentCategories: {type: Array, default: () => []}
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
  
      const toggle = () => {
        if (showed.value) {
          // closing logic
          form_data.value = {}
        }
        showed.value = !showed.value
      }
  
      const create = async () => {
        process.in_progress = true
        process.error = null
        const response = await api.create_category(form_data.value)
        console.log('create category response', response)
        if (response.status === 201) {
          context.emit('created', response.data)
          $q.notify({
            type: 'positive',
            message: 'Category created!'
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
