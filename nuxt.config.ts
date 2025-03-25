// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  plugins: [{ src: "~/plugins/leaflet.js", mode: "client" }],
  runtimeConfig: {
    public: {
      STADIA_MAPS_API_KEY: process.env.NUXT_PUBLIC_STADIA_MAPS_API_KEY,
    },
  },
});
