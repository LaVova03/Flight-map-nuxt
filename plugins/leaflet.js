import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('leaflet', L);
});
