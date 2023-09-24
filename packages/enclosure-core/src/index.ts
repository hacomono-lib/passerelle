import { Communicator as _Communicator } from '@passerelle/core'
import type { CommunicateConfig } from '@passerelle/core'
import { assertNotNil } from 'type-assurer'
import { name } from '../package.json'

export type {
  CommunicateConfig,
  HrefMessage,
  NavigateMessage,
  MessageKey,
  SendDataMessage,
  Json
} from '@passerelle/core'

export type Communicator = Omit<_Communicator, 'requestCollab' | 'sendLayout'>

export function createCommunicator(
  iframe: HTMLIFrameElement,
  config?: CommunicateConfig
): Communicator {
  assertNotNil(iframe.contentWindow, 'iframe.contentWindow is null')

  const sendLayout = () => {
    communicator.sendLayout({
      window: {
        width: iframe.offsetWidth,
        height: iframe.offsetHeight
      },
      offset: {
        top: iframe.offsetTop,
        left: iframe.offsetLeft
      }
    })
  }

  const observer = new ResizeObserver(sendLayout)

  const logPrefix = config?.logPrefix ?? `[${name}]`

  const communicator = new _Communicator(iframe.contentWindow, {
    ...(config ?? {}),
    logPrefix,
    onInit() {
      iframe.addEventListener('load', async () => {
        if (!(await communicator.requestCollab())) {
          console.warn(logPrefix, 'enclosure-core: collab failed')
          return
        }

        // send first layout
        sendLayout()

        // start observer
        observer.observe(iframe)
        window.addEventListener('resize', sendLayout)
      })
      config?.onInit?.call(this)
    },
    onDestroy() {
      // stop observer
      observer.unobserve(iframe)
      window.removeEventListener('resize', sendLayout)

      config?.onDestroy?.call(this)
    }
  })

  return communicator
}
