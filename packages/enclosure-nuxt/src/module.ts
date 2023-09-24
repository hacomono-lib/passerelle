import { defineNuxtModule, addImports, addComponent, createResolver } from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@passerelle/enclosure-nuxt'
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(__dirname)

    addComponent({
      filePath: '@passerelle/enclosure-vue/src/components/BridgeFrame.vue',
      name: 'BridgeFrame',
      island: false
    })

    addImports({
      name: 'useIframeBridge',
      from: '@passerelle/enclosure-vue/src/composables/useIframeBridge.ts'
    })
  }
})
