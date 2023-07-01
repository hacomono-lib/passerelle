export { loggerKey, type CommunicateConfig } from '@passerelle/core'
import { Communicator, type CommunicateConfig } from '@passerelle/core'
import { assertNotNil } from 'type-assurer'

export function createCommunicator(iframe: HTMLIFrameElement, config: CommunicateConfig): Communicator {
  assertNotNil(iframe.contentWindow, 'iframe.contentWindow is null')
  return new Communicator(iframe.contentWindow, config)
}
