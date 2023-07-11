import { createCommunicator, type CommunicateConfig, type Communicator } from '@passerelle/insider-core'

export function useCommunicator(config: CommunicateConfig = {}): Communicator {
  return createCommunicator(config)
}
