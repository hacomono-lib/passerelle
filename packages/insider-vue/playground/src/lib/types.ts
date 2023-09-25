import type { InjectionKey } from 'vue'

export interface Log {
  time: string
  event: string
  key?: string
  value: object
}

export const logKey: InjectionKey<Log[]> = Symbol('log')
