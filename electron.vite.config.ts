import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      sourcemap: 'inline',
      minify: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      sourcemap: 'inline',
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
    plugins: [vue()],
    build: {
      sourcemap: 'inline',
      minify: true,
      cssMinify: true,
      rollupOptions: {
        external: ['better-sqlite3'],
        output: {
          chunkFileNames: 'assets/chunk/[hash].js',
          entryFileNames: 'assets/entry/index.js',
          assetFileNames: 'assets/[ext]/[hash].[ext]'
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  }
})
