import { defineNuxtModule, addPlugin, addTemplate, addImports } from '@nuxt/kit'
import type { InsiderVueConfig } from '@passerelle/insider-vue'

// Module options TypeScript interface definition
export type ModuleOptions = Pick<InsiderVueConfig, 'origin' | 'key' | 'logPrefix'>

const DIRECTORY_NAME = 'passerelle'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@passerelle/inlosure-nuxt',
    configKey: 'passerelle'
  },
  defaults: {},
  setup(options, _nuxt) {
    const plugin = addTemplate({
      filename: `${DIRECTORY_NAME}/insider-plugin.ts`,
      write: true,
      getContents: () => `
import { insider } from '@passerelle/insider-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  nuxtApp.vueApp.use(insider, { router ${(() => {
    const optionsStr = Object.entries(options)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ')
    return optionsStr ? `, ${optionsStr}` : ''
  })()}})
})
`
    })

    addPlugin({
      src: plugin.dst,
      mode: 'client'
    })

    addImports({
      name: 'useCommunicator',
      from: '@passerelle/insider-vue/src/composables.ts'
    })
  }
})
