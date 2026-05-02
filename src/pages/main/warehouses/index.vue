<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-pb-md justify-between">
      <div class="text-h6 q-pr-sm">
        Warehouses
      </div>
      <q-btn color="primary" 
             label="Create" 
             icon="add"
             @click="$refs.detail_dialog.toggle()"
             style="margin-right: 10px" />
    </div>
    <warehouse-table ref="table" />
  </q-page>
  <create-warehouse ref="detail_dialog"
                    @updated="val => handle_warehouse_created(val)" />
</template>
<script>
import {ref} from 'vue'

import WarehouseTable from 'components/warehouse/table'
import CreateWarehouse from 'components/warehouse/dialog/create'

export default {
  components: {
    WarehouseTable,
    CreateWarehouse
  },
  setup () {
    const table = ref(null)

    const handle_warehouse_created = (val) => {
      if (table.value) {
        table.value.list_records()
      }
    }

    return {
      table,
      handle_warehouse_created,
    }
  }
}
</script>
