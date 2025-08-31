# TabbedContentSection 组件使用说明

## 组件概述

`TabbedContentSection` 是一个新的Vue 3组件，具有左侧横向tabs和右侧背景图片的简洁布局设计。

## 组件特性

- **左侧横向Tabs**: 简洁的横向标签页（Part 1, Part 2, Part 3）
- **水墨笔迹指示器**: 选中的标签下方有一条优雅的水墨笔迹横线
- **右侧背景图片**: 根据选中的标签动态切换背景图片
- **简洁黑字设计**: 所有文字都是黑色，无背景色和装饰框
- **响应式设计**: 支持移动端和桌面端
- **平滑动画**: 标签切换时的淡入淡出效果

## 设计风格

- **极简主义**: 去除所有不必要的背景色、阴影和装饰框
- **水墨风格**: 选中的标签下方有水墨笔迹效果的横线
- **黑字展示**: 所有文字都是黑色，保持简洁统一
- **横向布局**: Tabs采用横向排列，节省垂直空间

## 使用方法

### 基本使用

```vue
<template>
  <TabbedContentSection />
</template>

<script setup lang="ts">
import TabbedContentSection from '@/components/TabbedContentSection.vue'
</script>
```

### 自定义数据

```vue
<template>
  <TabbedContentSection :tabs="customTabs" />
</template>

<script setup lang="ts">
import TabbedContentSection from '@/components/TabbedContentSection.vue'

const customTabs = [
  {
    id: 'custom1',
    label: '自定义标签1',
    backgroundImage: '/path/to/image1.jpg',
    imageTitle: '自定义标题1',
    imageCaption: '自定义描述1',
    items: [
      { title: '链接项目1', url: 'https://example.com' },
      { title: '链接项目2', url: 'https://example.com' }
    ]
  }
  // ... 更多标签
]
</script>
```

## 数据结构

### TabItem 接口

```typescript
interface TabItem {
  id: string                    // 标签唯一标识
  label: string                 // 标签显示文本
  items: {                      // 标签内容项（链接列表）
    title: string               // 链接标题
    url: string                 // 链接地址
  }[]
  backgroundImage: string       // 背景图片路径
  imageTitle?: string           // 图片标题（可选）
  imageCaption?: string         // 图片描述（可选）
}
```

## 默认数据

组件包含三个预设的标签页：

1. **Part 1**: 北京印象 - 第一天
   - 故宫博物院
   - 天安门广场
   - 颐和园
   - 圆明园遗址

2. **Part 2**: 北京印象 - 第二天
   - 798艺术区
   - 三里屯
   - 南锣鼓巷
   - 什刹海

3. **Part 3**: 成都印象
   - 宽窄巷子
   - 大熊猫基地
   - 锦里古街
   - 春熙路

## 样式特点

### 水墨笔迹效果
- 选中的标签下方有一条渐变的水墨笔迹横线
- 横线有流动动画效果，模拟水墨扩散
- 颜色从深灰到浅灰再到深灰，营造水墨质感

### 简洁设计
- 无背景色、无阴影、无装饰框
- 所有文字都是黑色，保持视觉统一
- 悬停效果简单：文字变深、添加下划线、轻微右移

### 响应式布局
- 桌面端：左右分栏布局
- 移动端：上下堆叠布局
- 标签在小屏幕上自动换行

## 响应式断点

- **1024px以下**: 布局变为垂直排列
- **768px以下**: 调整内边距和字体大小
- **480px以下**: 标签换行，进一步优化移动端显示

## 注意事项

1. 确保背景图片路径正确
2. 图片建议尺寸：至少600x400像素
3. 标签ID必须唯一
4. 所有内容项都是链接，点击会在新标签页打开
5. 组件会自动处理标签切换的动画效果

## 在HistoryView中的使用

该组件已经在 `HistoryView.vue` 中实现，可以通过导航菜单的"考古区"访问。

## 文件位置

- 组件文件: `src/components/TabbedContentSection.vue`
- 使用页面: `src/views/HistoryView.vue`
- 说明文档: `TABBED_CONTENT_README.md`
