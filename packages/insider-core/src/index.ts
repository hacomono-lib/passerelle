import {
  loggerKey,
  Communicator,
  type CommunicateConfig,
  type NavigateMessage,
  type HrefMessage,
  type LayoutMetrix,
  type MessageKey
} from '@passerelle/core'
import { assertNotNil } from 'type-assurer'

export {
  loggerKey,
  type Communicator,
  type CommunicateConfig,
  type NavigateMessage,
  type HrefMessage,
  type LayoutMetrix,
  type MessageKey
}

export function createCommunicator(config: CommunicateConfig): Communicator {
  assertNotNil(parent)
  return new Communicator(parent, config)
}
