export type Mode = 'insider' | 'enclosure'

export type Tag = 'transition-log' | 'layout-viewer' | 'data-sender' | 'data-received-log'

export const tagSet = {
  insider: ['transition-log', 'layout-viewer', 'data-sender', 'data-received-log'],
  enclosure: ['transition-log', 'data-sender', 'data-received-log']
} as const satisfies Record<Mode, readonly Tag[]>

Object.freeze(tagSet)
