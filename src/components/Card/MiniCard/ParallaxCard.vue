<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  // 背景图片地址
  backgroundImage: {
    type: String,
    required: true
  },
  // 图片宽度（用于比例计算）
  imgWidth: {
    type: Number,
    default: 720
  },
  // 图片高度
  imgHeight: {
    type: Number,
    default: 1080
  },
  // 卡片默认高度
  defaultHeight: {
    type: Number,
    default: 720
  },
  // 是否启用圆角
  rounded: {
    type: Boolean,
    default: true
  },
  // 自定义类名
  customClass: {
    type: String,
    default: ''
  }
})

// Slots
defineSlots()

// refs
const containerRef = ref<HTMLDivElement | null>(null)
const bgOffset = ref(0)

// 卡片高度（根据窗口宽度自动调整）
const cardHeight = ref(props.defaultHeight)

// IntersectionObserver
let observer: IntersectionObserver | null = null

// 进入视口回调
function onEnterViewport(
  el: HTMLElement | null,
  callback: (entry: IntersectionObserverEntry) => void
): IntersectionObserver | undefined {
  if (!el) return
  const obs = new IntersectionObserver(
    ([entry]) => {
      callback(entry)
    },
    { root: null, threshold: 0 }
  )
  obs.observe(el)
  return obs
}

// 计算视差偏移
function updateParallax() {
  const el = containerRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const windowHeight = window.innerHeight

  // 卡片顶部占整个视图的百分比 (0~1)
  const topPercent = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1)

  // 根据百分比计算背景偏移
  const scrollableRange = props.imgHeight - cardHeight.value
  bgOffset.value = -scrollableRange * topPercent
}

// 根据窗口宽度更新卡片高度
function updateCardSize() {
  const windowWidth = window.innerWidth
  cardHeight.value = Math.min(props.defaultHeight, windowWidth * (props.imgHeight / props.imgWidth))
  if (containerRef.value) {
    containerRef.value.style.height = `${cardHeight.value}px`
  }
}

onMounted(() => {
  const el = containerRef.value
  if (!el) return

  updateCardSize()
  updateParallax()

  // 进入视口时监听滚动，离开视口时固定顶部/底部
  observer = onEnterViewport(el, (entry) => {
    if (entry.isIntersecting) {
      window.addEventListener('scroll', updateParallax)
      updateParallax()
    } else {
      window.removeEventListener('scroll', updateParallax)
      const rect = el.getBoundingClientRect()
      if (rect.top > window.innerHeight) {
        // 离开顶部
        bgOffset.value = 0
      } else if (rect.bottom < 0) {
        // 离开底部
        bgOffset.value = -(props.imgHeight - cardHeight.value)
      }
    }
  }) as IntersectionObserver

  window.addEventListener('resize', () => {
    updateCardSize()
    updateParallax()
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  window.removeEventListener('scroll', updateParallax)
})
</script>

<template>
  <div
    class="parallax-card"
    :class="[customClass, { 'rounded': rounded }]"
    ref="containerRef"
  >
    <!-- 背景图 -->
    <div
      class="parallax-bg"
      :style="{
        transform: `translateY(${bgOffset}px)`,
        height: `${imgHeight}px`,
        backgroundImage: `url(${backgroundImage})`
      }"
    ></div>

    <!-- 内容区域 -->
    <div class="card-content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.parallax-card {
  position: relative;
  width: 100%;
  margin: 2em 0;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.parallax-card.rounded {
  border-radius: 1em;
}

.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  pointer-events: none;
  will-change: transform;
  transition: transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.card-content-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 1.5em;
  z-index: 1;
  gap: 1em;
}

/* 深色内容样式 */
.card-content-wrapper :deep(.content-dark) {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0.5em;
  padding: 1.5em;
  backdrop-filter: blur(2px);
  width: 100%;
  max-width: 500px;
}

/* 浅色内容样式 */
.card-content-wrapper :deep(.content-light) {
  color: #333;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 0.5em;
  padding: 1.5em;
  backdrop-filter: blur(2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

/* 透明内容样式 */
.card-content-wrapper :deep(.content-transparent) {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

/* Flex 布局辅助类 */
.card-content-wrapper :deep(.flex-center) {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.card-content-wrapper :deep(.flex-start) {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.card-content-wrapper :deep(.flex-end) {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.card-content-wrapper :deep(.flex-between) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-content-wrapper :deep(.flex-column) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 720px) {
  .parallax-card.rounded {
    border-radius: 0;
    margin: 1em -1em;
  }

  .card-content-wrapper {
    padding: 1em;
  }
}
</style>
