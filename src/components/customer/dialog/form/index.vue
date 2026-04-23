<template>
    <q-form v-model="form_data.valid" greedy
            ref="form"
            class="row q-col-gutter-sm q-pa-md">
      <div class="col-12 row q-col-gutter-sm">
        <div class="col-12">
            <div class="tour-detail-title">Full Name</div>
            <q-input v-model="form_data.values.fullName"
                   dense type="text" outlined
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Phone</div>
            <q-input v-model="form_data.values.phone"
                   dense type="tel" outlined />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Email</div>
            <q-input v-model="form_data.values.email"
                   dense type="email" outlined />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Address</div>
            <q-input v-model="form_data.values.address"
                   dense type="textarea" outlined />
        </div>
        <div class="col-12">
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
                  />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Note</div>
            <q-input v-model="form_data.values.note"
                   dense type="textarea" outlined />
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
      const showed = ref(false)
      const allZones = ref([])
      const zoneLoading = ref(false)

      const init_form_values = () => {
        let form = object_assign({
            id: null,
            fullName: null,
            phone: null,
            email: null,
            address: null,
            zoneId: null,
            note: null,
        }, props.modelValue)
        return form
    }

      const zoneOptions = computed(() => {
        return allZones.value
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

      const handle_zone_filter = debounce((val, update) => {
        search_zones(val).then(() => {
          update()
        })
      }, 500)

      const load_selected_zone = async () => {
        if (props.isUpdate && props.modelValue && props.modelValue.zoneId) {
          try {
            const payload = {
              search_text: '',
              page: '1',
              limit: '25',
              sorts: '-'
            }
            const response = await api.list_zones(payload)
            if (response.status === 200 && response.data.success) {
              allZones.value = response.data.data || []
            }
          } catch (error) {
            console.error('Error loading zone:', error)
          }
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
          }
      )
  
      const toggle = () => {
        if (showed.value) {
          // closing logic
          form_data.value = {}
        }
        showed.value = !showed.value
      }

      onMounted(() => {
        load_selected_zone()
      })
  
      return {
        showed,
        form_data,
        form,
        toggle,
        zoneOptions,
        zoneLoading,
        handle_zone_filter,
      }
    }
  }
  </script>
