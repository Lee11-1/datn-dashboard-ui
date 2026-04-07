<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-pb-md">
      <div class="text-h6 q-pr-sm">
        Users
      </div>
    </div>
    <user-table ref="table" />
  </q-page>
</template>
<script>
import {ref} from 'vue'

import UserTable from 'components/user/table'

export default {
  components: {
    UserTable
  },
  setup () {
    const table = ref(null)

    return {
      table,
    }
  }
}
</script>
