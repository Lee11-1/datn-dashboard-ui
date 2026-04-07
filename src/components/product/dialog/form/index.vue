<template>
    <q-form v-model="form_data.valid" greedy
            ref="form"
            class="row q-col-gutter-sm q-pa-md">
      <div class="col-12 row q-col-gutter-sm">
        <div class="col-12">
            <div class="tour-detail-title">SKU</div>
            <q-input v-model="form_data.values.sku"
                   dense type="text" outlined
                   :disable="isUpdate"
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Product Name</div>
            <q-input v-model="form_data.values.name"
                   dense type="text" outlined
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Description</div>
            <q-input v-model="form_data.values.description"
                   dense type="textarea" outlined />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Price</div>
            <q-input v-model="form_data.values.price"
                   dense type="number" outlined
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Cost Price</div>
            <q-input v-model="form_data.values.costPrice"
                   dense type="number" outlined />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Unit</div>
            <q-input v-model="form_data.values.unit"
                   dense type="text" outlined />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Weight (g)</div>
            <q-input v-model="form_data.values.weightG"
                   dense type="number" outlined />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Category</div>
            <q-select v-model="form_data.values.categoryId"
                   dense outlined
                   emit-value
                   map-options
                   clearable
                   :options="categoryOptions"
                   option-value="id"
                   option-label="name" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Active Status</div>
            <q-toggle v-model="form_data.values.isActive"
                   checked-icon="check"
                   unchecked-icon="clear"
                   color="green" />
        </div>
      </div>
    </q-form>
  </template>
  <script>
  import {reactive, ref, watch, computed, onBeforeMount} from 'vue'
  import {useQuasar} from 'quasar'
  import { object_assign } from 'src/utils'
  import {use_api} from 'src/composibles/api'
  
  export default {
    props: {
      modelValue: {type: Object, required: true},
      isUpdate: {type: Boolean, default: false},
    },
    setup (props, context) {
      const api = use_api()
      const $q = useQuasar()
      const form = ref(null)
      const showed = ref(false)
      const allCategories = ref([])

      const init_form_values = () => {
        let form = object_assign({
            id: null,
            sku: null,
            name: null,
            description: null,
            categoryId: null,
            price: null,
            costPrice: null,
            unit: 'cái',
            weightG: null,
            images: [],
            mongoDetailId: null,
            isActive: true,
        }, props.modelValue)
        return form
    }

      const categoryOptions = computed(() => {
        return allCategories.value
      })

      const list_all_categories = async () => {
        const response = await api.list_categories({})
        if (response.status === 200) {
          allCategories.value = response.data.filter(cat => !cat.children || cat.children.length === 0)
        }
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
  
      const toggle = () => {
        if (showed.value) {
          // closing logic
          form_data.value = {}
        }
        showed.value = !showed.value
      }

      onBeforeMount(() => {
        list_all_categories()
      })
  
      return {
        showed,
        form_data,
        form,
        toggle,
        categoryOptions,
      }
    }
  }
  </script>
