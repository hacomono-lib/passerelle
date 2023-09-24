import baseConfig from '../../../tsconfig.json'

export default defineNuxtConfig({
  modules: ['../src/module'],
  srcDir: './src',
  css: ['~/assets/css/main.css'],

  passerelle: {
    key: 'passerelle-playground'
  },

  typescript: {
    tsConfig: {
      compilerOptions: baseConfig.compilerOptions
    }
  }
})
