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
            <q-td key="sku" :props="props">
              <span>{{ props.row.sku }}</span>
            </q-td>
            <q-td key="name" :props="props">
              <span>{{ props.row.name }}</span>
            </q-td>
            <q-td key="price" :props="props">
              <span>${{ parseFloat(props.row.price).toFixed(2) }}</span>
            </q-td>
            <q-td key="unit" :props="props">
              <span>{{ props.row.unit }}</span>
            </q-td>
            <q-td key="isActive" :props="props">
              <span v-if="props.row.isActive" style="color: green">●</span>
              <span v-else style="color: red">●</span>
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn dense round flat icon="edit" color="grey"
                     @click="$refs.detail_dialog.toggle(props.row)"
                     />
              <q-btn dense flat round icon="delete" color="grey"
                @click="delete_product(props.row)"
                />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
  <update-product ref="detail_dialog"
               @updated="val => handle_updated(val)" />
</template>
<script>
import {ref, reactive, computed} from 'vue'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'

import debounce from 'lodash/debounce'
import {use_api} from 'src/composibles/api'

import Datetime from 'src/components/common/datetime'
import UpdateProduct from '../dialog/update'

export default {
  components: {
    Datetime,
    UpdateProduct
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
          label: 'Created Date',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'sku',
          field: 'sku',
          label: 'SKU',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'name',
          field: 'name',
          label: 'Product Name',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'price',
          field: 'price',
          label: 'Price',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'unit',
          field: 'unit',
          label: 'Unit',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'isActive',
          field: 'isActive',
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
      const response = await api.list_products(payload)
      const data = response.data.data
      if (response.status === 200 && data) {
        let result = data.map((item, index) => {
          return {
            ...item,
            index: index
          }
        })
        records.value = result
        pagination.value.rowsNumber = response.data.pagination.total
      }
      process.in_progress = false
    }

    const filter_records = debounce(list_records, 500)

    const delete_product = async (record) => {
      if (!window.confirm('Are you sure to delete this record?')) return
      let payload = {
        product_id: record.id,
      }
      const response = await api.delete_product(payload)
      if (response.status === 200) {
        let index = records.value.findIndex(r => r.id === record.id)
        if (index > -1) records.value.splice(index, 1)
        $q.notify({
          type: 'positive',
          message: 'Product deleted!'
        })
      } else {
        $q.notify({
          type: 'negative',
          message: response.message || 'Server Error'
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
      delete_product,
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
