import { defineConfig } from 'tsup'
import config from './package.json'

export default defineConfig({
  name: config.name,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  treeshake: true,
  sourcemap: true,
  clean: true
})
