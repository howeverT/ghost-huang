<template>
  <div class="scroll-container">
    <div class="spacer" /> <!-- 顶部空白，保持滚动 -->

    <!-- Ghost Star文字绘制 -->
    <div class="star-container" ref="starContainer">
      <svg viewBox="0 0 400 200">
        <text
          ref="star"
          x="200"
          y="100"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Arial, sans-serif"
          font-size="40"
          font-weight="bold"
          stroke="#17f700"
          fill="none"
          stroke-width="2"
          stroke-dasharray="1000"
          stroke-dashoffset="1000"
        >
          Ghost Star
        </text>
      </svg>
    </div>

    <!-- 正文内容 -->
    <div class="content">
      <p v-for="i in 50" :key="i">This is scrolling content section {{ i }}</p>
    </div>

    <div class="spacer" /> <!-- 底部空白 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const star = ref<SVGTextElement | null>(null)
const starContainer = ref<HTMLDivElement | null>(null)

let distanceTrigger = 0
let distanceEdge = 0

const updateDistances = () => {
  if (!starContainer.value) return
  distanceTrigger = starContainer.value.offsetTop
  distanceEdge = starContainer.value.offsetHeight + window.innerHeight
}

const onScroll = () => {
  if (!star.value) return
  const scrollY = window.scrollY
  let progress = 0
  if (scrollY > distanceTrigger) {
    progress = (scrollY - distanceTrigger) / distanceEdge
    progress = Math.min(Math.max(progress, 0), 1)
  }
  star.value.style.strokeDashoffset = `${1000 * (1 - progress)}`
}

onMounted(() => {
  updateDistances()
  window.addEventListener("scroll", onScroll)
  window.addEventListener("resize", updateDistances)
})

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll)
  window.removeEventListener("resize", updateDistances)
})
</script>

<style scoped>
.scroll-container {
  width: 100%;
  background-color: #171717;
  color: #17f700;
  font-family: sans-serif;
  font-size: 2vmin;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spacer {
  height: 30rem;
}

.star-container {
  position: sticky;
  top: 20vh;
  /* 向右移动50%的视口宽度 */
  left: 110%;
  transform: translateX(-25%); /* 调整位置，使中心点更合理 */
  width: 400px;  /* 增加宽度以适应文字 */
  height: 200px;
  margin-bottom: 5rem;
}

.star-container svg {
  width: 100%;
  height: 100%;
}

.content {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content p {
  opacity: 0.5;
}
</style>
