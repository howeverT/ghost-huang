# 页面模块化组件使用说明

本项目已将原来的5层div结构模块化，创建了5个可复用的Vue组件，您可以根据需要自由拼接使用。

## 组件列表

### 1. HeroSection.vue - 全屏背景区域

**功能**: 全屏背景图片 + 大标题文字
**Props**:

- `backgroundImage`: 背景图片路径
- `title`: 标题文字
- `titleAlign`: 标题对齐方式 ('left' | 'center' | 'right')
- `titleMargin`: 标题右边距

**使用示例**:

```vue
<HeroSection
  background-image="/src/assets/background/background.jpg"
  title="音乐会"
  title-align="center"
  title-margin="0"
/>
```

### 2. ContentSection.vue - 内容介绍区域

**功能**: 白色背景 + 标题 + 段落文字
**Props**:

- `title`: 区域标题
- `paragraphs`: 段落文字数组

**使用示例**:

```vue
<ContentSection title="欢迎来到音乐会" :paragraphs="['第一段介绍文字...', '第二段介绍文字...']" />
```

### 3. OverlapSection.vue - 错层叠放区域

**功能**: 白色容器 + 右侧黑色文字区域 + 左侧叠放图片
**Props**:

- `title`: 黑色区域标题
- `content`: 黑色区域内容文字
- `imageUrl`: 左侧图片路径

**使用示例**:

```vue
<OverlapSection
  title="音乐文化"
  content="音乐是人类情感的表达..."
  image-url="/src/assets/background/image.jpg"
/>
```

### 4. TitleSection.vue - 标题文字区域

**功能**: 白色背景 + 大段标题文字
**Props**:

- `titleText`: 标题文字内容

**使用示例**:

```vue
<TitleSection title-text="Music is the universal language of mankind..." />
```

### 5. ThumbnailGrid.vue - 缩略图网格区域

**功能**: 浅灰背景 + 动态数量的缩略图网格
**Props**:

- `items`: 缩略图数据数组，每个item包含 `image` 和 `title`
- `itemsPerRow`: 每行显示的缩略图数量（默认3）

**使用示例**:

```vue
<ThumbnailGrid :items="thumbnailItems" :items-per-row="3" />

// 数据格式 const thumbnailItems = [ { image: '/path/to/image1.jpg', title: '标题1' }, { image:
'/path/to/image2.jpg', title: '标题2' }, // ... ]
```

## 布局特点

### 响应式设计

- 所有组件都支持响应式设计
- 在不同设备上自动调整字体大小、间距等
- 支持平板和手机端优化

### Flex布局

- 所有组件都使用flex布局
- 支持垂直排列和水平排列
- 便于后续移动端适配

### 动态数量支持

- ThumbnailGrid组件支持动态数量的缩略图
- 自动根据数量调整行数和每行显示数量
- 支持2-6个或更多缩略图的灵活显示

## 使用建议

### 1. 自由组合

您可以根据需要选择任意组件进行组合，不一定要使用全部5个组件。

### 2. 自定义内容

每个组件都支持通过props自定义内容，包括文字、图片、样式等。

### 3. 样式调整

如果需要调整样式，可以直接修改对应组件的CSS，或者通过CSS变量进行主题定制。

### 4. 扩展功能

每个组件都可以根据需求进行功能扩展，比如添加动画、交互效果等。

## 示例页面

参考 `src/views/ConcertView.vue` 文件，展示了如何使用这些组件创建一个完整的页面。

## 注意事项

1. 确保图片路径正确
2. 组件按顺序使用时，建议保持原有的垂直排列顺序
3. 可以根据需要调整组件的间距和高度
4. 所有组件都支持TypeScript类型检查
