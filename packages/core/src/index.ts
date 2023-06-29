type JsonObject = {[Key in string]: Json} & {[Key in string]?: Json | undefined};

type JsonArray = Json[] | readonly Json[];

type JsonPrimitive = string | number | boolean | null;

type Json = JsonPrimitive | JsonObject | JsonArray;

export type Message = InitMessage | SendDataMessage | SyncPathMessage

export type MessageType = Message['type']

export interface InitMessage {
  type: 'init',
  key: symbol
}

export interface SendDataMessage<S extends Json = Json> {
  type: 'data',
  [k: symbol]: S
}

export interface SyncPathMessage {
  type: 'sync',
  [k: symbol]: {
    path: string
  }
}

export interface CommunicateConfig {
  origin: string
}

class Communicator {


  constructor(
    private readonly window: Window,
    private readonly config: CommunicateConfig
  ) { }

  private init(): void {
    this.window.addEventListener('message', (event) => {

    })
  }

  send<T extends Json>(data: T): void {

  }

  addReceiver<T extends Json>(callback: (received: T) => void): void {

  }

  removeReceiver(callback: (received: any) => void): void {

  }
}

class Messenger {
  private readonly communicator: Communicator

  constructor(
    private readonly window: Window,
    private readonly config: CommunicateConfig
  ) {
    this.communicator = new Communicator(window, config)
  }

  sync(path: string): void {
  }

  send<T extends Json>(data: T): void {

  }

  addReceiver<T extends Json>(callback: (received: T) => void): void {

  }
}
