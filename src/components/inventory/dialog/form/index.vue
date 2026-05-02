<template>
    <q-form v-model="form_data.valid" greedy
            ref="form"
            class="row q-col-gutter-sm q-pa-md">
      <div class="col-12 row q-col-gutter-sm">
        <div class="col-12">
            <div class="tour-detail-title">Product</div>
            <q-select v-model="form_data.values.productId"
                   dense outlined
                   emit-value
                   map-options
                   clearable
                   use-input
                   @filter="handle_product_filter"
                   :loading="productLoading"
                   :options="productOptions"
                   option-value="id"
                   option-label="name"
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Warehouse</div>
            <q-select v-model="form_data.values.warehouseId"
                   dense outlined
                   emit-value
                   map-options
                   clearable
                   use-input
                   @filter="handle_warehouse_filter"
                   :loading="warehouseLoading"
                   :options="warehouseOptions"
                   option-value="id"
                   option-label="name"
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Quantity</div>
            <q-input v-model.number="form_data.values.quantity"
                   dense type="number" outlined
                   placeholder="Total quantity"
                   :rules="form_data.rules.required"
                   min="0" />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Reserved Quantity</div>
            <q-input v-model.number="form_data.values.reservedQty"
                   dense type="number" outlined
                   placeholder="Reserved quantity"
                   min="0" />
        </div>
      </div>
    </q-form>
  </template>
  <script>
  import {reactive, ref, watch, computed, onMounted} from 'vue'
  import {useQuasar} from 'quasar'
  import debounce from 'lodash/debounce'
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
      const allProducts = ref([])
      const allWarehouses = ref([])
      const productLoading = ref(false)
      const warehouseLoading = ref(false)

      const init_form_values = () => {
        let form = object_assign({
            id: null,
            productId: null,
            warehouseId: null,
            quantity: 0,
            reservedQty: 0,
        }, props.modelValue)
        return form
    }

      const productOptions = computed(() => {
        return allProducts.value
      })

      const warehouseOptions = computed(() => {
        return allWarehouses.value
      })

      const search_products = async (search_text = '') => {
        productLoading.value = true
        try {
          const payload = {
            search_text: search_text,
            page: '1',
            limit: '25',
            sorts: '-'
          }
          const response = await api.list_products(payload)
          if (response.status === 200 && response.data.success) {
            allProducts.value = response.data.data || []
          }
        } catch (error) {
          console.error('Error loading products:', error)
        } finally {
          productLoading.value = false
        }
      }

      const search_warehouses = async (search_text = '') => {
        warehouseLoading.value = true
        try {
          const payload = {
            search_text: search_text,
            page: '1',
            limit: '25',
            sorts: '-'
          }
          const response = await api.list_warehouses(payload)
          if (response.status === 200 && response.data.success) {
            allWarehouses.value = response.data.data || []
          }
        } catch (error) {
          console.error('Error loading warehouses:', error)
        } finally {
          warehouseLoading.value = false
        }
      }

      const handle_product_filter = debounce((val, update) => {
        search_products(val).then(() => {
          update()
        })
      }, 500)

      const handle_warehouse_filter = debounce((val, update) => {
        search_warehouses(val).then(() => {
          update()
        })
      }, 500)

      const load_selected_items = async () => {
        if (props.isUpdate && props.modelValue) {
          try {
            const payload = {
              search_text: '',
              page: '1',
              limit: '25',
              sorts: '-'
            }
            const [productsRes, warehousesRes] = await Promise.all([
              api.list_products(payload),
              api.list_warehouses(payload)
            ])
            if (productsRes.status === 200 && productsRes.data.success) {
              allProducts.value = productsRes.data.data || []
            }
            if (warehousesRes.status === 200 && warehousesRes.data.success) {
              allWarehouses.value = warehousesRes.data.data || []
            }
          } catch (error) {
            console.error('Error loading items:', error)
          }
        }
      }
  
      const form_data = reactive({
        valid: false,
        values: init_form_values(),
        rules: {
          required: [
            v => (!!v && v !== null && v !== '') || 'Required'
          ]
        }
      })
  
      watch(
          form_data.values,
          (result) => {
            context.emit('update:modelValue', result)
          },
          { deep: true }
      )

      onMounted(() => {
        load_selected_items()
      })
  
      return {
        showed,
        form_data,
        form,
        productOptions,
        warehouseOptions,
        productLoading,
        warehouseLoading,
        handle_product_filter,
        handle_warehouse_filter,
      }
    }
  }
  </script>
