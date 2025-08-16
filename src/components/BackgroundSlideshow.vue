<template>
  <div class="background-slideshow">
    <div
      v-for="(image, index) in images"
      :key="index"
      :class="['slide', { active: currentIndex === index }]"
      :style="{ backgroundImage: `url(${image})` }"
    ></div>
    <!-- 添加半透明黑色蒙版 -->
    <div class="overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 背景图片数组 - 您可以在这里添加更多图片
const images = ref([
  '/src/assets/background/background.jpg',
  // 使用在线占位图片作为示例，您可以替换为自己的图片
  'https://picsum.photos/1920/1080?random=1',
  'https://picsum.photos/1920/1080?random=2',
  'https://picsum.photos/1920/1080?random=3',
])

const currentIndex = ref(0)
let intervalId: number | null = null

// 切换到下一张图片
const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length
}

// 开始自动播放
const startSlideshow = () => {
  intervalId = setInterval(nextImage, 5000) // 每5秒切换一次
}

// 停止自动播放
const stopSlideshow = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  startSlideshow()
})

onUnmounted(() => {
  stopSlideshow()
})
</script>

<style scoped>
.background-slideshow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.slide.active {
  opacity: 1;
}

/* 添加半透明黑色蒙版 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* 60%透明度的黑色 */
  z-index: 1;
}

/* 确保内容在背景之上，但导航栏在最上层 */
:deep(header),
:deep(.router-view) {
  position: relative;
  z-index: 2; /* 提高z-index确保在蒙版之上 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .background-slideshow {
    width: 100vw;
    height: 100vh;
  }
}

@media (max-width: 480px) {
  .background-slideshow {
    width: 100vw;
    height: 100vh;
  }
}
</style>
