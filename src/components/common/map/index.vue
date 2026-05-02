<template>
  <div class="map-full">
    <!-- Map -->
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'Map',
  props: {
    polygonData: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      map: null,
      polygonLayers: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap()
      // Invalidate size after map initialization to ensure proper rendering
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize()
        }
      }, 100)
    })
    this.renderPolygons()
  },

  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },
  watch: {
    polygonData: {
      handler() {
        this.clearPolygons()
        this.renderPolygons()
      }
    }
  },
  methods: {
    initMap() {
      const defaultLat = 21.028511
      const defaultLng = 105.85202

      try {
        this.map = L.map(this.$refs.mapContainer, { zoomControl: false }).setView([defaultLat, defaultLng], 13)
        console.log('Map initialized:', this.map)
        const TOKEN_MAP = process.env.MAP_TOKEN
        L.tileLayer(
          `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${TOKEN_MAP}`,
          {
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
          }
        ).addTo(this.map)
        L.control.zoom({ position: 'bottomright' }).addTo(this.map)
        console.log('Tile layer added')
      } catch (err) {
        console.error('Error initializing map:', err)
      }
    },

    parseMultiPolygon(multipolygonWKT) {
      const match = multipolygonWKT.match(/MULTIPOLYGON\s*\(\(\(([\s\S]+?)\)\)\)/i)
      if (!match) return []

      const coordsStr = match[1]
      const pairs = coordsStr.split(',').map(pair => {
        const [lon, lat] = pair.trim().split(/\s+/).map(Number)
        return [lat, lon] 
      })

      return pairs
    },

    renderPolygons() {
      if (!this.polygonData) return

      this.clearPolygons()
      
      const coordinates = this.parseMultiPolygon(this.polygonData)
      
      if (coordinates.length < 3) {
        console.warn('Invalid polygon data - need at least 3 coordinates')
        return
      }

      const polygon = L.polygon(coordinates, {
        color: '#3b82f6',
        weight: 2,
        opacity: 0.8,
        fill: true,
        fillColor: '#3b82f6',
        fillOpacity: 0.2
      }).addTo(this.map)

      this.polygonLayers.main = polygon

      // Fit map to polygon bounds
      const bounds = polygon.getBounds()
      this.map.fitBounds(bounds, { padding: [50, 50] })
    },

    clearPolygons() {
      Object.values(this.polygonLayers).forEach((layer) => {
        if (layer) {
          layer.remove()
        }
      })
      this.polygonLayers = {}
    }
  }
}
</script>

<style scoped>
.map-full {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
