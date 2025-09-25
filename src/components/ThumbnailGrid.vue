<template>
  <div class="thumbnail-section">
    <div class="content-container">
      <!-- 标题容器 -->
      <div v-if="title" class="title-container">
        <h2>{{ title }}</h2>
      </div>
      <!-- 瀑布流容器 -->
      <div class="waterfall-container">
        <div
          v-for="(item, index) in props.items"
          :key="index"
          class="parallax-item"
          @click="handleItemClick(item)"
        >
          <ParallaxCard
            :backgroundImage="getImagePath(item.image || '/src/assets/background/History2024.jpg')"
            :number="index + 1"
            :defaultHeight="600 + Math.random() * 300"
            class="gallery-card"
            rounded
          >
            <div class="card-caption">
              <h3>{{ item.title }}</h3>
            </div>
          </ParallaxCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getImagePath } from '@/utils/pathUtils'
import ParallaxCard from '@/components/Card/MiniCard/ParallaxCard.vue'

interface ThumbnailItem {
  image?: string
  title: string
  link?: string
}

interface Props {
  items?: ThumbnailItem[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { image: getImagePath('/src/assets/background/Beijing-day1.jpg'), title: '北京一日游' },
    { image: getImagePath('/src/assets/background/Beijing-day2.jpg'), title: '北京二日游' },
    { image: getImagePath('/src/assets/background/Guangzhou.jpg'), title: '广州之旅' },
    { image: getImagePath('/src/assets/background/Chengdu.jpg'), title: '成都印象' },
    { image: getImagePath('/src/assets/background/History2024.jpg'), title: '历史回顾' },
    { image: getImagePath('/src/assets/background/background.jpg'), title: '精彩瞬间' },
  ],
  title: '',
})

// 处理缩略图点击
const handleItemClick = (item: ThumbnailItem) => {
  if (item.link) {
    window.open(item.link, '_blank')
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.thumbnail-section {
  width: 100%;
  padding: 2rem 1rem;
  flex-shrink: 0;
}

.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-container {
  margin-bottom: 2rem;
  width: 100%;
  max-width: calc(100vw - 3rem);
  display: flex;
  justify-content: center;
}

.title-container h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.waterfall-container {
  max-width: calc(100vw - 3rem);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.parallax-item {
  flex: 0 0 calc(25% - 1.125rem);
  min-width: 500px;
  max-width: 600px;
  position: relative;
  cursor: pointer;
  transition: all 0.5s ease;
  opacity: 1;
  transform: translateY(0);
  margin-bottom: 2rem;
}

.parallax-item:hover {
  transform: translateY(-5px);
}

.gallery-card {
  width: 100% !important;
  margin: 0 !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
}

/* 覆盖ParallaxCard的默认样式，确保卡片占满列宽 */
.gallery-card :deep(.parallax-card) {
  margin: 0 !important;
  width: 100% !important;
  max-width: none !important;
  min-width: 0 !important;
}

.card-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(0, 0, 0, 0.3) 80%,
    transparent 100%
  );
}

.card-caption h3 {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* 响应式布局 */
@media (min-width: 1800px) {
  .title-container,
  .waterfall-container {
    max-width: calc(100vw - 4rem);
  }
}

@media (min-width: 1600px) and (max-width: 1799px) {
  .title-container,
  .waterfall-container {
    max-width: calc(100vw - 4rem);
  }
}

@media (max-width: 1400px) {
  .title-container,
  .waterfall-container {
    max-width: calc(100vw - 3rem);
  }
}

@media (max-width: 1200px) {
  .title-container,
  .waterfall-container {
    max-width: calc(100vw - 2rem);
  }

  .title-container h2 {
    font-size: 2.2rem;
  }

  .parallax-item {
    flex: 0 0 calc(33.333% - 1rem);
    min-width: 450px;
    max-width: 550px;
  }
}

@media (max-width: 768px) {
  .title-container,
  .waterfall-container {
    max-width: calc(100vw - 1.5rem);
  }

  .title-container h2 {
    font-size: 2rem;
  }

  .parallax-item {
    flex: 0 0 calc(50% - 0.75rem);
    min-width: 400px;
    max-width: 500px;
  }
}

@media (max-width: 480px) {
  .title-container,
  .waterfall-container {
    max-width: 100%;
  }

  .title-container h2 {
    font-size: 1.8rem;
  }

  .parallax-item {
    flex: 0 0 100%;
    min-width: 300px;
    max-width: none;
  }

  .card-caption h3 {
    font-size: 1rem;
  }
}
</style>
