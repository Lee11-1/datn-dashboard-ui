<template>
  <q-form v-model="form_data.valid" greedy
          ref="form"
          class="row q-col-gutter-sm q-pa-md">
    <div class="col-12 row q-col-gutter-sm">
      <div class="col-6">
        <div class="tour-detail-title">Name</div>
        <q-input v-model="form_data.values.name"
                 dense type="text" outlined
                 placeholder="Warehouse name"
                 :rules="form_data.rules.required" />
      </div>
      <div class="col-6">
        <div class="tour-detail-title">Code</div>
        <q-input v-model="form_data.values.code"
                 dense type="text" outlined
                 placeholder="Warehouse code"
                 :rules="form_data.rules.required" />
      </div>
      <div class="col-12">
        <div class="tour-detail-title">Address</div>
        <q-input v-model="form_data.values.address"
                 dense type="textarea" outlined
                 placeholder="Warehouse address"
                 rows="2"
                 :rules="form_data.rules.required" />
      </div>
      <div class="col-12">
        <div class="tour-detail-title">Location</div>
        <q-input v-model="form_data.values.location"
                 dense type="text" outlined
                 placeholder="Location coordinates or description"
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
        <div class="tour-detail-title">Manager</div>
        <q-select v-model="form_data.values.managerId"
                 dense outlined
                 emit-value
                 map-options
                 clearable
                 use-input
                 @filter="handle_manager_filter"
                 :loading="managerLoading"
                 :options="managerOptions"
                 option-value="id"
                 option-label="fullName"
                 />
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

export default {
  props: {
    modelValue: {type: Object, required: true},
    isUpdate: {type: Boolean, default: false},
  },
  setup (props, context) {
    const api = use_api()
    const $q = useQuasar()
    const form = ref(null)
    const allZones = ref([])
    const allManagers = ref([])
    const zoneLoading = ref(false)
    const managerLoading = ref(false)

    const init_form_values = () => {
      let form = object_assign({
        id: null,
        name: null,
        code: null,
        address: null,
        location: null,
        zoneId: null,
        managerId: null,
        isActive: true,
      }, props.modelValue)
      return form
    }

    const zoneOptions = computed(() => {
      return allZones.value
    })

    const managerOptions = computed(() => {
      return allManagers.value
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

    const search_managers = async (search_text = '') => {
      managerLoading.value = true
      try {
        const payload = {
          search_text: search_text,
          role: 'manager',
          page: '1',
          limit: '25',
          sorts: '-'
        }
        const response = await api.list_users(payload)
        if (response.status === 200 && response.data.success) {
          allManagers.value = response.data.data || []
        }
      } catch (error) {
        console.error('Error loading managers:', error)
      } finally {
        managerLoading.value = false
      }
    }

    const handle_zone_filter = debounce((val, update) => {
      search_zones(val).then(() => {
        update()
      })
    }, 500)

    const handle_manager_filter = debounce((val, update) => {
      search_managers(val).then(() => {
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
        const managersPayload = {
          role: 'manager',
          page: '1',
          limit: '50',
          sorts: '-'
        }
        const [zonesRes, managersRes] = await Promise.all([
          api.list_zones(zonesPayload),
          api.list_users(managersPayload)
        ])
        if (zonesRes.status === 200 && zonesRes.data.success) {
          allZones.value = zonesRes.data.data || []
        }
        if (managersRes.status === 200 && managersRes.data.success) {
          allManagers.value = managersRes.data.data || []
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

    watch(
      form_data.values,
      (result) => {
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
      zoneOptions,
      managerOptions,
      zoneLoading,
      managerLoading,
      handle_zone_filter,
      handle_manager_filter,
    }
  }
}
</script>
