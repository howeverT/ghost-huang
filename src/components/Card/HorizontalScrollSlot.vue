<template>
  <div
    ref="containerRef"
    class="horizontal-scroll-container"
    :style="{ height: `${cardHeight}px` }"
  >
    <div class="horizontal-scroll-inner" :style="{ width: `${totalWidth}px` }">
      <slot name="card" v-for="index in cardCount" :index="index - 1">
        <div
          class="scroll-card"
          :style="{ width: `${cardWidth}px`, height: `${cardHeight}px`, marginRight: index < cardCount ? `${spacing}px` : '0' }"
        >
          卡片 {{ index }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 默认卡片数量
const cardCount = 10

const cardWidth = 300
const cardHeight = 200
const spacing = 16

const containerRef = ref<HTMLDivElement | null>(null)

// 计算总宽度
const totalWidth = computed(() => {
  return cardCount * cardWidth + (cardCount - 1) * spacing
})

let velocity = 0
let isLocked = false
let rafId: number | null = null

// 判断容器是否在视口中间
function updateLockState() {
  const el = containerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const start = windowHeight / 2 - rect.height / 2
  const end = windowHeight / 2 + rect.height / 2
  isLocked = rect.top < end && rect.bottom > start
}

// 处理滚轮事件
function onWheel(e: WheelEvent) {
  const el = containerRef.value
  if (!el) return
  updateLockState()
  const maxScroll = el.scrollWidth - el.clientWidth

  if (isLocked && ((e.deltaY > 0 && el.scrollLeft < maxScroll) || (e.deltaY < 0 && el.scrollLeft > 0))) {
    velocity += e.deltaY * 0.5
    e.preventDefault()
  }
}

// 平滑滚动动画
function animate() {
  const el = containerRef.value
  if (!el) return

  if (Math.abs(velocity) > 0.1) {
    el.scrollLeft += velocity
    velocity *= 0.9

    const maxScroll = el.scrollWidth - el.clientWidth
    if (el.scrollLeft < 0) {
      el.scrollLeft = 0
      velocity = 0
    }
    if (el.scrollLeft > maxScroll) {
      el.scrollLeft = maxScroll
      velocity = 0
    }
  }

  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', updateLockState)
  window.addEventListener('resize', updateLockState)

  animate()
})

onUnmounted(() => {
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('scroll', updateLockState)
  window.removeEventListener('resize', updateLockState)

  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.horizontal-scroll-container {
  width: 100%;
  overflow: hidden;
  margin: 2em 0;
}

.horizontal-scroll-inner {
  display: flex;
  will-change: scroll-position;
}

.scroll-card {
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>
