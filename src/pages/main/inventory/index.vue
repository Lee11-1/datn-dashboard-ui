<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-pb-md justify-between">
      <div class="text-h6 q-pr-sm">
        Inventory
      </div>
      <q-btn color="primary" 
             label="Create" 
             icon="add"
             @click="$refs.create_dialog.toggle()"
             style="margin-right: 10px" />
    </div>
    <inventory-table ref="table" />
  </q-page>
  <create-inventory ref="create_dialog"
                   @updated="val => handle_inventory_updated(val)" />
  <update-inventory ref="update_dialog"
                   @updated="val => handle_inventory_updated(val)" />
</template>
<script>
import {ref} from 'vue'

import InventoryTable from 'components/inventory/table'
import CreateInventory from 'components/inventory/dialog/create'
import UpdateInventory from 'components/inventory/dialog/update'

export default {
  components: {
    InventoryTable,
    CreateInventory,
    UpdateInventory
  },
  setup () {
    const table = ref(null)
    const create_dialog = ref(null)
    const update_dialog = ref(null)

    const handle_inventory_updated = (val) => {
      if (table.value) {
        table.value.list_records()
      }
    }

    return {
      table,
      create_dialog,
      update_dialog,
      handle_inventory_updated,
    }
  }
}
</script>
