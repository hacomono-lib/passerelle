import { defineNuxtModule, addPlugin, addTemplate, addImports } from '@nuxt/kit'
import type { InsiderVueConfig } from '@passerelle/insider-vue'
import { name } from '../package.json'

// Module options TypeScript interface definition
export type ModuleOptions = Pick<InsiderVueConfig, 'origin' | 'key' | 'logPrefix'>

const DIRECTORY_NAME = 'passerelle'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    configKey: 'passerelle'
  },
  defaults: {
    origin: '*',
    logPrefix: `[${name}]`,
    key: 'default'
  },
  setup(options, _nuxt) {
    const plugin = addTemplate({
      filename: `${DIRECTORY_NAME}/insider.client.ts`,
      write: true,
      getContents: () => `
import { insider, createCommunicator } from '@passerelle/insider-vue'

const communicator = createCommunicator({
  ${(() =>
    Object.entries(options)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(',\n'))()}
})

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  nuxtApp.vueApp.use(insider, { router, communicator })
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
