# Ghost Huang - GitHub Pages 部署

## 部署状态

✅ 已配置为使用 `docs` 文件夹部署到 GitHub Pages

## 访问地址

- 主页: https://howevert.github.io/ghost-huang/
- 历史页面: https://howevert.github.io/ghost-huang/history
- 合集页面: https://howevert.github.io/ghost-huang/collection/haoshengyin
- 相关账号: https://howevert.github.io/ghost-huang/related

## 文件说明

- `index.html` - 主页面文件，包含SPA路由处理脚本
- `404.html` - 处理Vue Router的history模式路由
- `assets/` - 静态资源文件夹
- `favicon.ico` - 网站图标

## 技术细节

- 使用Vue 3 + Vite构建
- 配置base路径为 `/ghost-huang/`
- 支持SPA路由，所有路由都会重定向到index.html
- 资源路径已正确配置为绝对路径

## 更新步骤

1. 运行 `npm run build` 构建项目
2. 提交 `docs` 文件夹中的所有文件
3. 推送到GitHub，GitHub Pages会自动更新
