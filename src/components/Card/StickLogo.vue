<template>
  <dom-monitor />
  <div class="scroll-container">
    <div class="spacer" /> <!-- 顶部空白，保持滚动 -->

    <div class="star-container" ref="starContainer">
      <svg viewBox="0 0 400 200">
        <!-- Ghost Star文字 -->
        <text
          ref="star"
          x="200"
          y="100"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Arial, sans-serif"
          font-size="40"
          font-weight="bold"
          stroke="#ff69b4"
        fill="none"
        stroke-width="2"
        stroke-dasharray="1000"
        stroke-dashoffset="1000"
        >
        Ghost Star
        </text>

        <!-- 星星点缀 -->
        <circle cx="50" cy="30" r="2" fill="#ff69b4" />
        <circle cx="120" cy="70" r="3" fill="#ff69b4" />
        <circle cx="300" cy="50" r="2.5" fill="#ff69b4" />
        <circle cx="250" cy="150" r="2" fill="#ff69b4" />
        <circle cx="100" cy="130" r="1.5" fill="#ff69b4" />
        <circle cx="350" cy="120" r="2.5" fill="#ff69b4" />
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
import DomMonitor from '@/components/Card/MiniCard/DomMonitor.vue'

const star = ref<SVGTextElement | null>(null)
const starContainer = ref<HTMLDivElement | null>(null)

let distanceTrigger = 0
let distanceEdge = 0
// 控制绘制速率的系数，值越小绘制越慢
const drawSpeedFactor = 0.2  // 原来的速率是1，现在减慢到一半

const updateDistances = () => {
  if (!starContainer.value) return
  distanceTrigger = starContainer.value.offsetTop
  // 增加需要滚动的距离来减慢绘制
  distanceEdge = (starContainer.value.offsetHeight + window.innerHeight) / drawSpeedFactor
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
  color: #e782ee;
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
  top: 0vh;
  left: 200%;
  position: sticky;

  transform: translateX(10%); /* 减少向左的偏移（抵消更少） */
  width: 400px;
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
