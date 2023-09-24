export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/devtools'],
  srcDir: './src',
  css: ['~/assets/css/main.css'],

  devtools: {
    enabled: true
  }
})
