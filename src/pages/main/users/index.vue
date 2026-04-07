<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-pb-md justify-between">
      <div class="text-h6 q-pr-sm">
        Users
      </div>
      <q-btn color="primary" 
             label="Create User" 
             icon="add"
             @click="$refs.detail_dialog.toggle()"
             style="margin-right: 10px" />
    </div>
    <user-table ref="table" />
  </q-page>
  <create-user ref="detail_dialog"
               @updated="val => handle_user_created(val)" />
</template>
<script>
import {ref} from 'vue'

import UserTable from 'components/user/table'
import CreateUser from 'components/user/dialog/create'

export default {
  components: {
    UserTable,
    CreateUser
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
