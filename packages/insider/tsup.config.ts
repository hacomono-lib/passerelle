import { defineConfig, type Options } from 'tsup'
import config from './package.json'

const devMode = process.env['DEV'] === 'true'

const common = {
  name: config.name,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  treeshake: true,
  sourcemap: true,
  clean: true,
  minifyIdentifiers: false,
  minifySyntax: true,
  minifyWhitespace: false,
  pure: devMode ? [] : ['console.log', 'console.info', 'console.debug']
} satisfies Options

export default defineConfig([
  {
    ...common,
    dts: true
  },
  {
    ...common,
    target: 'es2015',
    noExternal: ['@passerelle/core'],
    outExtension({ format }) {
      return {
        js: `.es2015.${format === 'cjs' ? 'cjs' : 'js'}`
      }
    }
  },
  {
    ...common,
    minify: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    noExternal: ['@passerelle/core'],
    outExtension({ format }) {
      return {
        js: `.min.${format === 'cjs' ? 'cjs' : 'js'}`
      }
    }
  }
])
