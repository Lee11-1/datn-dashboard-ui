<template>
  <div class="row">
    <div class="col-12">
      <div class="q-mb-md">
        <q-input 
          v-model="filters.value.search_text"
          outlined
          dense
          placeholder="Search schedules..."
          @update:model-value="handle_search_changed"
          clearable>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-table
        :columns="columns"
        :rows="records"
        v-model:pagination="pagination"
        @request="handle_pagination_changed"
        :loading="processes.listing.in_progress"
        binary-state-sort
        row-key="id">
        <template v-slot:body="props">
          <q-tr :props="props" :class="props.row.index % 2 ? 'bg-grey-2': ''">
            <q-td key="createdAt" :props="props">
              <datetime :modelValue="props.row.createdAt" :expect_format="'MMM D, YYYY'" />
            </q-td>
            <q-td key="title" :props="props">
              <span>{{ props.row.title }}</span>
            </q-td>
            <q-td key="startDate" :props="props">
              <datetime :modelValue="props.row.startDate" :expect_format="'MMM D, YYYY HH:mm'" />
            </q-td>
            <q-td key="endDate" :props="props">
              <datetime :modelValue="props.row.endDate" :expect_format="'MMM D, YYYY HH:mm'" />
            </q-td>
            <q-td key="status" :props="props">
              <q-chip dense :label="props.row.status" size="sm" 
                      :color="getStatusColor(props.row.status)" text-color="white" />
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn dense round flat icon="edit" color="grey"
                     @click="$refs.detail_dialog.toggle(props.row)"
                     />
              <q-btn dense flat round icon="delete" color="grey"
                @click="delete_schedule(props.row)"
                />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
  <update-schedule ref="detail_dialog"
                   @updated="val => handle_updated(val)" />
</template>
<script>
import {ref, reactive, computed} from 'vue'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'

import debounce from 'lodash/debounce'
import {use_api} from 'src/composibles/api'

import Datetime from 'src/components/common/datetime'
import UpdateSchedule from '../dialog/update'

export default {
  components: {
    Datetime,
    UpdateSchedule
  },
  props: {
    
  },
  created () {
    this.list_records()
  },
  setup (props, context) {
    const api = use_api()
    const $q = useQuasar()
    const router = useRouter()

    const statusOptions = [
      { label: 'Planned', value: 'planned' },
      { label: 'Ongoing', value: 'ongoing' },
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' }
    ]

    const records = ref([])

    const columns = computed(() => {
      let result = [
        {
          name: 'createdAt',
          field: 'createdAt',
          label: 'Created Date',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'title',
          field: 'title',
          label: 'Title',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'startDate',
          field: 'startDate',
          label: 'Start Date',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'endDate',
          field: 'endDate',
          label: 'End Date',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'status',
          field: 'status',
          label: 'Status',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'actions',
          label: 'Actions',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        }
      ]
      return result
    })

    const pagination = ref({
      sortBy: 'createdAt',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    })

    const filters = reactive({
      value: {
        search_text: ''
      }
    })

    const processes = reactive({
      listing: {
        in_progress: false
      }
    })

    const list_records = async (props = null) => {
      if (!props) {
        props = {
          pagination: pagination.value
        }
      }
      processes.listing.in_progress = true
      try {
        const { page, rowsPerPage, sortBy, descending } = props.pagination
        const payload = {
          page: page,
          limit: rowsPerPage,
          sorts: sortBy,
          search_text: filters.value.search_text
        }
        const response = await api.list_schedules(payload)
        if (response.status === 200 && response.data.success) {
          records.value = response.data.data || []
          pagination.value.rowsNumber = response.data.pagination?.total || 0
          pagination.value.page = page
          pagination.value.rowsPerPage = rowsPerPage
          pagination.value.sortBy = sortBy
          pagination.value.descending = descending
        }
      } catch (error) {
        console.error('Error loading schedules:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to load schedules'
        })
      }
      processes.listing.in_progress = false
    }

    const handle_pagination_changed = (props) => {
      list_records(props)
    }

    const handle_search_changed = debounce(() => {
      pagination.value.page = 1
      list_records()
    }, 500)

    const handle_updated = () => {
      list_records()
    }

    const delete_schedule = async (row) => {
      $q.dialog({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete schedule "${row.title}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        processes.listing.in_progress = true
        try {
          const response = await api.delete_schedule({ id: row.id })
          if (response.status === 200) {
            $q.notify({
              type: 'positive',
              message: 'Schedule deleted!'
            })
            list_records()
          } else {
            $q.notify({
              type: 'negative',
              message: response.message || 'Failed to delete schedule'
            })
          }
        } catch (error) {
          console.error('Error deleting schedule:', error)
          $q.notify({
            type: 'negative',
            message: 'Error deleting schedule'
          })
        }
        processes.listing.in_progress = false
      })
    }

    const getStatusColor = (status) => {
      const colors = {
        'planned': 'orange',
        'ongoing': 'blue',
        'completed': 'green',
        'cancelled': 'red'
      }
      return colors[status] || 'grey'
    }

    return {
      records,
      columns,
      pagination,
      filters,
      processes,
      statusOptions,
      list_records,
      handle_pagination_changed,
      handle_search_changed,
      handle_updated,
      delete_schedule,
      getStatusColor,
    }
  }
}
</script>
