

export type Sanitizable = any

export interface InitMessage {
  type: 'init',
  key: symbol
}

export interface SendDataMessage<S extends Sanitizable = Sanitizable> {
  type: 'data',
  [k: symbol]: S
}

export interface SyncPathMessage {
  type: 'sync',
  [k: symbol]: {
    path: string
  }
}
