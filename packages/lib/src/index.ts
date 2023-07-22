export function isSSR() {
  return typeof window === 'undefined'
}

export const loggerKey = '[passerelle]'
