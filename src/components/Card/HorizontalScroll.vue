<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Props
const props = defineProps<{
  images: string[]           // 图片地址数组
  cardWidth?: number         // 单张图片卡片宽度，默认300px
  cardHeight?: number        // 卡片高度，默认200px
  spacing?: number           // 图片间距，默认16px
}>()

// 默认值
const cardWidth = props.cardWidth ?? 300
const cardHeight = props.cardHeight ?? 200
const spacing = props.spacing ?? 16

const containerRef = ref<HTMLDivElement | null>(null)
const scrollX = ref(0)  // 横向滚动偏移量

// 计算总宽度
const totalWidth = computed(() => {
  return props.images.length * cardWidth + (props.images.length - 1) * spacing
})

// 监听滚动
function updateHorizontalScroll() {
  const el = containerRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const windowHeight = window.innerHeight

  // 当卡片进入视口中间时，开始横向滚动
  const start = windowHeight / 2 - rect.height / 2
  const end = windowHeight / 2 + rect.height / 2

  if (rect.top < end && rect.bottom > start) {
    // 卡片进入中间区域
    const progress = Math.min(Math.max((windowHeight / 2 - rect.top) / rect.height, 0), 1)
    scrollX.value = -(totalWidth.value - cardWidth) * progress
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateHorizontalScroll)
  window.addEventListener('resize', updateHorizontalScroll)
  updateHorizontalScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateHorizontalScroll)
  window.removeEventListener('resize', updateHorizontalScroll)
})
</script>

<template>
  <div
    class="horizontal-scroll-container"
    ref="containerRef"
    :style="{ height: `${cardHeight}px` }"
  >
    <div
      class="horizontal-scroll-inner"
      :style="{ width: `${totalWidth}px`, transform: `translateX(${scrollX}px)` }"
    >
      <div
        v-for="(img, index) in images"
        :key="index"
        class="scroll-card"
        :style="{ width: `${cardWidth}px`, height: `${cardHeight}px`, marginRight: index < images.length - 1 ? `${spacing}px` : '0' }"
      >
        <img :src="img" :alt="`image-${index}`" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.horizontal-scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin: 2em 0;
}

.horizontal-scroll-inner {
  display: flex;
  transition: transform 0.2s ease-out;
}

.scroll-card {
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #eee;
}

.scroll-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
