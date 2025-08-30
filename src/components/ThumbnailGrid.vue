<template>
  <div class="thumbnail-section">
    <div class="carousel-container">
      <!-- 左箭头 -->
      <button
        class="carousel-arrow carousel-arrow-left"
        @click="previousSlide"
        :disabled="currentIndex === 0"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <!-- 相框容器 -->
      <div class="frames-container">
        <div class="frames-wrapper" :style="{ transform: `translateX(-${currentIndex * slideWidth}px)` }">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="frame-item"
            @click="handleItemClick(item)"
          >
            <div class="frame-border">
              <div class="frame-content">
                <div
                  class="frame-image"
                  :style="{
                    backgroundImage: `url(${item.image})`,
                  }"
                ></div>
                <div class="frame-title">
                  {{ item.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右箭头 -->
      <button
        class="carousel-arrow carousel-arrow-right"
        @click="nextSlide"
        :disabled="currentIndex >= maxIndex"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
        </svg>
      </button>
    </div>

    <!-- 指示器 -->
    <div class="carousel-indicators">
      <button
        v-for="(_, index) in items"
        :key="index"
        class="indicator"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      ></button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface ThumbnailItem {
  image: string
  title: string
  link?: string
}

interface Props {
  items?: ThumbnailItem[]
  itemsPerView?: number
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
  itemsPerView: 3,
})

const currentIndex = ref(0)
const slideWidth = ref(0)
const containerWidth = ref(0)

// 计算最大索引
const maxIndex = computed(() => {
  return Math.max(0, props.items.length - props.itemsPerView)
})

// 计算每个相框的宽度
const frameWidth = computed(() => {
  return containerWidth.value / props.itemsPerView
})

// 计算滑动距离
const slideWidthComputed = computed(() => {
  return frameWidth.value
})

// 更新尺寸
const updateDimensions = () => {
  const container = document.querySelector('.frames-container')
  if (container) {
    containerWidth.value = container.clientWidth
    slideWidth.value = slideWidthComputed.value
  }
}

// 下一张
const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  }
}

// 上一张
const previousSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// 跳转到指定幻灯片
const goToSlide = (index: number) => {
  currentIndex.value = index
}

// 处理缩略图点击
const handleItemClick = (item: ThumbnailItem) => {
  if (item.link) {
    window.open(item.link, '_blank')
  }
}

// 自动播放
let autoPlayInterval: number | null = null

const startAutoPlay = () => {
  autoPlayInterval = window.setInterval(() => {
    if (currentIndex.value >= maxIndex.value) {
      currentIndex.value = 0
    } else {
      currentIndex.value++
    }
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

onMounted(() => {
  updateDimensions()
  window.addEventListener('resize', updateDimensions)
  startAutoPlay()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions)
  stopAutoPlay()
})
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
  background-color: #f8f9fa;
  padding: 4rem 0;
  flex-shrink: 0;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.frames-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.frames-wrapper {
  display: flex;
  transition: transform 0.5s ease-in-out;
  gap: 2rem;
}

.frame-item {
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.frame-item:hover {
  transform: scale(1.05);
}

.frame-border {
  width: 400px;
  height: 300px;
  padding: 15px;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  border-radius: 15px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
}

.frame-border::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 2px solid #d0d0d0;
  border-radius: 10px;
  pointer-events: none;
}

.frame-content {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.frame-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.frame-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 1rem 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  text-align: center;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(0, 0, 0, 0.2) 80%,
    transparent 100%
  );
}

.carousel-arrow {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.carousel-arrow:hover:not(:disabled) {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.carousel-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-arrow svg {
  width: 24px;
  height: 24px;
  fill: #333;
}

.carousel-arrow-left svg {
  transform: translateX(-1px);
}

.carousel-arrow-right svg {
  transform: translateX(1px);
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: #999;
}

.indicator.active {
  background: #666;
  transform: scale(1.2);
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .carousel-container {
    max-width: 900px;
    gap: 1.5rem;
  }

  .frame-border {
    width: 350px;
    height: 260px;
  }
}

@media (max-width: 768px) {
  .carousel-container {
    max-width: 600px;
    gap: 1rem;
  }

  .frame-border {
    width: 300px;
    height: 225px;
  }

  .frames-wrapper {
    gap: 1rem;
  }

  .carousel-arrow {
    width: 40px;
    height: 40px;
  }

  .carousel-arrow svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    max-width: 400px;
    gap: 0.5rem;
  }

  .frame-border {
    width: 250px;
    height: 190px;
  }

  .frame-title {
    font-size: 1rem;
    padding: 1rem 0.8rem 0.8rem;
  }
}
</style>
