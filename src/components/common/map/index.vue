<template>
  <div class="map-full">
    <div class="search-box">
      <input
        v-model="searchQuery"
        @keydown.enter="handleSearch"
        placeholder="Tìm địa điểm..."
        class="search-input"
      />
      <ul v-if="searchResults.length" class="search-results">
        <li
          v-for="(item, index) in searchResults"
          :key="index"
          @click="selectLocation(item)"
          class="search-item"
        >
          {{ item.place_name }}
        </li>
      </ul>
    </div>
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
    },
    initialLocation: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      map: null,
      polygonLayers: {},
      searchQuery: '',
      searchResults: [],
      currentMarker: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap()
      // Invalidate size after map initialization to ensure proper rendering
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize()
          // Render initial location marker nếu có
          if (this.initialLocation && this.initialLocation.coordinates) {
            const [lng, lat] = this.initialLocation.coordinates
            this.renderMarkerFromLocation(lat, lng)
          }
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
    },
    initialLocation: {
      handler(newLocation) {
        if (newLocation && newLocation.coordinates && this.map) {
          const [lng, lat] = newLocation.coordinates
          this.renderMarkerFromLocation(lat, lng)
        }
      },
      deep: true
    }
  },
  methods: {
    initMap() {
      const defaultLat = 21.028511
      const defaultLng = 105.85202

      try {
        this.map = L.map(this.$refs.mapContainer, { zoomControl: false }).setView([defaultLat, defaultLng], 13)
        console.log('Map initialized:', this.map)
        const MAP_TOKEN = process.env.MAP_TOKEN
        L.tileLayer(
          `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${MAP_TOKEN}`,
          {
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
          }
        ).addTo(this.map)
        L.control.zoom({ position: 'bottomright' }).addTo(this.map)
        console.log('Tile layer added')
        
        this.map.on('click', (e) => {
          this.handleMapClick(e.latlng)
        })
      } catch (err) {
        console.error('Error initializing map:', err)
      }
    },
    async handleSearch() {
      if (!this.searchQuery) {
        this.searchResults = []
        return
      }
      const MAP_TOKEN = process.env.MAP_TOKEN

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          this.searchQuery
        )}.json?access_token=${MAP_TOKEN}&limit=5&country=vn&language=vi&proximity=105.85,21.03&types=address,place,region`
      )

      const data = await res.json()
      this.searchResults = data.features || []
    },
    selectLocation(place) {
      const [lng, lat] = place.center
      this.map.setView([lat, lng], 15)
      this.searchResults = []
      this.searchQuery = place.place_name
    },
    
    async getAddressFromCoordinates(lat, lng) {
      try {
        const MAP_TOKEN = process.env.MAP_TOKEN
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAP_TOKEN}`
        )
        const data = await res.json()
        if (data.features && data.features.length > 0) {
          return data.features[0].place_name
        }
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      } catch (error) {
        console.error('Error getting address:', error)
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }
    },
    
    handleMapClick(latlng) {
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker)
      }

      const dotIcon = L.divIcon({
        className: 'location-pin-marker marker-fade-in',
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="25" height="35">
          <path d="M20 0C8.95 0 0 8.95 0 20c0 11.05 20 30 20 30s20-18.95 20-30c0-11.05-8.95-20-20-20z" fill="#ff4444"/>
          <circle cx="20" cy="20" r="8" fill="white"/>
        </svg>`,
        iconSize: [40, 50],
        popupAnchor: [0, -25]
      })

      this.currentMarker = L.marker([latlng.lat, latlng.lng], { icon: dotIcon })
        .addTo(this.map)

      this.getAddressFromCoordinates(latlng.lat, latlng.lng).then(address => {
        this.currentMarker.bindPopup(`<div class="marker-popup"><strong>${address}</strong></div>`).openPopup()
        this.$emit('location-selected', {
          lat: latlng.lat,
          lng: latlng.lng,
          address: address
        })
      })
    },

    renderMarkerFromLocation(lat, lng) {
      // Xóa marker cũ nếu có
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker)
      }

      // Tạo marker tại vị trí location
      const dotIcon = L.divIcon({
        className: 'location-pin-marker marker-fade-in',
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="25" height="35">
          <path d="M20 0C8.95 0 0 8.95 0 20c0 11.05 20 30 20 30s20-18.95 20-30c0-11.05-8.95-20-20-20z" fill="#ff4444"/>
          <circle cx="20" cy="20" r="8" fill="white"/>
        </svg>`,
        iconSize: [40, 50],
        popupAnchor: [0, -25]
      })

      this.currentMarker = L.marker([lat, lng], { icon: dotIcon })
        .addTo(this.map)

      // Lấy địa chỉ rồi hiển thị popup
      this.getAddressFromCoordinates(lat, lng).then(address => {
        if (this.currentMarker) {
          this.currentMarker.bindPopup(`<div class="marker-popup"><strong>${address}</strong></div>`).openPopup()
        }
      })

      // Zoom vào vị trí
      this.map.setView([lat, lng], 15)
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
  position: relative;
}

.map {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.search-box {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 1000;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  background: white;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  background: #f9f9f9;
}

.search-results {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
  border-top: 1px solid #e0e0e0;
}

.search-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  transition: background-color 0.2s ease;
}

.search-item:hover {
  background-color: #f5f5f5;
}

.search-item:last-child {
  border-bottom: none;
}

.custom-marker {
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-icon {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
}

.marker-icon i {
  color: white;
  font-size: 18px;
  transform: rotate(45deg);
}

.marker-popup {
  padding: 4px 0;
  font-size: 13px;
}

.marker-popup strong {
  color: #333;
}
</style>
