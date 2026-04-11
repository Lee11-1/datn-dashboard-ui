<template>
    <q-dialog v-model="showed" persistent>
      <q-card style="width: 700px; max-width: 99vw;">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">Update Product</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn dense flat round icon="close" @click="toggle"/>
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-card-section class="q-pa-none">
          <product-form v-model="form_data"
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
  
  import ProductForm from '../form'
  
  export default {
    components: {
        ProductForm
    },
    props: {
      
    },
    setup (props, context) {
      const api = use_api()
      const $q = useQuasar()
      const showed = ref(false)
      const form = ref(null)
      const form_data = ref({})
      const originalImages = ref([])
      const process = reactive({
        in_progress: false,
        error: null,
        error_message: null
      })
  
  
      const toggle = (data) => {
        if (showed.value) {
          // closing logic
          form_data.value = {}
          originalImages.value = []
        } else {
          form_data.value = data
          // Save original images for comparison
          originalImages.value = data.images ? [...data.images] : []
        }
        showed.value = !showed.value
      }
  
      const update = async () => {
        process.in_progress = true
        process.error = null
        
        try {
          let newImageUrls = []
          if (form.value.selectedFiles && form.value.selectedFiles.length > 0) {
            const uploadSuccess = await form.value.uploadFiles()
            if (!uploadSuccess) {
              process.in_progress = false
              return
            }
            const currentImages = form.value.form_data.values.images
            newImageUrls = currentImages.filter(img => img.startsWith('http'))
          }
          
          const deletedImages = originalImages.value.filter(img => 
            !form.value.form_data.values.images.includes(img)
          )
          
          if (deletedImages.length > 0) {
            try {
              await api.delete_images({ fileUrls: deletedImages })
            } catch (error) {
              console.error('Error deleting images:', error)
            }
          }
          
          // Step 3: Update product with new images
          let payload = {
            ...form_data.value,
            product_id: form_data.value.id,
            images: form.value.form_data.values.images
          }
          
          const response = await api.update_product(payload)
          console.log('update product response', response)
          const data = response.data.data
          if (response.status === 200 && data) {
            context.emit('updated', data)
            $q.notify({
              type: 'positive',
              message: 'Product updated!'
            })
            toggle()
          } else {
            $q.notify({
              type: 'negative',
              message: response.message || 'Server Error'
            })
          }
        } catch (error) {
          console.error('Update error:', error)
          $q.notify({
            type: 'negative',
            message: 'Update failed: ' + error.message
          })
        } finally {
          process.in_progress = false
        }
      }

      return {
        showed,
        form_data,
        form,
        process,
        toggle,
        update,
      }
    }
  }
  </script>
