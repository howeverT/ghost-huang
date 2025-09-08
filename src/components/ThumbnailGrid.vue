<template>
  <div class="thumbnail-section">
    <div class="content-container">
      <!-- 标题容器 -->
      <div v-if="title" class="title-container">
        <h2>{{ title }}</h2>
      </div>
      <!-- 项目容器 -->
      <div class="items-container">
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
  title?: string
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
  title: '',
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

  console.log(
    `Total width: ${totalWidth}px, Last position: ${lastPosition}px, Clicks needed: ${clicksNeeded}`,
  )

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

  console.log(
    `Slide to index ${index}, position: ${position}px, lastPosition: ${lastPosition}px, clicksNeeded: ${clicksNeeded}`,
  )
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
  max-width: 1200px;
  display: flex;
  justify-content: flex-start;
}

.title-container h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.items-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  max-width: 1200px;
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
  width: 18rem;
  height: 25rem;
  position: relative;
  flex-shrink: 0;
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

/* 响应式布局 */
@media (min-width: 1600px) {
  .title-container,
  .items-container {
    max-width: 1600px;
  }

  .frame-border {
    width: 22rem;
    height: 30rem;
  }
}

@media (max-width: 1400px) {
  .title-container,
  .items-container {
    max-width: 1400px;
  }

  .frame-border {
    width: 20rem;
    height: 28rem;
  }
}

@media (max-width: 1200px) {
  .title-container,
  .items-container {
    max-width: 1200px;
  }

  .title-container h2 {
    font-size: 2.2rem;
  }

  .frame-border {
    width: 18rem;
    height: 25rem;
  }
}

@media (max-width: 768px) {
  .title-container,
  .items-container {
    max-width: 1000px;
  }

  .title-container h2 {
    font-size: 2rem;
  }

  .frame-border {
    width: 16rem;
    height: 22rem;
  }

  .items-container {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .title-container,
  .items-container {
    max-width: 100%;
  }

  .title-container h2 {
    font-size: 1.8rem;
  }

  .frame-border {
    width: calc(50% - 0.75rem);
    min-width: 150px;
    height: 20rem;
  }

  .items-container {
    gap: 1rem;
  }

  .frame-title {
    font-size: 1rem;
    padding: 1rem 0.8rem 0.8rem;
  }
}
</style>
