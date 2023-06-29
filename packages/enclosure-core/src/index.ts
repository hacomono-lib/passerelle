type Sanitizable = any;


interface EnclosureConfig {
  origin: string
}

export interface Message<T extends Sanitizable> {

  data: T
}

export class EnclosureContext {
  private map = new Map<string, HTMLIFrameElement>()

  constructor(private readonly config: EnclosureConfig) { }

  regist(key: string, iframe: HTMLIFrameElement): void {
    if (!this.map) {
      this.map = new Map()
    }

    if (this.map.has(key)) {
      console.warn(`[enclosure-core] iframe with key ${key} already exists.`)
      return
    }

    this.map.set(key, iframe)
  }

  send<T extends Sanitizable>(key: string, data: T): void {
    const iframe = this.map.get(key)
    if (!iframe) {
      console.warn(`[enclosure-core] iframe with key ${key} not found.`)
      return
    }

    if (!iframe.contentWindow || !iframe.contentWindow.postMessage) {
      console.warn(`[enclosure-core] iframe with key ${key} not ready.`)
      return
    }

    iframe.contentWindow.postMessage(data, this.config.origin)
  }
}
