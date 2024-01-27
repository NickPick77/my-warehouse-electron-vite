import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, splitVendorChunkPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), splitVendorChunkPlugin()],
    build: {
      minify: true,
      rollupOptions: {
        external: ['sqlite3']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin(), splitVendorChunkPlugin()],
    build: {
      minify: true
    }
  },
  renderer: {
    resolve: {
      alias: [
        {
          find: '@renderer',
          replacement: resolve('src/renderer/src')
        },
        { find: '@components', replacement: resolve('src/renderer/src/components') },
        { find: '@views', replacement: resolve('src/renderer/src/views') }
      ]
    },
    plugins: [vue(), splitVendorChunkPlugin()],
    build: {
      minify: true,
      cssMinify: true,
      rollupOptions: {
        input: resolve(__dirname, 'src/renderer/index.html'),
        output: {
          chunkFileNames: 'assets/chunk/[hash].js',
          entryFileNames: 'assets/entry/index.js',
          assetFileNames: 'assets/[ext]/[hash].[ext]'
        }
      }
    }
  }
})
