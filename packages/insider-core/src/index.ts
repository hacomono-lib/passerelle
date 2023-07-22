import { loggerKey } from '@passerelle/lib'
import {
  Communicator as _Communicator,
  type CommunicateConfig,
  type NavigateMessage,
  type HrefMessage,
  type LayoutMetrix,
  type MessageKey
} from '@passerelle/core'
import { assertNotNil } from 'type-assurer'

export {
  type CommunicateConfig,
  type NavigateMessage,
  type HrefMessage,
  type LayoutMetrix,
  type MessageKey
}

export type Communicator = Omit<_Communicator, 'acknowledge'>

export function createCommunicator(config?: CommunicateConfig): Communicator {
  assertNotNil(parent)
  return new _Communicator(parent, config)
}
