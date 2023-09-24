import { defineConfig } from 'tsup'
import config from './package.json'

const devMode = process.env['DEV'] === 'true'

export default defineConfig({
  name: config.name,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  platform: 'browser',
  treeshake: true,
  sourcemap: true,
  clean: true,
  minifyIdentifiers: false,
  minifySyntax: true,
  minifyWhitespace: false,
  pure: devMode ? [] : ['console.log', 'console.info', 'console.debug']
})
