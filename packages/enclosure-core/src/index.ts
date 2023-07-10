import { loggerKey, Communicator, type CommunicateConfig } from '@passerelle/core'
import { assertNotNil } from 'type-assurer'

export { loggerKey, type Communicator, type CommunicateConfig }

export function createCommunicator(
  iframe: HTMLIFrameElement,
  config: CommunicateConfig
): Communicator {
  assertNotNil(iframe.contentWindow, 'iframe.contentWindow is null')

  const onLayoutChanged = () => {
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

  const observer = new ResizeObserver(onLayoutChanged)

  const communicator = new Communicator(iframe.contentWindow, {
    ...config,
    onInit() {
      iframe.addEventListener('load', () => {
        observer.observe(iframe)
        window.addEventListener('resize', onLayoutChanged)
      })
      config.onInit?.call(this)
    },
    onDestroy() {
      observer.unobserve(iframe)
      window.removeEventListener('resize', onLayoutChanged)
      config.onDestroy?.call(this)
    }
  })

  return communicator
}
