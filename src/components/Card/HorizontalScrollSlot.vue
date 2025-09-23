<template>
  <div
    ref="containerRef"
    class="horizontal-scroll-container"
    :style="{ height: `${cardHeight}px` }"
  >
    <div class="horizontal-scroll-inner" :style="{ width: `${totalWidth}px` }">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="scroll-card-wrapper"
        :style="{ marginRight: index < items.length - 1 ? `${spacing}px` : '0' }"
      >
        <slot name="card" :item="item" :index="index">
          <!-- 默认内容 -->
          <div
            class="scroll-card"
            :style="{ width: `${cardWidth}px`, height: `${cardHeight}px` }"
          >
            {{ item }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, defineProps } from 'vue'

const props = defineProps<{
  items: any[]
  cardWidth?: number
  cardHeight?: number
  spacing?: number
}>()

const containerRef = ref<HTMLDivElement | null>(null)

const cardWidth = props.cardWidth ?? 300
const cardHeight = props.cardHeight ?? 200
const spacing = props.spacing ?? 16

const totalWidth = computed(() => {
  return props.items.length * cardWidth + (props.items.length - 1) * spacing
})

let velocity = 0
let isLocked = false
let rafId: number | null = null

function updateLockState() {
  const el = containerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const start = windowHeight / 2 - rect.height / 2
  const end = windowHeight / 2 + rect.height / 2
  isLocked = rect.top < end && rect.bottom > start
}

function onWheel(e: WheelEvent) {
  const el = containerRef.value
  if (!el) return
  updateLockState()
  const maxScroll = el.scrollWidth - el.clientWidth

  if (
    isLocked &&
    ((e.deltaY > 0 && el.scrollLeft < maxScroll) ||
      (e.deltaY < 0 && el.scrollLeft > 0))
  ) {
    velocity += e.deltaY * 0.5
    e.preventDefault()
  }
}

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
  // PC 端：wheel + inertia
  if (!('ontouchstart' in window)) {
    window.addEventListener('wheel', onWheel, { passive: false })
    animate()
  }
  // 通用事件
  window.addEventListener('scroll', updateLockState)
  window.addEventListener('resize', updateLockState)
})

onUnmounted(() => {
  if (!('ontouchstart' in window)) {
    window.removeEventListener('wheel', onWheel)
    if (rafId) cancelAnimationFrame(rafId)
  }
  window.removeEventListener('scroll', updateLockState)
  window.removeEventListener('resize', updateLockState)
})
</script>

<style scoped>
.horizontal-scroll-container {
  width: 100%;
  overflow-x: auto; /* 手机端可拖动 */
  overflow-y: hidden;
  margin: 2em 0;
  -webkit-overflow-scrolling: touch; /* iOS 惯性滚动 */
  scroll-behavior: smooth; /* 平滑滚动 */
}

.horizontal-scroll-inner {
  display: flex;
  will-change: scroll-position;
}

.scroll-card-wrapper {
  flex-shrink: 0;
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
