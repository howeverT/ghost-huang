# src/assert和public的资源使用
这个问题问得特别关键 👍，很多人第一次用 Vue / Vite / Webpack 都会纠结：图片到底该放 public/ 还是 src/assets/？
我给你一个清晰的对比和速查表：

📂 src/assets/ —— 构建管道内的资源

特点：参与打包、优化、哈希命名

适合放：

组件里用到的图标、背景图、插画

会被 import、url() 或 <img src="./xxx.png"> 引用的资源

优势：

支持 按需加载 / tree-shaking

小图会自动转成 base64（减少请求）

大图会复制到 dist/assets/ 并生成带 hash 的名字（利于缓存刷新）

用法：

<script setup>
import logo from '@/assets/logo.png'
</script>

<template>
  <img :src="logo" alt="logo" />
</template>

📂 public/ —— 原样拷贝的静态资源

特点：不参与打包处理，构建时直接拷贝到 dist/

适合放：

favicon.ico、robots.txt、manifest.json

不会改名的外部资源（CDN、第三方脚本、字体文件）

很大的图片/视频/音频（不想被打包优化，直接走 URL 引用）

用法：

假设有 public/banner.png，最终路径就是 /banner.png

<template>
  <img src="/banner.png" alt="banner" />
</template>

🚀 速查表
放哪里	适合的情况
src/assets/	和代码强相关的资源，需要构建优化、缓存处理、按需加载的图片
public/	静态公共文件，不参与构建，路径固定的资源（favicon、第三方库、CDN、超大文件）

✅ 简单记：

和组件/UI 强绑定的 → 放 assets

纯静态/外部依赖 → 放 public
