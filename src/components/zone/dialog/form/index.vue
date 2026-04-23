<template>
    <q-form v-model="form_data.valid" greedy
            ref="form"
            class="row q-col-gutter-sm q-pa-md">
      <div class="col-12 row q-col-gutter-sm">
        <div class="col-12">
            <div class="tour-detail-title">Name (Vietnamese)</div>
            <q-input v-model="form_data.values.name"
                   dense type="text" outlined
                   placeholder="Zone name in Vietnamese"
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Name (English)</div>
            <q-input v-model="form_data.values.nameEn"
                   dense type="text" outlined
                   placeholder="Zone name in English" />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Code</div>
            <q-input v-model="form_data.values.code"
                   dense type="text" outlined
                   placeholder="Zone code"
                   :rules="form_data.rules.required" />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Level</div>
            <q-select v-model="form_data.values.level"
                   dense outlined
                   emit-value
                   map-options
                   clearable
                   :options="levelOptions"
                   :rules="form_data.rules.required"
                   placeholder="Select level" />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Area (km²)</div>
            <q-input v-model.number="form_data.values.areaKm2"
                   dense type="number" outlined
                   placeholder="Area in square kilometers"
                   step="0.01" />
        </div>
        <div class="col-6">
            <div class="tour-detail-title">Parent Zone</div>
            <q-select v-model="form_data.values.parentId"
                   dense outlined
                   emit-value
                   map-options
                   clearable
                   use-input
                   @filter="handle_parent_zone_filter"
                   :loading="parentZoneLoading"
                   :options="parentZoneOptions"
                   option-value="id"
                   option-label="name"
                   />
        </div>
        <div class="col-12">
            <div class="tour-detail-title">Custom Note</div>
            <q-input v-model="form_data.values.customNote"
                   dense type="textarea" outlined
                   placeholder="Additional notes about this zone" />
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
      const showed = ref(false)
      const allParentZones = ref([])
      const parentZoneLoading = ref(false)

      const levelOptions = [
        { label: 'Country', value: 'country' },
        { label: 'Province/Region', value: 'province' },
        { label: 'District', value: 'district' },
        { label: 'Ward/Commune', value: 'ward' },
        { label: 'Village', value: 'village' }
      ]

      const init_form_values = () => {
        let form = object_assign({
            id: null,
            name: null,
            nameEn: null,
            code: null,
            level: null,
            areaKm2: null,
            parentId: null,
            customNote: null,
            isActive: true,
        }, props.modelValue)
        return form
    }

      const parentZoneOptions = computed(() => {
        return allParentZones.value.filter(z => z.id !== form_data.values.id)
      })

      const search_parent_zones = async (search_text = '') => {
        parentZoneLoading.value = true
        try {
          const payload = {
            search_text: search_text,
            page: '1',
            limit: '25',
            sorts: '-'
          }
          const response = await api.list_zones(payload)
          if (response.status === 200 && response.data.success) {
            allParentZones.value = response.data.data || []
          }
        } catch (error) {
          console.error('Error loading parent zones:', error)
        } finally {
          parentZoneLoading.value = false
        }
      }

      const handle_parent_zone_filter = debounce((val, update) => {
        search_parent_zones(val).then(() => {
          update()
        })
      }, 500)

      const load_selected_parent_zone = async () => {
        if (props.isUpdate && props.modelValue && props.modelValue.parentId) {
          try {
            const payload = {
              search_text: '',
              page: '1',
              limit: '25',
              sorts: '-'
            }
            const response = await api.list_zones(payload)
            if (response.status === 200 && response.data.success) {
              allParentZones.value = response.data.data || []
            }
          } catch (error) {
            console.error('Error loading parent zone:', error)
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
          },
          { deep: true }
      )

      onMounted(() => {
        load_selected_parent_zone()
      })
  
      return {
        showed,
        form_data,
        form,
        levelOptions,
        parentZoneOptions,
        parentZoneLoading,
        handle_parent_zone_filter,
      }
    }
  }
  </script>
