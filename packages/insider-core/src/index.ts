import { Communicator as _Communicator } from '@passerelle/core'
import type {
  CommunicateConfig as _CommunicateCollab,
  NavigateMessage,
  HrefMessage,
  LayoutMetrix,
  MessageKey
} from '@passerelle/core'
import { assertNotNil } from 'type-assurer'
import { name } from '../package.json'

export { type NavigateMessage, type HrefMessage, type LayoutMetrix, type MessageKey }

export type Communicator = Omit<_Communicator, 'requestCollab'>

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
