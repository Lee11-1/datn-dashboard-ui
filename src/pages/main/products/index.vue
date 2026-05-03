<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>

  <template v-if="is_products_page">
    <q-page class="q-pa-lg">
      <div class="row items-center q-pb-md justify-between">
        <div class="text-h6 q-pr-sm">
          Product
        </div>
        <q-btn color="primary" 
               label="Create" 
               icon="add"
               @click="$refs.detail_dialog.toggle()"
               style="margin-right: 10px" />
      </div>
      <product-table ref="table" />
    </q-page>
    <create-product ref="detail_dialog"
                 @updated="val => handle_product_created(val)" />
  </template>
</template>
<script>
import {ref, computed} from 'vue'
import {useRoute} from 'vue-router'

import ProductTable from 'components/product/table'
import CreateProduct from 'components/product/dialog/create'

export default {
  components: {
    ProductTable,
    CreateProduct
  },
  setup () {
    const route = useRoute()
    const table = ref(null)

    const is_products_page = computed(() => {
      return route.name === 'main.products'
    })

    const handle_user_created = () => {
      if (table.value) {
        table.value.list_records()
      }
    }

    const handle_product_created = (val) => {
      if (table.value) {
        table.value.list_records()
      }
    }

    return {
      table,
      is_products_page,
      handle_user_created,
      handle_product_created,
    }
  }
}
</script>
