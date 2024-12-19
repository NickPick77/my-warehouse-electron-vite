import { resolve, join } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
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
      minify: true,
      cssMinify: true,
      rollupOptions: {
        input: resolve(__dirname, join('src','renderer','index.html')),
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
