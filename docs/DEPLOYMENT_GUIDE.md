# GitHub Pages 部署指南

## 问题解决总结

### 1. 路由404问题 ✅ 已解决

**问题**: 直接访问子路由（如 `/concert/universe/ningbo`）时显示404
**原因**: GitHub Pages不支持Vue Router的history模式
**解决方案**:

- 复制 `index.html` 为 `404.html` 处理重定向
- 在 `index.html` 中添加SPA路由处理脚本
- 使用环境变量区分开发和生产环境的base路径

### 2. JSON文件404问题 ✅ 已解决

**问题**: JSON数据文件无法加载
**原因**: Vite构建时没有复制JSON文件到输出目录
**解决方案**:

- 创建Vite插件自动复制所有静态资源文件
- 包括JSON、图片、SVG等文件

### 3. 图片文件404问题 ✅ 已解决

**问题**: 背景图片等静态资源无法加载
**原因**: 图片文件没有被复制到构建目录
**解决方案**:

- 扩展Vite插件支持所有静态资源文件类型

## 当前配置

### 环境变量配置

- 开发环境: `base: '/'`
- 生产环境: `base: '/ghost-huang/'`
- 自动根据环境切换base路径

### Vite配置

- 动态base路径配置
- 输出目录: `docs`
- 自动复制静态资源插件

### 必需文件

- `docs/index.html` - 主页面，包含SPA路由处理
- `docs/404.html` - 复制自index.html，处理直接访问子路由的404重定向
- `docs/src/assets/` - 所有静态资源文件

### 自动构建脚本

- 构建后自动添加SPA路由处理脚本
- 自动复制index.html为404.html
- 自动复制所有静态资源文件

## 测试步骤

### 1. 本地测试

```bash
npm run dev
# 访问 http://localhost:5173/
```

### 2. 构建测试

```bash
npm run build
npm run preview
# 访问 http://localhost:4173/ghost-huang/
```

### 3. 部署测试

1. 提交代码到GitHub
2. 等待GitHub Pages构建完成
3. 测试以下URL：
   - `https://howevert.github.io/ghost-huang/` ✅
   - `https://howevert.github.io/ghost-huang/related` ✅
   - `https://howevert.github.io/ghost-huang/concert/universe/ningbo` ✅

### 4. 直接访问测试

- 直接访问子路由应该自动重定向到主页面并显示正确内容
- 刷新页面也应该正常工作

## 部署命令

```bash
# 构建项目
npm run build

# 提交到GitHub
git add .
git commit -m "Complete GitHub Pages deployment fix with SPA routing and static assets"
git push origin main
```

## 注意事项

- 确保GitHub Pages的Source设置为 "Deploy from a branch"
- 确保Branch设置为 "main"
- 确保Folder设置为 "/docs"
- 如果仍有问题，清除浏览器缓存并等待几分钟

## 技术细节

### History路由处理

- 使用 `createWebHistory(ROUTER_BASE)` 配置路由
- 通过环境变量动态设置base路径
- 404.html文件处理直接访问子路由的情况

### 静态资源处理

- Vite插件自动复制所有静态资源文件
- 支持JSON、图片、SVG等文件类型
- 保持原始目录结构
