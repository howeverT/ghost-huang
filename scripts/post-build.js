import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 读取构建后的index.html
const indexPath = path.join(__dirname, '../docs/index.html')
let indexContent = fs.readFileSync(indexPath, 'utf8')

// 添加SPA路由处理脚本
const spaScript = `
        <script type="text/javascript">
          // Single Page Apps for GitHub Pages
          // MIT License
          // https://github.com/rafgraph/spa-github-pages
          // This script checks to see if a redirect is present in the query string,
          // converts it back into the correct url and adds it to the
          // browser's history using window.history.replaceState(...),
          // which won't cause the browser to attempt to load the new url.
          // When the single page app is loaded further down in this file,
          // the correct url will be waiting in the browser's history for
          // the single page app to route accordingly.
          ;(function (l) {
            if (l.search[1] === '/') {
              var decoded = l.search
                .slice(1)
                .split('&')
                .map(function (s) {
                  return s.replace(/~and~/g, '&')
                })
                .join('?')
              window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash)
            }
          })(window.location)
        </script>`

// 检查是否已经包含SPA脚本
if (!indexContent.includes('Single Page Apps for GitHub Pages')) {
  // 在</head>标签前插入SPA脚本
  indexContent = indexContent.replace('</head>', `${spaScript}\n  </head>`)

  // 更新标题
  indexContent = indexContent.replace('<title>Vite App</title>', '<title>Ghost Huang</title>')

  // 写入文件
  fs.writeFileSync(indexPath, indexContent)
  console.log('✅ 已添加SPA路由处理脚本到index.html')
} else {
  console.log('ℹ️  index.html已包含SPA路由处理脚本')
}

// 复制index.html为404.html（更简洁的方法）
const fourOhFourPath = path.join(__dirname, '../docs/404.html')
fs.copyFileSync(indexPath, fourOhFourPath)
console.log('✅ 已复制index.html为404.html')
