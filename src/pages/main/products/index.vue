<template>
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
<script>
import {ref} from 'vue'

import ProductTable from 'components/product/table'
import CreateProduct from 'components/product/dialog/create'

export default {
  components: {
    ProductTable,
    CreateProduct
  },
  setup () {
    const table = ref(null)

    const handle_user_created = () => {
      if (table.value) {
        table.value.list_records()
      }
    }

    return {
      table,
      handle_user_created,
    }
  }
}
</script>
