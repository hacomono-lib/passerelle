import { Communicator as _Communicator } from '@passerelle/core'
import type { CommunicateConfig as _CommunicateCollab } from '@passerelle/core'
import { assertNotNil } from 'type-assurer'
import { name } from '../package.json'

export type {
  NavigateMessage,
  HrefMessage,
  LayoutMetrix,
  MessageKey,
  SendDataMessage,
  Json
} from '@passerelle/core'

export type Communicator = Omit<_Communicator, 'requestCollab' | 'sendLayout'>

export type CommunicateConfig = Omit<_CommunicateCollab, 'requiredCollab'>

export function createCommunicator(config?: CommunicateConfig): Communicator {
  const logPrefix = config?.logPrefix ?? `[${name}]`

  assertNotNil(parent)
  return new _Communicator(parent, {
    ...(config ?? {}),
    requireCollab: true,
    logPrefix
  })
}
