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
        <div class="frames-wrapper" :style="{ transform: `translateX(-${getSlidePosition(currentIndex)}px)` }">
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

// 计算最大索引 - 允许滑动到最后
// 计算最大索引 - 基于实际滑动距离动态计算
const maxIndex = computed(() => {
  const itemWidth = 512 // 32rem ≈ 512px
  const gapWidth = 32
  const displayWidth = containerWidth.value || 1200

  // 计算所有items的总宽度
  const totalWidth = props.items.length * itemWidth + (props.items.length - 1) * gapWidth

  // 计算最后一个位置
  const lastPosition = totalWidth - displayWidth

  // 计算需要点击几次才能到达最后位置
  const clicksNeeded = Math.ceil(lastPosition / (itemWidth + gapWidth))

  console.log(`Total width: ${totalWidth}px, Last position: ${lastPosition}px, Clicks needed: ${clicksNeeded}`)

  return clicksNeeded
})



// 计算滑动距离 - 每次滑动一个item的完整宽度
const slideWidthComputed = computed(() => {
  return 400 + 32 // item宽度 + gap
})

// 计算精确的滑动位置
const getSlidePosition = (index: number) => {
  const itemWidth = 512 // 32rem ≈ 512px
  const gapWidth = 32

  // 动态获取实际显示区域宽度
  const displayWidth = containerWidth.value || 1200

  // 动态计算所有items的总宽度
  const totalWidth = props.items.length * itemWidth + (props.items.length - 1) * gapWidth

  // 计算最后一个位置
  const lastPosition = totalWidth - displayWidth

  // 计算需要点击几次才能到达最后位置
  const clicksNeeded = Math.ceil(lastPosition / (itemWidth + gapWidth))

  let position
  if (index === clicksNeeded) {
    // 最后位置：让最后一个item贴住右边
    position = lastPosition
  } else {
    // 其他位置：按比例计算，确保最后能到达lastPosition
    position = (index / clicksNeeded) * lastPosition
  }

  console.log(`Slide to index ${index}, position: ${position}px, lastPosition: ${lastPosition}px, clicksNeeded: ${clicksNeeded}`)
  return position
}

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
  } else {
    // 如果已经到最后，可以循环回到开始，或者保持到最后
    // currentIndex.value = 0  // 取消注释这行如果你想循环
  }
}

// 上一张
const previousSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}



// 处理缩略图点击
const handleItemClick = (item: ThumbnailItem) => {
  if (item.link) {
    window.open(item.link, '_blank')
  }
}

// 自动播放 - 暂时禁用，避免干扰手动操作
let autoPlayInterval: number | null = null

const startAutoPlay = () => {
  // 暂时禁用自动播放
  // autoPlayInterval = window.setInterval(() => {
  //   if (currentIndex.value >= maxIndex.value) {
  //     currentIndex.value = 0
  //   } else {
  //     currentIndex.value++
  //   }
  // }, 5000)
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
  // startAutoPlay() // 暂时禁用
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
  padding: 6rem 0 4rem 0;
  flex-shrink: 0;
  margin-top: 2rem;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 90vw;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.frames-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 80vw;
  margin: 0 auto;
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
  width: 32rem;
  height: 22rem;
  padding: 1.5rem;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  border-radius: 1.5rem;
  box-shadow:
    0 1.25rem 3rem rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  flex-shrink: 0;
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



/* 响应式布局 */
@media (max-width: 1200px) {
  .carousel-container {
    max-width: 95vw;
    gap: 1.5rem;
  }

  .frame-border {
    width: 26rem;
    height: 18rem;
  }
}

@media (max-width: 768px) {
  .carousel-container {
    max-width: 98vw;
    gap: 1rem;
  }

  .frame-border {
    width: 22rem;
    height: 15rem;
  }

  .frames-wrapper {
    gap: 1rem;
  }

  .carousel-arrow {
    width: 2.5rem;
    height: 2.5rem;
  }

  .carousel-arrow svg {
    width: 1.25rem;
    height: 1.25rem;
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
