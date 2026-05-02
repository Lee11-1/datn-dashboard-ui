<template>
    <q-form v-model="form_data.valid" greedy
            ref="form"
            class="row q-col-gutter-sm q-pa-md"
            style="height: 100%; display: flex; flex-wrap: wrap;">
      <div class="col-7 row q-col-gutter-sm">
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
        <div class="col-6">
            <div class="tour-detail-title">Latitude</div>
            <q-input v-model="form_data.values.latitude"
                   dense type="number" outlined readonly />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Longitude</div>
            <q-input v-model="form_data.values.longitude"
                   dense type="number" outlined readonly />
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
      <div class="col-5" style="display: flex; flex-direction: column;">
            <div class="tour-detail-title">Location Map</div>
            <div class="map-container">
              <Map ref="mapComponent" 
                   @location-selected="handleLocationSelected"
                   :initialLocation="form_data.values.location" />
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
  import Map from 'src/components/common/map'
  
  export default {
    components: {
      Map
    },
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
      const mapComponent = ref(null)

      const init_form_values = () => {
        let form = object_assign({
            id: null,
            fullName: null,
            phone: null,
            email: null,
            address: null,
            latitude: null,
            longitude: null,
            location: null,
            zoneId: null,
            note: null,
        }, props.modelValue)
        
        // Convert location GeoJSON to lat/lng khi cập nhật
        if (form.location && form.location.coordinates) {
          const [lng, lat] = form.location.coordinates
          form.longitude = lng
          form.latitude = lat
        }
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
            // Convert lat/lng to PostGIS Point location
            const emitData = {...result}
            if (result.latitude && result.longitude) {
              emitData.location = {
                type: 'Point',
                coordinates: [parseFloat(result.longitude), parseFloat(result.latitude)]
              }
            }
            // Xóa latitude/longitude khi gửi đi
            delete emitData.latitude
            delete emitData.longitude
            context.emit('update:modelValue', emitData)
          }
      )
  
      const toggle = () => {
        if (showed.value) {
          // closing logic
          form_data.value = {}
        }
        showed.value = !showed.value
      }

      const handleLocationSelected = (locationData) => {
        form_data.values.latitude = locationData.lat
        form_data.values.longitude = locationData.lng
        form_data.values.address = locationData.address
      }

      onMounted(() => {
        load_selected_zone()
      })
  
      return {
        showed,
        form_data,
        form,
        toggle,
        mapComponent,
        zoneOptions,
        zoneLoading,
        handle_zone_filter,
        handleLocationSelected,
      }
    }
  }
  </script>

<style scoped>
.map-container {
  width: 100%;
  flex: 1;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}
</style>
