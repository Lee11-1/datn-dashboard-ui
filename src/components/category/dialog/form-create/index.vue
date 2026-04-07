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
                   :options="parentCategories"
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
      parentCategories: {type: Array, default: () => []},
    },
    setup (props, context) {
      const $q = useQuasar()
      const form = ref(null)

      const init_form_values = () => {
        let form = object_assign({
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
  
      watch(
          form_data.values,
          (result) => {
            context.emit('update:modelValue', result)
          }
      )
  
      return {
        form_data,
        form,
      }
    }
  }
  </script>
