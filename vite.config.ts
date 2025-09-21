import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// 复制JSON文件的插件
function copyJsonFiles() {
  return {
    name: 'copy-json-files',
    writeBundle() {
      const srcDir = 'src/assets/page_data'
      const destDir = 'docs/src/assets/page_data'

      // 递归复制目录
      function copyDir(src: string, dest: string) {
        if (!existsSync(dest)) {
          mkdirSync(dest, { recursive: true })
        }

        const files = readdirSync(src)

        files.forEach((file: string) => {
          const srcPath = join(src, file)
          const destPath = join(dest, file)

          if (statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath)
          } else if (file.endsWith('.json')) {
            copyFileSync(srcPath, destPath)
          }
        })
      }

      copyDir(srcDir, destDir)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), copyJsonFiles()],
  build: {
    outDir: 'docs',
  },
  base: '/ghost-huang/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
