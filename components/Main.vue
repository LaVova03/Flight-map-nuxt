<script setup>
import { ref, watch } from "vue";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import flight_data from "@/flight_data.json";
import Plane from "@/assets/img/plane.png";

const zoom = ref(12);
const center = ref([50.4501, 30.5234]);
const animation = ref(false);

const initialPosition = [50.4501, 30.5234];
const markerPosition = ref(initialPosition);
const rotation = ref(0);
let previousDirection = null;

let L;
const customIcon = ref(null);

if (typeof window !== "undefined") {
  import("leaflet").then((module) => {
    L = module.default;
    if (!L) return;
    customIcon.value = L.divIcon({
      className: "leaflet-rotation-icon",
      html: `<img src="${Plane}" style="width: 32px; height: 32px; transform: rotate(${rotation.value}deg);">`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  });
}

const updateMarkerPosition = (data) => {
  const radius = data.speed / 1000;
  const directionRad = (data.direction * Math.PI) / 180;

  const newLat = markerPosition.value[0] + radius * Math.cos(directionRad) * 0.01;
  const newLng = markerPosition.value[1] + radius * Math.sin(directionRad) * 0.01;
  markerPosition.value = [newLat, newLng];

  if (previousDirection !== null) {
    let diff = data.direction - previousDirection;

    if (Math.abs(diff) > 180) {
      if (diff > 0) {
        diff -= 360;
      } else {
        diff += 360;
      }
    }

    rotation.value += diff;
  }

  previousDirection = data.direction;

  customIcon.value = L.divIcon({
    className: "leaflet-rotation-icon",
    html: `<img src="${Plane}" style="width: 32px; height: 32px; transform: rotate(${rotation.value}deg);">`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

let currentIndex = 0;
let interval = null;

const startAnimation = () => {
  if (interval) clearInterval(interval);

  currentIndex = 0;
  interval = setInterval(() => {
    if (currentIndex >= flight_data.length) {
      clearInterval(interval);
      animation.value = false;
      return;
    }

    updateMarkerPosition(flight_data[currentIndex]);
    currentIndex++;
  }, 200);
};

watch(animation, (newValue) => {
  if (newValue) {
    startAnimation();
  } else {
    clearInterval(interval);
    currentIndex = 0;
    markerPosition.value = initialPosition;
  }
});

const toggleAnimation = () => {
  animation.value = !animation.value;
};
</script>

<template>
  <main>
    <LMap :zoom="zoom" :center="center" :useGlobalLeaflet="false">
      <LTileLayer
        :url="`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${
          useRuntimeConfig().public.STADIA_MAPS_API_KEY
        }`"
        layer-type="base"
        name="Stadia Maps Basemap"
      />

      <LMarker :lat-lng="markerPosition" :icon="customIcon" />
    </LMap>
    <button
      class="toggle-btn"
      :style="{
        backgroundColor: animation ? 'black' : 'yellow',
        color: animation ? 'white' : 'black',
      }"
      @click="toggleAnimation"
    >
      {{ animation ? "Стоп" : "Почати" }}
    </button>
  </main>
</template>

<style scoped>
#mapContainer {
  width: 100vw;
  height: 100vh;
}
</style>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

main {
  height: 100vh;
  width: 100vw;
}

.toggle-btn {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%);
  width: 100px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  z-index: 1000;
  transition: 200ms ease-out;

  &:hover {
    box-shadow: 0 0 10px blue;
  }
}

.leaflet-rotation-icon img {
  transition: transform 0.2s ease;
}
</style>
