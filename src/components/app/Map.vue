<template>
  <div>
    <Loader v-if="loading" />
    <mapbox
      v-else
      :access-token="token"
      :map-options="{
        style: 'mapbox://styles/mapbox/light-v9',
        center: currentMapData.center || center,
        zoom: currentMapData.zoom || zoom,
      }"
      @map-init="initialized"
      @map-load="loaded"
      @map-zoom="zoomEvent"
      @map-move="moveEvent"
    />
    <div
      v-if="this.$route.name == 'create-post' || this.$route.name == 'edit-post'"
      class="mt-2 saveButtonWrapper"
    >
      <button class="btn btn-warning" @click.prevent="saveMapData">
        Сохранить
      </button>
    </div>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
});

export default {
  name: 'Map',
  components: { Mapbox },
  props: {},
  data: () => ({
    token: process.env.VUE_APP_MAP_TOKEN,
    loading: true,
    isSaved: false,
    zoom: 10,
    center: [51.36827875968106, 51.223267578346395],
  }),
  computed: {
    currentMapData() {
      return this.$store.getters.currentMapData || {};
    },
  },
  async created() {
    if ((this.$route.name == 'post' || this.$route.name == 'edit-post') && this.$route.params.id) {
      await this.$store.dispatch('fetchGeometry', { pid: +this.$route.params.id });
    }
    this.loading = false;
  },
  methods: {
    initialized(map) {
      if (this.$route.name == 'create-post' || this.$route.name == 'edit-post') {
        map.addControl(draw);
      }
    },
    saveMapData() {
      const geometry = draw.getAll();
      this.$emit('saveMapData', {
        geometry,
        zoom: this.zoom,
        center: this.center,
      });
    },
    loaded(map) {
      this.zoom = map.getZoom();
      const mapCenter = map.getCenter();
      this.center = [mapCenter.lng, mapCenter.lat];
      if (Object.keys(this.currentMapData).length && this.$route.name == 'post') {
        map.addSource('maine', {
          type: 'geojson',
          data: this.currentMapData.featureCollection,
        });
        map.addLayer({
          id: 'maine',
          type: 'fill',
          source: 'maine',
          layout: {},
          paint: {
            'fill-color': '#088',
            'fill-opacity': 0.8,
          },
        });
      } else if (Object.keys(this.currentMapData).length || this.$route.name == 'edit-post') {
        draw.set(this.currentMapData.featureCollection);
      }
    },
    zoomEvent(map) {
      this.zoom = map.getZoom();
    },
    moveEvent(map) {
      const mapCenter = map.getCenter();
      this.center = [mapCenter.lng, mapCenter.lat];
    },
  },
};
</script>

<style>
#map {
  width: 100%;
  height: 350px;
  border-radius: 5px;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib,
.mapboxgl-ctrl-logo {
  display: none !important;
}
.saveButtonWrapper {
  display: flex;
  align-items: center;
}
</style>

// INSERT INTO geometries (pid, geom) VALUES (175, ST_GeomFromGeoJSON('')); // 175 pid //
