import { loggerKey, Communicator, type CommunicateConfig } from '@passerelle/core'
import { assertNotNil } from 'type-assurer'

export { loggerKey, type Communicator, type CommunicateConfig }

export function createCommunicator(config: CommunicateConfig): Communicator {
  assertNotNil(parent)
  return new Communicator(parent, config)
}
