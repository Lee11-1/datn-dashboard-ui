<template>
  <div class="row">
    <div class="col-12">
      <div class="q-mb-md">
        <q-input 
          v-model="filters.value.search_text"
          outlined
          dense
          placeholder="Search inventory..."
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
            <q-td key="updatedAt" :props="props">
              <datetime :modelValue="props.row.updatedAt" :expect_format="'MMM D, YYYY'" />
            </q-td>
            <q-td key="productName" :props="props">
              <span>{{ props.row.product?.name || '-' }}</span>
            </q-td>
            <q-td key="warehouseName" :props="props">
              <span>{{ props.row.warehouse?.name || '-' }}</span>
            </q-td>
            <q-td key="quantity" :props="props">
              <q-chip dense :label="props.row.quantity" color="blue" text-color="white" />
            </q-td>
            <q-td key="reservedQty" :props="props">
              <q-chip dense :label="props.row.reservedQty" color="orange" text-color="white" />
            </q-td>
            <q-td key="availableQty" :props="props">
              <span>{{ props.row.quantity - props.row.reservedQty }}</span>
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn dense round flat icon="edit" color="grey"
                     @click="$refs.detail_dialog.toggle(props.row)"
                     />
              <q-btn dense flat round icon="delete" color="grey"
                @click="delete_inventory(props.row)"
                />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
  <update-inventory ref="detail_dialog"
                   @updated="val => handle_updated(val)" />
</template>
<script>
import {ref, reactive, computed} from 'vue'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'

import debounce from 'lodash/debounce'
import {use_api} from 'src/composibles/api'

import Datetime from 'src/components/common/datetime'
import UpdateInventory from '../dialog/update'

export default {
  components: {
    Datetime,
    UpdateInventory
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
          name: 'updatedAt',
          field: 'updatedAt',
          label: 'Updated',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'productName',
          field: 'productName',
          label: 'Product',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'warehouseName',
          field: 'warehouseName',
          label: 'Warehouse',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'quantity',
          field: 'quantity',
          label: 'Quantity',
          align: 'center',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'reservedQty',
          field: 'reservedQty',
          label: 'Reserved',
          align: 'center',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'availableQty',
          field: 'availableQty',
          label: 'Available',
          align: 'center',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
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
        search_text: "",
      },
    })

    const processes = reactive({
      listing: {
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
      let response = await api.list_inventory(payload)
      response = response.data
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

    const delete_inventory = async (record) => {
      if (!window.confirm('Are you sure to delete this record?')) return
      let payload = {
        id: record.id,
      }
      const response = await api.delete_inventory(payload)
      if (response.status === 200) {
        let index = records.value.findIndex(r => r.id === record.id)
        if (index > -1) records.value.splice(index, 1)
        $q.notify({
          type: 'positive',
          message: 'Inventory deleted!'
        })
      } else {
        $q.notify({
          type: 'negative',
          message: 'Server Error'
        })
      }
    }

    const handle_updated = (val) => {
      list_records()
    }

    const handle_pagination_changed = async (props) => {
      pagination.value = props.pagination
      list_records()
    }

    const handle_search_changed = debounce(() => {
      pagination.value.page = 1
      list_records()
    }, 500)

    return {
      records,
      columns,
      filters,
      pagination,
      processes,
      handle_pagination_changed,
      handle_search_changed,
      list_records,
      delete_inventory,
      handle_updated,
    }
  }
}
</script>
