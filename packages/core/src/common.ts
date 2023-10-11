export { name } from '../package.json'

export type JsonObject = { [Key: string]: Json | undefined }

export type JsonArray = Json[] | readonly Json[]

export type JsonPrimitive = string | number | boolean | null

export type Json = JsonPrimitive | JsonObject | JsonArray

export function isLocalhost(origin: string): boolean {
  return origin.startsWith('localhost:') || /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(origin)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function omitNil<T extends Record<string, any>>(obj: T): T {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key as keyof T] = value
    }
    return acc
  }, {} as T)
}

export const logScope = 'core :'
