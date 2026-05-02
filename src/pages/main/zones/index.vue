<template>
  <q-page class="q-pa-lg" style="display: flex; flex-direction: column; height: 100vh;">
    <div class="row items-center q-pb-md justify-between">
      <div class="text-h6 q-pr-sm">
        Zone
      </div>
      <q-btn color="primary" 
             label="Create" 
             icon="add"
             @click="$refs.create_dialog.toggle()"
             style="margin-right: 10px" />
    </div>
    <div style="display: flex; gap: 16px; overflow: hidden; height: 100%; width: 100%;">
      <div style="width: 50%; overflow: auto; border: 1px solid #ddd; border-radius: 4px; display: flex; flex-direction: column;">
        <zone-table ref="table" @row-selected="handleRowSelected" />
      </div>
      <div style="width: 50%; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; height: 100%; display: flex; flex-direction: column;">
        <Map ref="mapComponent" :polygonData="selectedPolygonWKT" />
      </div>
    </div>
  </q-page>
  <create-zone ref="create_dialog"
                   @updated="val => handle_zone_updated(val)" />
  <update-zone ref="update_dialog"
                   @updated="val => handle_zone_updated(val)" />
</template>
<script>
import {ref} from 'vue'

import ZoneTable from 'components/zone/table'
import CreateZone from 'components/zone/dialog/create'
import UpdateZone from 'components/zone/dialog/update'
import Map from 'components/common/map'

export default {
  components: {
    ZoneTable,
    CreateZone,
    UpdateZone,
    Map
  },
  setup () {
    const table = ref(null)
    const create_dialog = ref(null)
    const update_dialog = ref(null)
    const mapComponent = ref(null)
    const selectedPolygonWKT = ref('')

    const coordinatesToWKT = (coordinates) => {
      // Convert GeoJSON coordinates to WKT MULTIPOLYGON format
      // GeoJSON: [[[lon, lat], [lon, lat], ...]]
      // WKT: MULTIPOLYGON (((lon lat, lon lat, ...)))
      
      if (!coordinates || !Array.isArray(coordinates)) {
        return ''
      }

      const polygons = coordinates.map(polygon => {
        const rings = polygon.map(ring => {
          return ring.map(coord => `${coord[0]} ${coord[1]}`).join(', ')
        }).join('), (')
        return `((${rings}))`
      }).join(', ')

      return `MULTIPOLYGON (${polygons})`
    }

    const handleRowSelected = (zone) => {
      console.log('Selected zone:', zone)
      if (zone && zone.boundary && zone.boundary.coordinates) {
        selectedPolygonWKT.value = coordinatesToWKT(zone.boundary.coordinates)
        if (mapComponent.value && mapComponent.value.map) {
          setTimeout(() => {
            mapComponent.value.map.invalidateSize()
          }, 100)
        }
      } else {
        selectedPolygonWKT.value = ''
      }
    }

    const handle_zone_updated = (val) => {
      if (table.value) {
        table.value.list_records()
      }
    }

    return {
      table,
      create_dialog,
      update_dialog,
      mapComponent,
      selectedPolygonWKT,
      handle_zone_updated,
      handleRowSelected,
    }
  }
}
</script>
