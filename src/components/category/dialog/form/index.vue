<template>
    <q-form v-model="form_data.valid" greedy
            ref="form"
            class="row q-col-gutter-sm q-pa-md">
      <div class="col-12 row q-col-gutter-sm">
        <div class="col-12">
            <div class="tour-detail-title">Category Name</div>
            <q-input v-model="form_data.values.name"
                   dense type="text" outlined
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Slug</div>
            <q-input v-model="form_data.values.slug"
                   dense type="text" outlined
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Parent Category</div>
            <q-select v-model="form_data.values.parentId"
                   dense outlined
                   emit-value
                   map-options
                   clearable
                   :options="parentOptions"
                   option-value="id"
                   option-label="name" />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Sort Order</div>
            <q-input v-model.number="form_data.values.sortOrder"
                   dense type="number" outlined />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Active</div>
            <q-toggle v-model="form_data.values.isActive"
                   checked-icon="check"
                   unchecked-icon="clear"
                   color="green" />
        </div>
        <div class="col-12 q-pt-md">
          <q-btn color="primary" label="Save" @click="save_category" :loading="process.in_progress" class="full-width" />
        </div>
        <div class="col-12" v-if="process.error">
          <q-item dark class="bg-negative">
            <q-item-section side>
              <q-icon name="error"/>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ process.error_message || 'An error occurred' }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-form>
  </template>
  <script>
  import {reactive, ref, watch, computed} from 'vue'
  import {useQuasar} from 'quasar'
  import { object_assign } from 'src/utils'
  import {use_api} from 'src/composibles/api'
  
  export default {
    props: {
      modelValue: {type: Object, required: true},
      parentCategories: {type: Array, default: () => []},
    },
    setup (props, context) {
      const api = use_api()
      const $q = useQuasar()
      const form = ref(null)
      const process = reactive({
        in_progress: false,
        error: null,
        error_message: null
      })

      const init_form_values = () => {
        let form = object_assign({
            id: null,
            name: null,
            slug: null,
            parentId: null,
            sortOrder: 0,
            isActive: true,
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

      const parentOptions = computed(() => {
        // Filter out the current category and its children
        return props.parentCategories.filter(cat => cat.id !== props.modelValue.id)
      })
  
      watch(
          () => props.modelValue,
          (newVal) => {
            if (newVal) {
              form_data.values = init_form_values()
            }
          },
          { deep: true }
      )
  
      const save_category = async () => {
        process.in_progress = true
        process.error = null
        let payload = {
          ...form_data.values,
          category_id: form_data.values.id
        }
        const response = await api.update_category(payload)
        console.log('update category response', response)
        if (response.success) {
          context.emit('updated', response.data)
          $q.notify({
            type: 'positive',
            message: 'Category updated!'
          })
        } else {
          process.error_message = response.message || 'Server Error'
          $q.notify({
            type: 'negative',
            message: response.message || 'Server Error'
          })
        }
        process.in_progress = false
      }
  
      return {
        form_data,
        form,
        process,
        parentOptions,
        save_category,
      }
    }
  }
  </script>
