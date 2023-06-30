export interface LocationCompose {
  /**
   * # から始まる URL のフラグメント識別子（fragment identifier）を含む。
   */
  readonly hash: string

  /**
   * ホスト名とポート番号を含む。
   */
  readonly host: string

  /**
   * ホスト名を含む。
   */
  readonly hostname: string

  /**
   * プロトコル、ホスト名、ポート番号を含む。
   */
  readonly origin: string

  /**
   * URL のパスを含む。
   */
  readonly pathname: string

  /**
   * ポート番号を含む。
   */
  readonly port: string

  /**
   * プロトコルを含む。
   */
  readonly protocol: string

  /**
   * ? から始まる URL のクエリ文字列を含む。
   */
  readonly search: string
}

function locationClient(): LocationCompose {
  return {
    get hash() {
      return window.location.hash
    },
    get host() {
      return window.location.host
    },
    get hostname() {
      return window.location.hostname
    },
    get origin() {
      return window.location.origin
    },
    get pathname() {
      return window.location.pathname
    },
    get port() {
      return window.location.port
    },
    get protocol() {
      return window.location.protocol
    },
    get search() {
      return window.location.search
    }
  }
}

function locationServer(): LocationCompose {
  const nuxt = useNuxtApp()
  const req = ensureNotNil(nuxt.ssrContext?.event.node.req)
  const urlString = req.headers.referer ?? `http${isDev() ? '' : 's'}://${req.headers.host}`
  const url = new URL(urlString)

  return {
    get hash() {
      return url.hash
    },
    get host() {
      return url.host
    },
    get hostname() {
      return url.hostname
    },
    get origin() {
      return url.origin
    },
    get pathname() {
      return url.pathname
    },
    get port() {
      return url.port
    },
    get protocol() {
      return url.protocol
    },
    get search() {
      return url.search
    }
  }
}

export function useLocation(): LocationCompose {
  return process.server ? locationServer() : locationClient()
}
