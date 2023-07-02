import type { Json } from './common'

export type Message = SendDataMessage | NavigateMessage | HrefMessage | LayoutMetrixMessage

export type MessageType = Message['type']

export interface MessageKey<_S extends Json = Json> extends String {}

/**
 * Send data message iframe
 * Receiving side gets data as an Event
 */
export interface SendDataMessage<S extends Json = Json> {
  /**
   * Message type
   */
  type: 'data'

  /**
   * Unique key to identify messages to be sent and received
   */
  key: MessageKey<S>

  /**
   * Data to be sent
   */
  value: S
}

/**
 * Navigate message iframe value
 */
export interface NavigateMessageValue {
  /**
   * Path to navigate to
   */
  path: string

  /**
   * Optional params to be passed to the path
   */
  params?: Record<string, string | number>
}

/**
 * Navigate message iframe
 * Receiving side navigates to the given path
 */
export interface NavigateMessage {
  /**
   * Message type
   */
  type: 'navigate'

  /**
   * Path to navigate to
   */
  value: NavigateMessageValue
}

/**
 * Href message iframe value
 */
export type HrefMessageValue = Partial<HTMLAnchorElement> & Pick<HTMLAnchorElement, 'href'>

/**
 * Href message iframe
 * Receiving side navigates to the given path
 */
export interface HrefMessage {
  /**
   * Message Type
   */
  type: 'href'

  /**
   * Path to navigate to
   */
  value: HrefMessageValue
}

export interface LayoutMetrix {
  enclosure: {
    window: {
      width: number
      height: number
    }
  },
  insider: {
    window: {
      width: number
      height: number
    },
    offset: {
      top: number
      left: number
    }
  }
}

/**
 * Layout Metrix message iframe
 *
 * Receiving side gets sender's layout metrix.
 * This value is intended to be used in the calculation of the alignment of the overlay element displayed in the iframe.
 * e.g. modal
 */
export interface LayoutMetrixMessage {
  /**
   * Message Type
   */
  type: 'layout',

  /**
   * Layout Metrix
   */
  value: LayoutMetrix
}

const messageTypes: MessageType[] = ['data', 'navigate', 'href', 'layout']

export function isMessage(value: unknown): value is Message {
  return (
    !!value &&
    typeof value === 'object' &&
    messageTypes.includes((value as Message).type) &&
    !!(value as Message).value
  )
}
