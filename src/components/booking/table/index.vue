<template>
  <div class="row">
    <div class="col-12 q-pb-lg">
      <booking-filter v-model="filters.value"
                      :fields="filters.options"
                      @time_change="handle_filter_booking"
                      @search_tour="handle_filter_tour"
                      @sort="handle_filter_create"
                      />
    </div>
    <div class="col-12">
      <q-table
        :columns="columns"
        :rows="records"
        v-model:pagination="pagination"
        @request="handle_pagination_changed"
        :loading="processes.listing.in_progress"
        binary-state-sort
        row-key="id"
        dense>
        <template v-slot:body="props">
          <q-tr :props="props" :class="props.row.index % 2 ? 'bg-grey-2': ''">
            <q-td key="created_at" :props="props">
              <datetime :modelValue="props.row.created_at" :expect_format="'MMM D, YYYY'"/>
            </q-td>
            <q-td key="number" :props="props" style="height: 50px;">
              <span>{{ props.row.reference_code || "" }}</span>
            </q-td>
            <q-td key="name" :props="props" style="height: 50px;">
              <span>{{ props.row.products[0]?.data?.name || "" }}</span>
            </q-td>
            <q-td key="start_date" :props="props">
              <datetime :modelValue="props.row.products[0]?.data?.departure_date"
                      :date_format="'DD/MM/YYYY'" :expect_format="'MMM D, YYYY'" />
            </q-td>
            <q-td key="duration" :props="props">
              <span v-if="props.row.products[0]?.data?.duration?.days">{{ props.row.products[0]?.data?.duration?.days || "" }}day(s)</span>
              <span v-if="props.row.products[0]?.data?.duration?.hours"> {{ props.row.products[0]?.data?.duration?.hours || "" }}hour(s)</span>
              <span v-if="props.row.products[0]?.data?.duration?.minutes"> {{ props.row.products[0]?.data?.duration?.minutes || "" }}minutes</span>
            </q-td>
            <q-td key="guest" :props="props">
              <span>{{ guest_title(props.row.travelers) }}</span>
            </q-td>
            <q-td key="total_amount" :props="props">
              <span>{{ props.row.total_amount }}</span>
            </q-td>
            <q-td key="actions" :props="props">
              <q-badge rounded  v-if="props.row.booking_status == 'processing'" color="amber-8" label="Pending" />
              <q-badge rounded v-else-if="props.row.booking_status == 'canceled'" color="purple" label="Canceled" />
              <q-badge  v-else rounded color="green-8" label="Approved" />
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn label="Select" color="blue-10"
                     class="q-px-md"  size="md"
                     @click="get_redirect(props.row.id)" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script>
import {ref, reactive, watch, computed} from 'vue'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'
import moment from 'moment'
import {use_api} from 'src/composibles/api'
import Datetime from 'src/components/common/datetime'

import BookingFilter from './booking-filter'

export default {
  components: {
    BookingFilter,
    Datetime,
  },
  props: {
    table_type: {type: String},
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
      return [
        {
          name: 'created_at',
          field: 'created_at',
          label: 'Date',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'number',
          field: 'number',
          label: 'Number',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'name',
          field: 'name',
          label: 'Tour name',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 5px;',
          style: 'font-size: 14px',
        },
        {
          name: 'start_date',
          field: 'start_date',
          label: 'Start date',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'duration',
          field: 'duration',
          label: 'Duration',
          align: 'left',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'guest',
          field: 'guest',
          label: 'Guests',
          align: 'center',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'total_amount',
          field: 'total_amount',
          label: 'Amount',
          align: 'center',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 0;',
          style: 'font-size: 14px',
        },
        {
          name: 'status',
          field: 'status',
          label: 'Status',
          align: 'center',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        },
        {
          name: 'actions',
          field: 'actions',
          label: 'Action',
          align: 'center',
          headerStyle: 'font-size: 16px;font-weight: 500;padding: 9px 15px;',
          style: 'font-size: 14px',
        }
      ]
    })
    const pagination = ref({
      sortBy: 'created_at',
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
        sort: "-created_at"
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
        per_page: pagination.value.rowsPerPage || pagination.value.rowsNumber,
        sorts: `${pagination.value.descending ? '-' : '+'}${pagination.value.sortBy}`,
      }
      const response = await api.list_b2b_bookings(payload)
      if (response.status === 200) {
        let result = response.data.result.map((item, index) => {
          if (item.products.length > 0){
            let product = item.products[0]
            item['booking_status'] = product.status
          }

          return {
            ...item,
            index: index
          }
        })
        records.value = result
        pagination.value.rowsNumber = response.data.total
        context.emit('total', response.data.total)
      }
      process.in_progress = false
    }

    const guest_title = (value) => {
      let pax_type = [
        {
          'id': 'adult',
          'singular': 'Adult',
          'plural': 'Adults'
        },
        {
          'id': 'child',
          'singular': 'Children',
          'plural': 'Child'
        },
        {
          'id': 'infant',
          'singular': 'Infant',
          'plural': 'Infants'
        }
      ]
      let text = []
      pax_type.forEach(type => {
        let item = `${value[type.id] ? value[type.id] > 1 ? value[type.id] + ' ' + type.plural : value[type.id] + ' ' + type.singular : ''}`
        if (item) text.push(item)
      })

      return text.join(',')
    }

    const handle_filter_booking = async (value) => {
      if (value.data){
        filters.value.search_text = value.data
      }
      else {
        if(value.from === null){
          filters.value.created_after = ''
          filters.value.created_before = ''
        }else{
          filters.value.created_after = moment(value.from, 'YYYY-MM-DD').utc().format()
          filters.value.created_before = moment(value.to, 'YYYY-MM-DD').utc().format()
        }
      }

      await list_records()
    }
    const handle_filter_create = async(value)=>{
      filters.value.sort = value
      await list_records()
    }
    const handle_filter_tour = async (value) => {
      filters.value.search_text = value
      await list_records()
    }

    const get_redirect = (id) => {
      let result = {
        name: 'main.booking',
        params: {
          id,
        }
      }
      router.push(result)
    }
    return {
      records,
      columns,
      filters,
      pagination,
      processes,
      guest_title,
      list_records,
      get_redirect,
      handle_filter_tour,
      handle_filter_booking,
      handle_filter_create,
      handle_pagination_changed: (props) => {
        pagination.value = props.pagination
        list_records()
      }
    }
  }
}
</script>
