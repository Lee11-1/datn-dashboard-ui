<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-pb-md justify-between">
      <div class="text-h6 q-pr-sm">
        Customer
      </div>
      <q-btn color="primary" 
             label="Create" 
             icon="add"
             @click="$refs.create_dialog.toggle()"
             style="margin-right: 10px" />
    </div>
    <customer-table ref="table" />
  </q-page>
  <create-customer ref="create_dialog"
                   @updated="val => handle_customer_updated(val)" />
  <update-customer ref="update_dialog"
                   @updated="val => handle_customer_updated(val)" />
</template>
<script>
import {ref} from 'vue'

import CustomerTable from 'components/customer/table'
import CreateCustomer from 'components/customer/dialog/create'
import UpdateCustomer from 'components/customer/dialog/update'

export default {
  components: {
    CustomerTable,
    CreateCustomer,
    UpdateCustomer
  },
  setup () {
    const table = ref(null)
    const create_dialog = ref(null)
    const update_dialog = ref(null)

    const handle_customer_updated = (val) => {
      if (table.value) {
        table.value.list_records()
      }
    }

    return {
      table,
      create_dialog,
      update_dialog,
      handle_customer_updated,
    }
  }
}
</script>
