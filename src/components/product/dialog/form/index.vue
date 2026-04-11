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
        <div class="col-12">
            <div class="tour-detail-title">Product Images </div>
            <div class="file-input-wrapper">
              <input type="file" 
                     ref="fileInput"
                     @change.stop.prevent="onFileSelected"
                     multiple
                     accept=".jpg,.jpeg,.png,.gif"
                     class="file-input-hidden" />
              <button type="button" @click.prevent="openFileDialog" class="file-input-button">
                <q-icon name="image" size="20px" class="q-mr-sm" />
                Choose Files
              </button>
            </div>
            <div class="row q-col-gutter-sm q-mt-md">
              <div v-for="(image, index) in form_data.values.images" :key="index" class="col-4">
                <div class="image-preview-container" @mouseenter="hoveredImageIndex = index" @mouseleave="hoveredImageIndex = null">
                  <img :src="image" style="width: 100%; height: 100%; object-fit: cover;" />
                  <q-btn v-if="hoveredImageIndex === index" 
                         dense flat round color="white" 
                         icon="close"
                         @click="deleteImage(index)"
                         class="delete-btn"
                         style="background-color: rgba(0, 0, 0, 0.6);" />
                </div>
              </div>
            </div>
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
      const fileInput = ref(null)
      const showed = ref(false)
      const allCategories = ref([])
      const selectedFiles = ref([])
      const hoveredImageIndex = ref(null)
      const isUploading = ref(false)

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

      const selectedFileNames = computed(() => {
        if (selectedFiles.value.length === 0) {
          return 'No file chosen'
        }
        return selectedFiles.value.map(f => f.name).join(', ')
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

      const onFileRejected = (rejectedEntries) => {
        $q.notify({
          type: 'negative',
          message: 'File rejected. Max 5MB each, only jpg/jpeg/png/gif'
        })
      }

      const openFileDialog = () => {
        if (fileInput.value) {
          fileInput.value.click()
        }
      }

      const onFileSelected = (event) => {
        const files = event.target.files
        if (files && files.length > 0) {
          // Append new files to selectedFiles
          for (let file of files) {
            selectedFiles.value.push(file)
            
            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
              form_data.values.images.push(e.target.result)
            }
            reader.readAsDataURL(file)
          }
          
          // Reset file input
          fileInput.value.value = ''
        }
      }

      const deleteImage = (index) => {
        form_data.values.images.splice(index, 1)
        if (selectedFiles.value && selectedFiles.value.length > index) {
          selectedFiles.value.splice(index, 1)
        }
      }

      const uploadFiles = async () => {
        if (selectedFiles.value.length === 0) {
          return true
        }
        
        try {
          isUploading.value = true
          const formData = new FormData()
          formData.append('folder_name', 'products')
          
          for (let file of selectedFiles.value) {
            formData.append('files', file)
          }

          const response = await api.upload_files(formData)
          const data = response.data.data

          if ((response.status === 201) && data && data.uploadedFiles && data.uploadedFiles.length > 0) {
            // Keep existing AWS URLs and append new uploaded URLs
            const existingAwsUrls = form_data.values.images.filter(img => img.startsWith('http'))
            const newUploadedUrls = data.uploadedFiles.map(f => f.url)
            form_data.values.images = [...existingAwsUrls, ...newUploadedUrls]

            selectedFiles.value = []
            $q.notify({
              type: 'positive',
              message: data.uploadedFiles.length + ' image(s) uploaded successfully!'
            })
            return true
          } else {
            $q.notify({
              type: 'negative',
              message: response.message || 'Upload failed'
            })
            return false
          }
        } catch (error) {
          console.error('Upload error:', error)
          $q.notify({
            type: 'negative',
            message: 'Upload error: ' + error.message
          })
          return false
        } finally {
          isUploading.value = false
        }
      }
  
      return {
        showed,
        form_data,
        form,
        fileInput,
        toggle,
        categoryOptions,
        selectedFiles,
        selectedFileNames,
        uploadFiles,
        onFileRejected,
        onFileSelected,
        openFileDialog,
        hoveredImageIndex,
        isUploading,
        deleteImage,
      }
    }
  }
  </script>

<style scoped>
.image-preview-container {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  background: #f5f5f5;
  cursor: pointer;
}

.delete-btn {
  position: absolute !important;
  top: 4px;
  right: 4px;
  transform: scale(1);
  transition: all 0.2s ease-in-out;
}

.delete-btn:hover {
  transform: scale(1.15);
}

.file-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-input-hidden {
  display: none;
}

.file-input-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border: 2px solid #1976d2;
  background-color: white;
  color: #1976d2;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.file-input-button:hover {
  background-color: #f0f7ff;
  border-color: #1565c0;
  color: #1565c0;
}

.file-input-button:active {
  background-color: #1976d2;
  color: white;
  transform: scale(0.98);
}

.file-input-display {
  padding: 10px 12px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #666;
  font-size: 13px;
  word-break: break-word;
  min-height: 30px;
  display: flex;
  align-items: center;
}
</style>
