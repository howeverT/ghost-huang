# GitHub Pages 部署检查清单

## 问题诊断

### 1. URL 路径问题

- ❌ 错误URL: `https://howevert.github.io/concert/universe/beijing`
- ✅ 正确URL: `https://howevert.github.io/ghost-huang/concert/universe/beijing`

**原因**: GitHub Pages项目页面的base路径是 `/ghost-huang/`，不是根路径。

### 2. 必需文件检查

- ✅ `docs/index.html` - 主页面，包含SPA路由处理脚本
- ✅ `docs/404.html` - 处理直接访问路由的404重定向
- ✅ `docs/.nojekyll` - 禁用Jekyll处理
- ✅ `docs/assets/` - 静态资源文件夹

### 3. 配置检查

- ✅ Vite base路径: `/ghost-huang/`
- ✅ Vue Router base路径: `import.meta.env.BASE_URL`
- ✅ 输出目录: `docs`

## 测试步骤

### 1. 本地测试

```bash
npm run build
npm run preview
```

访问: `http://localhost:4173/ghost-huang/`

### 2. GitHub Pages测试

1. 提交所有文件到GitHub
2. 等待GitHub Pages构建完成（通常需要1-2分钟）
3. 测试以下URL：
   - `https://howevert.github.io/ghost-huang/` ✅
   - `https://howevert.github.io/ghost-huang/related` ✅
   - `https://howevert.github.io/ghost-huang/concert/universe/beijing` ✅

### 3. 直接访问测试

访问: `https://howevert.github.io/ghost-huang/concert/universe/beijing`

- 应该自动重定向到主页面并显示正确内容
- 不应该显示404错误

## 常见问题

### 问题1: 访问根路径显示404

**原因**: 访问了错误的URL
**解决**: 使用正确的URL: `https://howevert.github.io/ghost-huang/`

### 问题2: 直接访问子路由显示404

**原因**: 缺少404.html文件或配置错误
**解决**: 确保404.html文件存在且配置正确

### 问题3: 页面空白

**原因**: 资源路径错误或base路径配置错误
**解决**: 检查Vite配置和资源路径

## 部署命令

```bash
# 构建项目
npm run build

# 提交到GitHub
git add .
git commit -m "Fix GitHub Pages deployment"
git push origin main
```
