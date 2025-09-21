import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// 复制静态资源的插件
function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    writeBundle() {
      const srcDir = 'src/assets'
      const destDir = 'docs/src/assets'

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
          } else if (
            file.endsWith('.json') ||
            file.endsWith('.jpg') ||
            file.endsWith('.jpeg') ||
            file.endsWith('.png') ||
            file.endsWith('.gif') ||
            file.endsWith('.svg') ||
            file.endsWith('.webp')
          ) {
            copyFileSync(srcPath, destPath)
          }
        })
      }

      copyDir(srcDir, destDir)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 根据环境设置base路径
  const base = mode === 'development' ? '/' : '/ghost-huang/'

  return {
    plugins: [vue(), vueDevTools(), copyStaticAssets()],
    build: {
      outDir: 'docs',
    },
    base,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
