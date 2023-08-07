import {
  Communicator as _Communicator,
  type CommunicateConfig,
  type NavigateMessage,
  type HrefMessage,
  type LayoutMetrix,
  type MessageKey
} from '@passerelle/core'
import { assertNotNil } from 'type-assurer'
import { name } from '../package.json'

export {
  type CommunicateConfig,
  type NavigateMessage,
  type HrefMessage,
  type LayoutMetrix,
  type MessageKey
}

export type Communicator = Omit<_Communicator, 'acknowledge'>

export function createCommunicator(config?: CommunicateConfig): Communicator {
  const logPrefix = config?.logPrefix ?? `[${name}]`

  assertNotNil(parent)
  return new _Communicator(parent, {
    ...(config ?? {}),
    logPrefix,
  })
}
