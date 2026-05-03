<template>
    <q-form v-model="form_data.valid" greedy
            ref="form"
            class="row q-col-gutter-sm q-pa-md">
      <div class="col-12 row q-col-gutter-sm">
        <div class="col-12">
            <div class="tour-detail-title">Usage Instructions</div>
            <q-input v-model="form_data.values.usageInstructions"
                   dense type="textarea" outlined
                   placeholder="How to use this product"
                   rows="4" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Components</div>
            <q-input v-model="form_data.values.components"
                   dense type="textarea" outlined
                   placeholder="Product components and materials"
                   rows="4" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Manufacturing Place</div>
            <q-input v-model="form_data.values.manufacturingPlace"
                   dense outlined
                   placeholder="Where is this product manufactured" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Manufacturer Contact</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input v-model="form_data.values.manufacturerContact.name"
                       dense outlined
                       label="Contact Name"
                       placeholder="Manufacturer contact name" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form_data.values.manufacturerContact.phone"
                       dense outlined
                       label="Phone"
                       placeholder="Phone number" />
              </div>
              <div class="col-12">
                <q-input v-model="form_data.values.manufacturerContact.email"
                       dense outlined
                       label="Email"
                       placeholder="Email address"
                       type="email" />
              </div>
              <div class="col-12">
                <q-input v-model="form_data.values.manufacturerContact.address"
                       dense outlined
                       label="Address"
                       placeholder="Contact address"
                       type="textarea"
                       rows="2" />
              </div>
            </div>
        </div>
      </div>
      <div class="col-12 q-gutter-sm">
        <q-linear-progress v-if="process.loading" indeterminate color="primary" />
        <q-item v-if="process.error" dark class="bg-negative">
          <q-item-section side>
            <q-icon name="error"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ process.error }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <div class="col-12 row justify-end q-gutter-sm">
        <q-btn label="Save"
               :loading="process.in_progress"
               color="primary"
               @click="save_detail" />
      </div>
    </q-form>
  </template>
  <script>
  import {reactive, ref, onMounted} from 'vue'
  import {useQuasar} from 'quasar'
  import { use_api } from 'src/composibles/api'
  
  export default {
    props: {
      productId: {type: String, required: true},
    },
    setup (props, context) {
      const form = ref(null)
      const $q = useQuasar()
      const api = use_api()

      const init_form_values = () => {
        return {
          _id: null,
          productId: props.productId,
          usageInstructions: null,
          components: null,
          manufacturingPlace: null,
          manufacturerContact: {
            name: null,
            phone: null,
            email: null,
            address: null
          }
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

      const process = reactive({
        loading: false,
        in_progress: false,
        error: null
      })

      const load_product_detail = async () => {
        process.loading = true
        process.error = null
        try {
          const response = await api.get_product_detail(props.productId)
          if (response.status === 200) {
            const detailData = response.data.data || response.data
            form_data.values = {
              ...init_form_values(),
              ...detailData
            }
          }
        } catch (error) {
          console.error('Error loading product detail:', error)
          process.error = 'Failed to load product details'
        } finally {
          process.loading = false
        }
      }

      const save_detail = async () => {
        process.in_progress = true
        process.error = null

        try {
          const payload = {
            ...form_data.values,
            productId: props.productId
          }

          const response = await api.update_product_detail(payload)

          if (response.status === 200 || response.status === 201) {
            $q.notify({
              type: 'positive',
              message: form_data.values._id ? 'Product detail updated!' : 'Product detail created!'
            })
            const detailData = response.data.data || response.data
            form_data.values = {
              ...form_data.values,
              ...detailData
            }
            context.emit('saved', detailData)
          } else {
            $q.notify({
              type: 'negative',
              message: response.message || 'Server Error'
            })
          }
        } catch (error) {
          console.error('Error saving product detail:', error)
          process.error = 'Failed to save product details'
          $q.notify({
            type: 'negative',
            message: 'Failed to save product details'
          })
        } finally {
          process.in_progress = false
        }
      }

      onMounted(() => {
        load_product_detail()
      })
  
      return {
        form_data,
        form,
        process,
        save_detail,
      }
    }
  }
  </script>
