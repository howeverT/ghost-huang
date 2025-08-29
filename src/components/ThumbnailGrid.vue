<template>
  <div class="thumbnail-section">
    <div class="thumbnail-container">
      <div v-for="(row, rowIndex) in thumbnailRows" :key="rowIndex" class="thumbnail-row">
        <div
          v-for="(item, itemIndex) in row"
          :key="itemIndex"
          class="thumbnail-item"
          @click="handleItemClick(item)"
        >
          <div
            class="thumbnail-image"
            :style="{
              backgroundImage: `url(${item.image})`,
              height: dynamicImageHeight,
            }"
          ></div>
          <div class="thumbnail-title">
            {{ item.title }}
            <svg class="title-arrow" viewBox="0 0 31 40" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.974 40L0 29.04 9.052 20 0 10.96 10.974 0 31 20 10.974 40zm-9.27-10.96l9.27 9.258L29.296 20 10.974 1.702l-9.27 9.257L10.757 20l-9.053 9.04z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ThumbnailItem {
  image: string
  title: string
  link?: string
}

interface Props {
  items?: ThumbnailItem[]
  itemsPerRow?: number
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { image: '/src/assets/background/Beijing-day1.jpg', title: '北京一日游' },
    { image: '/src/assets/background/Beijing-day2.jpg', title: '北京二日游' },
    { image: '/src/assets/background/Guangzhou.jpg', title: '广州之旅' },
    { image: '/src/assets/background/Chengdu.jpg', title: '成都印象' },
    { image: '/src/assets/background/History2024.jpg', title: '历史回顾' },
    { image: '/src/assets/background/background.jpg', title: '精彩瞬间' },
  ],
  itemsPerRow: 3,
})

// 将items分组为行
const thumbnailRows = computed(() => {
  const rows = []
  for (let i = 0; i < props.items.length; i += props.itemsPerRow) {
    rows.push(props.items.slice(i, i + props.itemsPerRow))
  }
  return rows
})

// 根据每行显示数量动态计算图片高度
const dynamicImageHeight = computed(() => {
  const itemsPerRow = props.itemsPerRow || 3
  const isMobile = window.innerWidth <= 768
  const isSmallMobile = window.innerWidth <= 480

  if (isSmallMobile) {
    // 小手机端
    if (itemsPerRow === 1) return '250px'
    if (itemsPerRow === 2) return '200px'
    if (itemsPerRow === 3) return '180px'
  } else if (isMobile) {
    // 平板端
    if (itemsPerRow === 1) return '400px'
    if (itemsPerRow === 2) return '300px'
    if (itemsPerRow === 3) return '250px'
  } else {
    // 桌面端
    if (itemsPerRow === 1) return '800px' // 2个item，每行1个
    if (itemsPerRow === 2) return '600px' // 4个item，每行2个
    if (itemsPerRow === 3) return '400px' // 6个item，每行3个
  }

  return '350px' // 默认值
})

// 处理缩略图点击
const handleItemClick = (item: ThumbnailItem) => {
  if (item.link) {
    window.open(item.link, '_blank')
  }
}
</script>

<style scoped>
.thumbnail-section {
  width: 100%;
  background-color: #f8f9fa;
  padding: 4rem 0;
  flex-shrink: 0;
}

.thumbnail-container {
  width: 100%;
  padding: 0;
}

.thumbnail-row {
  display: flex;
  width: 100%;
  margin-bottom: 0;
}

.thumbnail-row:last-child {
  margin-bottom: 0;
}

.thumbnail-item {
  flex: 1;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.thumbnail-item:hover {
  transform: scale(1.02);
}

.thumbnail-image {
  width: 100%;
  background-size: cover;
  background-position: center 30%;
  background-repeat: no-repeat;
  position: relative;
}

.thumbnail-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem 1.5rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  text-align: left;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.2) 80%,
    transparent 100%
  );
}

.title-arrow {
  margin-left: 0.5rem;
  width: 1.2em;
  height: 1.2em;
  vertical-align: middle;
  fill: white;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .thumbnail-title {
    font-size: 1.3rem;
    padding: 1.5rem 1rem 1rem;
  }
}

@media (max-width: 480px) {
  .thumbnail-title {
    font-size: 1.2rem;
    padding: 1rem 0.8rem 0.8rem;
  }
}
</style>
