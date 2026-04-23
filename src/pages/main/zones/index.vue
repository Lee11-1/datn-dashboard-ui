<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-pb-md justify-between">
      <div class="text-h6 q-pr-sm">
        Zone
      </div>
      <q-btn color="primary" 
             label="Create" 
             icon="add"
             @click="$refs.create_dialog.toggle()"
             style="margin-right: 10px" />
    </div>
    <zone-table ref="table" />
  </q-page>
  <create-zone ref="create_dialog"
                   @updated="val => handle_zone_updated(val)" />
  <update-zone ref="update_dialog"
                   @updated="val => handle_zone_updated(val)" />
</template>
<script>
import {ref} from 'vue'

import ZoneTable from 'components/zone/table'
import CreateZone from 'components/zone/dialog/create'
import UpdateZone from 'components/zone/dialog/update'

export default {
  components: {
    ZoneTable,
    CreateZone,
    UpdateZone
  },
  setup () {
    const table = ref(null)
    const create_dialog = ref(null)
    const update_dialog = ref(null)

    const handle_zone_updated = (val) => {
      if (table.value) {
        table.value.list_records()
      }
    }

    return {
      table,
      create_dialog,
      update_dialog,
      handle_zone_updated,
    }
  }
}
</script>
