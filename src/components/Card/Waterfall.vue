<template>
  <div class="waterfall-container" ref="containerRef">
    <div
      v-for="card in cards"
      :key="card.id"
      class="waterfall-item"
      :style="getCardStyle(card.id)"
      :ref="(el) => setCardRef(card.id, el)"
    >
      <ParallaxCard
        :backgroundImage="card.image"
        :number="card.number"
        :defaultHeight="card.height"
        class="gallery-card"
        rounded
      >
        <div class="card-caption content-transparent">
          <h3>Card {{ card.number }}</h3>
          <p>这是第 {{ card.number }} 张卡片的描述内容</p>
        </div>
      </ParallaxCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import ParallaxCard from './MiniCard/ParallaxCard.vue'

// 卡片数据，包含不同的高度
const cards = ref([
  { id: 1, number: 1, image: 'public/Home/视差滚动/20250408_PmkAV3B93_1.jpg', height: 400 },
  { id: 2, number: 2, image: 'public/Home/视差滚动/20231110_NrWWmqmLa_4.jpg', height: 320 },
  { id: 3, number: 3, image: 'public/Home/视差滚动/20231231_NzH5RtVA6_5.jpg', height: 500 },
  { id: 4, number: 4, image: 'public/Home/视差滚动/20231228_Nzehu3u23_8.jpg', height: 360 },
  { id: 5, number: 5, image: 'public/Home/视差滚动/20200314_IytEIpKMe_8.jpg', height: 600 },
  { id: 6, number: 6, image: 'public/Home/视差滚动/20200521_J2XHYxApv_1.jpg', height: 380 },
  { id: 8, number: 8, image: 'public/Home/视差滚动/20231110_NrWWmqmLa_4.jpg', height: 460 },
])

const containerRef = ref<HTMLDivElement>()
const cardRefs = ref<{ [key: number]: HTMLElement }>({})

// 瀑布流配置
const config = ref({
  minCardWidth: 280, // 最小卡片宽度，避免过窄
  maxCardWidth: 400, // 最大卡片宽度
  gap: 20, // 卡片间距
  columns: 1, // 当前列数
  cardWidth: 320 // 当前卡片宽度
})

// 卡片位置信息
const cardPositions = ref<{ [key: number]: { x: number; y: number } }>({})
const columnHeights = ref<number[]>([])

// 设置卡片ref
const setCardRef = (id: number, el: any) => {
  if (el) {
    cardRefs.value[id] = el
  }
}

// 计算最佳列数和卡片宽度
const calculateLayout = () => {
  if (!containerRef.value) return

  const containerWidth = containerRef.value.clientWidth
  const { minCardWidth, maxCardWidth, gap } = config.value

  // 计算可能的列数范围
  let maxColumns = Math.floor((containerWidth + gap) / (minCardWidth + gap))
  let minColumns = Math.floor((containerWidth + gap) / (maxCardWidth + gap)) || 1

  // 确保至少有1列
  maxColumns = Math.max(1, maxColumns)
  minColumns = Math.max(1, minColumns)

  let bestColumns = minColumns
  let bestWidth = 0

  // 选择最佳列数，优先考虑卡片不会过窄
  for (let cols = minColumns; cols <= maxColumns; cols++) {
    const availableWidth = containerWidth - (cols - 1) * gap
    const cardWidth = availableWidth / cols

    // 如果卡片宽度在合理范围内，选择这个列数
    if (cardWidth >= minCardWidth && cardWidth <= maxCardWidth) {
      bestColumns = cols
      bestWidth = cardWidth
      break
    } else if (cardWidth >= minCardWidth) {
      bestColumns = cols
      bestWidth = cardWidth
    }
  }

  // 如果还是没找到合适的，使用能保证最小宽度的列数
  if (bestWidth === 0) {
    bestColumns = Math.floor((containerWidth + gap) / (minCardWidth + gap)) || 1
    const availableWidth = containerWidth - (bestColumns - 1) * gap
    bestWidth = availableWidth / bestColumns
  }

  config.value.columns = bestColumns
  config.value.cardWidth = Math.floor(bestWidth)

  // 初始化列高度
  columnHeights.value = new Array(bestColumns).fill(0)
}

// 计算卡片位置
const calculateCardPositions = () => {
  const { columns, cardWidth, gap } = config.value
  columnHeights.value = new Array(columns).fill(0)

  cards.value.forEach((card, index) => {
    // 找到最短的列
    const shortestColumnIndex = columnHeights.value.indexOf(Math.min(...columnHeights.value))

    // 计算位置
    const x = shortestColumnIndex * (cardWidth + gap)
    const y = columnHeights.value[shortestColumnIndex]

    cardPositions.value[card.id] = { x, y }

    // 更新列高度（卡片高度 + 间距）
    columnHeights.value[shortestColumnIndex] += card.height + gap
  })

  // 设置容器高度
  if (containerRef.value) {
    const maxHeight = Math.max(...columnHeights.value)
    containerRef.value.style.height = `${maxHeight}px`
  }
}

// 获取卡片样式
const getCardStyle = (cardId: number) => {
  const position = cardPositions.value[cardId]
  if (!position) return {}

  return {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${config.value.cardWidth}px`,
    transform: 'translateZ(0)', // 开启GPU加速
    transition: 'all 0.3s ease'
  }
}

// 重新布局
const relayout = async () => {
  calculateLayout()
  await nextTick()
  calculateCardPositions()
}

// 防抖函数
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const debouncedRelayout = debounce(relayout, 200)

onMounted(() => {
  relayout()
  window.addEventListener('resize', debouncedRelayout)
})

onUnmounted(() => {
  window.removeEventListener('resize', debouncedRelayout)
})
</script>

<style scoped>
.waterfall-container {
  position: relative;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
  max-width: 1400px;
  min-height: 100vh;
  box-sizing: border-box;
}

.waterfall-item {
  will-change: transform;
  backface-visibility: hidden;
}

.gallery-card {
  width: 100%;
  margin: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-caption {
  text-align: center;
  padding: 1.5rem;
}

.card-caption h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.card-caption p {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  line-height: 1.5;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .waterfall-container {
    padding: 15px;
  }

  .card-caption {
    padding: 1rem;
  }

  .card-caption h3 {
    font-size: 1.2rem;
  }

  .card-caption p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .waterfall-container {
    padding: 10px;
  }

  .card-caption {
    padding: 0.8rem;
  }

  .card-caption h3 {
    font-size: 1.1rem;
  }
}

/* 加载动画 */
.gallery-card {
  animation: fadeInUp 0.6s ease-out backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为不同序号的卡片添加延迟动画 */
.waterfall-item:nth-child(1) .gallery-card { animation-delay: 0.1s; }
.waterfall-item:nth-child(2) .gallery-card { animation-delay: 0.2s; }
.waterfall-item:nth-child(3) .gallery-card { animation-delay: 0.3s; }
.waterfall-item:nth-child(4) .gallery-card { animation-delay: 0.4s; }
.waterfall-item:nth-child(5) .gallery-card { animation-delay: 0.5s; }
.waterfall-item:nth-child(6) .gallery-card { animation-delay: 0.6s; }
.waterfall-item:nth-child(n+7) .gallery-card { animation-delay: 0.7s; }
</style>
