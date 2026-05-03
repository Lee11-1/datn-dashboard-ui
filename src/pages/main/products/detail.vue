<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-pb-md justify-between">
      <div class="text-h6 q-pr-sm">
        Product Detail
      </div>
      <q-btn color="primary"
             label="Back"
             icon="arrow_back"
             @click="$router.back()"
             flat />
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Product Information</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="product-info">
            <div v-if="product.images && product.images.length > 0" class="image-container">
              <q-img :src="product.images[0]" style="max-height: 300px; object-fit: cover; border-radius: 8px;" />
            </div>
            
            <div class="info-item">
              <div class="info-label">SKU</div>
              <div class="info-value">{{ product.sku || '-' }}</div>
            </div>

            <div class="info-item">
              <div class="info-label">Product Name</div>
              <div class="info-value">{{ product.name || '-' }}</div>
            </div>

            <div class="info-item">
              <div class="info-label">Description</div>
              <div class="info-value">{{ product.description || '-' }}</div>
            </div>

            <q-separator class="q-my-md" />

            <div class="row q-col-gutter-lg">
              <div class="col-6">
                <div class="info-item">
                  <div class="info-label">Price</div>
                  <div class="info-value text-primary text-weight-bold">${{ parseFloat(product.price || 0).toFixed(2) }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="info-item">
                  <div class="info-label">Cost Price</div>
                  <div class="info-value text-weight-bold">${{ parseFloat(product.costPrice || 0).toFixed(2) }}</div>
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-6">
                <div class="info-item">
                  <div class="info-label">Unit</div>
                  <div class="info-value">{{ product.unit || '-' }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="info-item">
                  <div class="info-label">Weight (g)</div>
                  <div class="info-value">{{ product.weightG || '-' }}</div>
                </div>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="info-item">
              <div class="info-label">Status</div>
              <div class="info-value status-value">
                <q-chip :color="product.isActive ? 'positive' : 'negative'"
                        text-color="white"
                        :label="product.isActive ? 'Active' : 'Inactive'"
                        size="sm" />
              </div>
            </div>

            <div class="info-item">
              <div class="info-label">Created Date</div>
              <div class="info-value">{{ formatDate(product.createdAt) }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Product Detail Card -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Additional Details</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <product-detail-form :productId="productId" ref="detail_form" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import {ref, reactive, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import {use_api} from 'src/composibles/api'

import ProductDetailForm from 'components/product/dialog/detail'

export default {
  components: {
    ProductDetailForm
  },
  setup () {
    const route = useRoute()
    const $q = useQuasar()
    const api = use_api()

    const productId = route.params.id
    const product = ref({})
    const detail_form = ref(null)

    const process = reactive({
      loading: false,
      error: null
    })

    const formatDate = (dateStr) => {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const load_product = async () => {
      process.loading = true
      try {
        const response = await api.get_product_by_id(productId)
        if (response.status === 200) {
          const productData = response.data.data || response.data
          product.value = productData
        }
      } catch (error) {
        console.error('Error loading product:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to load product'
        })
      } finally {
        process.loading = false
      }
    }

    onMounted(() => {
      load_product()
    })

    return {
      productId,
      product,
      detail_form,
      process,
      formatDate,
    }
  }
}
</script>