import { Communicator as _Communicator } from '@passerelle/core'
import type { CommunicateConfig } from '@passerelle/core'
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

const logPrefix = `[${name}]`

const logScope = 'enclosure-core :'

export function createCommunicator(
  iframe: HTMLIFrameElement,
  config: CommunicateConfig = {}
): Communicator {
  if (!iframe.contentWindow) throw new Error('iframe.contentWindow is null')

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

  const communicator = new _Communicator(iframe.contentWindow, {
    ...config,
    onInit() {
      iframe.addEventListener('load', async () => {
        if (!(await communicator.requestCollab())) {
          console.warn(logPrefix, logScope, 'collab failed')
          return
        }

        // send first layout
        sendLayout()

        // start observer
        observer.observe(iframe)
        window.addEventListener('resize', sendLayout)
      })
      config.onInit?.call(this)
    },
    onDestroy() {
      // stop observer
      observer.unobserve(iframe)
      window.removeEventListener('resize', sendLayout)

      config.onDestroy?.call(this)
    }
  })

  communicator.logPrefix = logPrefix

  return communicator
}
