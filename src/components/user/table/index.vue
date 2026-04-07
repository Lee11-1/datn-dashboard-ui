<template>
  <div class="row">
    <div class="col-12">
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
            <q-td key="username" :props="props">
              <span>{{ props.row.username }}</span>
            </q-td>
            <q-td key="fullName" :props="props">
              <span>{{ props.row.fullName }}</span>
            </q-td>
            <q-td key="email" :props="props">
              <span>{{ props.row.email }}</span>
            </q-td>
            <q-td key="phone" :props="props">
              <span>{{ props.row.phone }}</span>
            </q-td>
            <q-td key="role" :props="props">
              <span>{{ props.row.role }}</span>
            </q-td>
            <q-td key="status" :props="props">
              <span v-if="props.row.status == 'active'" style="color: green">●</span>
              <span v-else style="color: red">●</span>
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn dense round flat icon="edit" color="grey"
                     @click="$refs.detail_dialog.toggle(props.row)"
                     />
              <q-btn dense flat round icon="delete" color="grey"
                @click="delete_user(props.row)"
                />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
  <update-user ref="detail_dialog"
               @updated="val => handle_updated(val)" />
</template>
<script>
import {ref, reactive, computed} from 'vue'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'

import debounce from 'lodash/debounce'
import {use_api} from 'src/composibles/api'

import Datetime from 'src/components/common/datetime'
import UpdateUser from '../dialog/update'

export default {
  components: {
    Datetime,
    UpdateUser
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

    const records = ref([])

    const columns = computed(() => {
      let result = [
        {
          name: 'createdAt',
          field: 'createdAt',
          label: 'Registration Date',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'username',
          field: 'username',
          label: 'Username',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'fullName',
          field: 'fullName',
          label: 'Full Name',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'email',
          field: 'email',
          label: 'Email',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'phone',
          field: 'phone',
          label: 'Phone',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'role',
          field: 'role',
          label: 'Role',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'status',
          field: 'status',
          label: 'Status',
          align: 'center',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 22px',
        },
        {
          name: 'actions',
          field: 'actions',
          label: 'Action',
          align: 'right',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        }
      ]

      return result
    })
    const pagination = ref({
      sortBy: '',
      descending: true,
      page: 1,
      rowsPerPage: 25,
      rowsNumber: 0
    })
    const filters = reactive({
      value: {
        created_after: "",
        created_before: "",
        search_text: "",
        sort: "Order by"
      },
    })

    const processes = reactive({
      listing: {
        in_progress: false
      },
      updating: {
        in_progress: false
      }
    })

    const list_records = async () => {
      let process = processes.listing
      process.in_progress = true
      
      let payload = {
        ...filters.value,
        page: pagination.value.page,
        limit: pagination.value.rowsPerPage || pagination.value.rowsNumber,
        sorts: `${pagination.value.descending ? '-' : '+'}${pagination.value.sortBy}`,
      }
      let response = await api.list_users(payload)
      response = response.data
      console.log('list users', response)

      if (response.success) {
        let result = response.data.map((item, index) => {
          return {
            ...item,
            index: index
          }
        })
        records.value = result
        pagination.value.rowsNumber = response.pagination.total
      }
      process.in_progress = false
    }

    const filter_records = debounce(list_records, 500)

    const delete_user = async (record) => {
      if (!window.confirm('Are you sure to delete this record?')) return
      let payload = {
        id: record.id,
      }
      const response = await api.delete_user(payload)
      if (response.status === 200) {
        let index = records.value.findIndex(r => r.id === record.id)
        if (index > -1) records.value.splice(index, 1)
        $q.notify({
          type: 'positive',
          message: 'User deleted!'
        })
      } else {
        $q.notify({
          type: 'negative',
          message: 'Server Error'
        })
      }
    }

    return {
      records,
      columns,
      filters,
      pagination,
      processes,
      list_records,
      delete_user,
      handle_updated: (record) => {
        const index = records.value.findIndex(v => v.id === record.id)
        if (index >= 0) Object.assign(records.value[index], record)
      },
      handle_pagination_changed: (props) => {
        pagination.value = props.pagination
        list_records()
      }
    }
  }
}
</script>
