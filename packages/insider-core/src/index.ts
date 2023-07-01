export { loggerKey, type CommunicateConfig } from '@passerelle/core'
import { Communicator, type CommunicateConfig } from '@passerelle/core'
import { assertNotNil } from 'type-assurer'

export function createCommunicator(config: CommunicateConfig): Communicator {
  assertNotNil(parent)
  return new Communicator(parent, config)
}
