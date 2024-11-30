import {defineConfig} from 'tsup'

export default defineConfig({
  splitting: false,
  minify: false,
  clean: true,
  shims: true,
  entry: {index: 'src/index.ts'},
  outDir: 'dist',
  format: ['esm'],
  sourcemap: true,
  dts: true
})
