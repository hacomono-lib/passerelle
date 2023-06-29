type Sanitizable = any;





export interface Message<T extends Sanitizable> {

  data: T
}

const mapKey = Symbol('enclosure-core--iframe-map')

class EnclosureContext {
  private readonly [mapKey] = new Map<string, HTMLIFrameElement>()

  constructor(private readonly config: EnclosureConfig) { }

  regist(iframeKey: string, iframe: HTMLIFrameElement): void {
    if (this[mapKey].has(iframeKey)) {
      console.warn(`[enclosure-core] iframe with key ${iframeKey} already exists.`)
      return
    }

    this[mapKey].set(iframeKey, iframe)
  }

  destroy(iframeKey: string): void {
    this[mapKey].delete(iframeKey)
  }

  send<T extends Sanitizable>(iframeKey: string, eventKey: string, data: T): void {
    const iframe = this[mapKey].get(iframeKey)
    if (!iframe) {
      console.warn(`[enclosure-core] iframe with key ${iframeKey} not found.`)
      return
    }

    if (!iframe.contentWindow || !iframe.contentWindow.postMessage) {
      console.warn(`[enclosure-core] iframe with key ${iframeKey} not ready.`)
      return
    }

    iframe.contentWindow.postMessage(data, this.config.origin)
  }


  addReceiver<T extends Sanitizable>(iframeKey: string, callback: (eventKey: string, received: T) => void): void {

  }

  removeReceiver(iframeKey: string, callback: (received: any) => void): void {

  }
}

export const enclo
