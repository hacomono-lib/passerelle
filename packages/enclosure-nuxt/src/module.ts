import { defineNuxtModule, addImports, addComponent } from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@passerelle/enclosure-nuxt',
    configKey: 'enclosure'
  },
  defaults: {},
  setup(_options, _nuxt) {
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
