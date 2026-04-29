<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-pb-md justify-between">
      <div class="text-h6 q-pr-sm">
        Schedules
      </div>
      <q-btn color="primary" 
             label="Create" 
             icon="add"
             @click="$refs.detail_dialog.toggle()"
             style="margin-right: 10px" />
    </div>
    <schedule-table ref="table" />
  </q-page>
  <create-schedule ref="detail_dialog"
                   @updated="val => handle_schedule_created(val)" />
</template>
<script>
import {ref} from 'vue'

import ScheduleTable from 'components/schedule/table'
import CreateSchedule from 'components/schedule/dialog/create'

export default {
  components: {
    ScheduleTable,
    CreateSchedule
  },
  setup () {
    const table = ref(null)

    const handle_schedule_created = (val) => {
      if (table.value) {
        table.value.list_records()
      }
    }

    return {
      table,
      handle_schedule_created,
    }
  }
}
</script>
