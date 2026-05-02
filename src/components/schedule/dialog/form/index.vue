<template>
  <q-form v-model="form_data.valid" greedy
          ref="form"
          class="row q-col-gutter-sm q-pa-md">
    <div class="col-12 row q-col-gutter-sm">
   
      <div class="col-6">
        <div class="tour-detail-title">Start Date</div>
          <date-picker
                v-model="form_data.values.startDate"
                :rules="form_data.rules.required"
                outlined
            />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">End Date</div>
            <date-picker
                    v-model="form_data.values.endDate"
                    :rules="form_data.rules.required"
                    outlined
                />
        </div>
      <div class="col-6">
        <div class="tour-detail-title">Zone</div>
        <q-select v-model="form_data.values.zoneId"
                 dense outlined
                 emit-value
                 map-options
                 clearable
                 use-input
                 @filter="handle_zone_filter"
                 :loading="zoneLoading"
                 :options="zoneOptions"
                 option-value="id"
                 option-label="name"
                 :rules="form_data.rules.required"
                 />
      </div>
      <div class="col-6">
        <div class="tour-detail-title">Assigned User</div>
        <q-select v-model="form_data.values.userId"
                 dense outlined
                 emit-value
                 map-options
                 clearable
                 use-input
                 @filter="handle_user_filter"
                 :loading="userLoading"
                 :options="userOptions"
                 option-value="id"
                 option-label="fullName"
                 />
      </div>
      <div class="col-6">
        <div class="tour-detail-title">Status</div>
        <q-select v-model="form_data.values.status"
                 dense outlined
                 emit-value
                 map-options
                 :options="statusOptions"
                 placeholder="Select status"
                 :rules="form_data.rules.required"
                 />
      </div>
      <div class="col-6">
        <div class="tour-detail-title">Priority</div>
        <q-select v-model="form_data.values.priority"
                 dense outlined
                 emit-value
                 map-options
                 :options="priorityOptions"
                 placeholder="Select priority" />
      </div>
      <div class="col-12">
        <div class="tour-detail-title">Notes</div>
        <q-input v-model="form_data.values.note"
                 dense type="textarea" outlined
                 placeholder="Additional notes"
                 rows="2" />
      </div>
      <div class="col-12">
        <q-checkbox v-model="form_data.values.isActive"
                   label="Active" />
      </div>
    </div>
  </q-form>
</template>
<script>
import {reactive, ref, watch, computed, onMounted} from 'vue'
import {useQuasar} from 'quasar'
import debounce from 'lodash/debounce'
import { object_assign } from 'src/utils'
import {use_api} from 'src/composibles/api'
import DatePicker from 'src/components/common/date-picker'

export default {
    components: {DatePicker},
  props: {
    modelValue: {type: Object, required: true},
    isUpdate: {type: Boolean, default: false},
  },
  setup (props, context) {
    const api = use_api()
    const $q = useQuasar()
    const form = ref(null)
    const allZones = ref([])
    const allUsers = ref([])
    const zoneLoading = ref(false)
    const userLoading = ref(false)

    const statusOptions = [
      { label: 'Planned', value: 'planned' },
      { label: 'Ongoing', value: 'ongoing' },
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' }
    ]

    const priorityOptions = [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Urgent', value: 'urgent' }
    ]

    const init_form_values = () => {
      let form = object_assign({
        id: null,
        title: null,
        startDate: null,
        endDate: null,
        zoneId: null,
        userId: null,
        status: 'planned',
        priority: 'medium',
        note: null,
        isActive: true
      }, props.modelValue)
      return form
    }

    const generateTitle = (zoneId, userId, startDate) => {
      const zone = allZones.value.find(z => z.id === zoneId)
      const user = allUsers.value.find(u => u.id === userId)
      
      if (!zone || !user || !startDate) return ''
      
      const zoneName = zone.name || ''
      const userName = user.fullName || ''
      const date = new Date(startDate).toLocaleDateString('vi-VN')
      
      return `${zoneName} - ${userName} - ${date}`
    }

    const zoneOptions = computed(() => {
      return allZones.value
    })

    const userOptions = computed(() => {
      return allUsers.value
    })

    const search_zones = async (search_text = '') => {
      zoneLoading.value = true
      try {
        const payload = {
          search_text: search_text,
          page: '1',
          limit: '25',
          sorts: '-'
        }
        const response = await api.list_zones(payload)
        if (response.status === 200 && response.data.success) {
          allZones.value = response.data.data || []
        }
      } catch (error) {
        console.error('Error loading zones:', error)
      } finally {
        zoneLoading.value = false
      }
    }

    const search_users = async (search_text = '') => {
      userLoading.value = true
      try {
        const payload = {
          search_text: search_text,
          role: 'sale',
          page: '1',
          limit: '25',
          sorts: '-'
        }
        const response = await api.list_users(payload)
        if (response.status === 200 && response.data.success) {
          allUsers.value = response.data.data || []
        }
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        userLoading.value = false
      }
    }

    const handle_zone_filter = debounce((val, update) => {
      search_zones(val).then(() => {
        update()
      })
    }, 500)

    const handle_user_filter = debounce((val, update) => {
      search_users(val).then(() => {
        update()
      })
    }, 500)

    const load_initial_data = async () => {
      try {
        const zonesPayload = {
          page: '1',
          limit: '50',
          sorts: '-'
        }
        const usersPayload = {
          page: '1',
          limit: '50',
          sorts: '-'
        }
        const [zonesRes, usersRes] = await Promise.all([
          api.list_zones(zonesPayload),
          api.list_users(usersPayload)
        ])
        if (zonesRes.status === 200 && zonesRes.data.success) {
          allZones.value = zonesRes.data.data || []
        }
        if (usersRes.status === 200 && usersRes.data.success) {
          allUsers.value = usersRes.data.data || []
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }

    const form_data = reactive({
      valid: false,
      values: init_form_values(),
      rules: {
        required: [
          v => (!!v) || 'Required'
        ]
      }
    })

    const formatDateToString = (date) => {
      if (!date) return ''
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    watch(
      form_data.values,
      (result) => {
        const newTitle = generateTitle(result.zoneId, result.userId, result.startDate)
        result.title = newTitle || ''
        
        if (result.startDate) {
            result.startDate = formatDateToString(result.startDate)
        }
        if (result.endDate) {
            result.endDate = formatDateToString(result.endDate)
        }
        
        context.emit('update:modelValue', result)
      },
      { deep: true }
    )

    onMounted(() => {
      load_initial_data()
    })

    return {
      form_data,
      form,
      statusOptions,
      priorityOptions,
      zoneOptions,
      userOptions,
      zoneLoading,
      userLoading,
      handle_zone_filter,
      handle_user_filter,
      generateTitle,
      formatDateToString,
    }
  }
}
</script>
