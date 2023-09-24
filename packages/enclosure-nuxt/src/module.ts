import { defineNuxtModule, addImports, addComponent, createResolver } from '@nuxt/kit'
import { name } from '../package.json'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name
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
