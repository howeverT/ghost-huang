<template>
  <div class="thumbnail-wrapper">
    <!-- 标题 -->
    <div v-if="title" class="main-title">
      <h2>{{ title }}</h2>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>

    <div class="drawerContainer" ref="drawerContainerRef">
      <!-- 左侧目录面板 -->
      <div class="directoryPanel" :style="{ flex: isExpanded ? '0 0 30%' : '0 0 20%' }">
        <div class="directoryItems">
          <div
            v-for="(item, index) in currentPageItems"
            :key="index"
            class="directoryItem"
            :class="{
              active: activeIndex === index,
              expanded: activeIndex === index && isExpanded,
            }"
            @click="selectItem(index)"
          >
            <div class="itemHeader">
              <span class="itemTitle">{{ item.title }}</span>
            </div>
          </div>
        </div>

        <!-- 分页按钮 -->
        <div class="pagination-container" v-if="totalPages > 1">
          <button
            class="pagination-btn prev-btn"
            :disabled="currentPage === 0 || isTransitioning"
            @click="previousPage"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <span class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</span>
          <button
            class="pagination-btn next-btn"
            :disabled="currentPage === totalPages - 1 || isTransitioning"
            @click="nextPage"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 箭头按钮 -->
      <div class="arrowButton" @click="handleDividerClick">
        <div class="arrowIcon">
          <svg
            viewBox="0 0 31 40"
            xmlns="http://www.w3.org/2000/svg"
            :class="{ rotated: isExpanded }"
          >
            <path
              d="M10.974 40L0 29.04 9.052 20 0 10.96 10.974 0 31 20 10.974 40zm-9.27-10.96l9.27 9.258L29.296 20 10.974 1.702l-9.27 9.257L10.757 20l-9.053 9.04z"
            />
          </svg>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="contentPanel">
        <div
          class="contentScrollWrapper"
          ref="contentScroll"
          :class="{ 'scroll-disabled': activeIndex === -1 }"
        >
          <div
            class="contentCard"
            v-for="(item, index) in currentPageItems"
            :key="`${currentPage}-${index}`"
            :data-index="index"
            :class="{ active: activeIndex === index }"
            ref="contentCards"
          >
            <div class="cardImage" @click="handleItemClick(item)">
              <div
                class="imageDisplay"
                :style="{
                  backgroundImage: `url(${getImagePath(item.image || '')})`,
                }"
              >
                <div class="imagePlaceholder" v-if="!item.image">{{ item.title }}</div>
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
import { getImagePath } from '@/utils/pathUtils'

interface ThumbnailItem {
  image?: string
  title: string
  link?: string
  description?: string
  subtitle?: string
}

interface Props {
  items?: ThumbnailItem[]
  itemsPerPage?: number
  title?: string
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    {
      image: getImagePath('/src/assets/background/Beijing-day1.jpg'),
      title: '北京站',
    },
    {
      image: getImagePath('/src/assets/background/Beijing-day2.jpg'),
      title: '北京站',
    },
    {
      image: getImagePath('/src/assets/background/Guangzhou.jpg'),
      title: '北京站',
    },
    {
      image: getImagePath('/src/assets/background/Chengdu.jpg'),
      title: '北京站',
    },
    {
      image: getImagePath('/src/assets/background/History2024.jpg'),
      title: '北京站',
    },
    {
      image: getImagePath('/src/assets/background/background.jpg'),
      title: '北京站',
    },
  ],
  itemsPerPage: 4,
  title: '',
  subtitle: '',
})

const currentPage = ref(0)
const isTransitioning = ref(false)
const activeIndex = ref(-1)
const isExpanded = ref(false)
const contentScroll = ref(null)
const contentCards = ref([])
const drawerContainerRef = ref(null)

let contentObserver: IntersectionObserver | null = null
let rootObserver: IntersectionObserver | null = null
let isScrolling = false

const totalPages = computed(() => {
  return Math.ceil(props.items.length / props.itemsPerPage)
})

const currentPageItems = computed(() => {
  const start = currentPage.value * props.itemsPerPage
  const end = start + props.itemsPerPage
  return props.items.slice(start, end)
})

const nextPage = () => {
  if (isTransitioning.value || currentPage.value >= totalPages.value - 1) return
  fadeOutAndChange(() => {
    currentPage.value++
    activeIndex.value = -1
    isExpanded.value = false
  })
}

const previousPage = () => {
  if (isTransitioning.value || currentPage.value <= 0) return
  fadeOutAndChange(() => {
    currentPage.value--
    activeIndex.value = -1
    isExpanded.value = false
  })
}

const fadeOutAndChange = (changeCallback: () => void) => {
  const itemsContainer = document.querySelector('.directoryItems') as HTMLElement
  isTransitioning.value = true
  if (itemsContainer) {
    itemsContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
    itemsContainer.style.opacity = '0'
    itemsContainer.style.transform = 'translateY(20px)'
    setTimeout(() => {
      changeCallback()
      setTimeout(() => {
        if (itemsContainer) {
          itemsContainer.style.opacity = '1'
          itemsContainer.style.transform = 'translateY(0)'
        }
        isTransitioning.value = false
      }, 50)
    }, 300)
  } else {
    changeCallback()
    isTransitioning.value = false
  }
}

const handleItemClick = (item: ThumbnailItem) => {
  if (item.link) {
    window.open(item.link, '_blank')
  }
}

const selectItem = (index: number) => {
  isScrolling = true

  // 开始渐隐
  const directoryItems = document.querySelector('.directoryItems') as HTMLElement
  if (directoryItems) {
    directoryItems.style.opacity = '0'
  }

  // 渐隐完成后，设置选中状态
  setTimeout(() => {
    activeIndex.value = index
    isExpanded.value = true

    // 再等一会儿让item升到最上面，然后渐显
    setTimeout(() => {
      if (directoryItems) {
        directoryItems.style.opacity = '1'
      }
    }, 200)

    scrollToContent(index).then(() => {
      setTimeout(() => {
        isScrolling = false
      }, 500)
    })
  }, 400)
}

const handleDividerClick = () => {
  if (!isExpanded.value) {
    // 展开时：使用和selectItem相同的逻辑
    isScrolling = true

    // 开始渐隐
    const directoryItems = document.querySelector('.directoryItems') as HTMLElement
    if (directoryItems) {
      directoryItems.style.opacity = '0'
    }

    // 渐隐完成后，设置选中状态
    setTimeout(() => {
      isExpanded.value = true
      activeIndex.value = 0

      // 再等一会儿让item升到最上面，然后渐显
      setTimeout(() => {
        if (directoryItems) {
          directoryItems.style.opacity = '1'
        }
      }, 200)

      scrollToContent(0).then(() => {
        setTimeout(() => {
          isScrolling = false
        }, 500)
      })
    }, 400)
  } else {
    // 收起时：直接收起
    isExpanded.value = false
    activeIndex.value = -1
  }
}

const scrollToContent = (index: number) => {
  return new Promise<void>((resolve) => {
    if (contentScroll.value && activeIndex.value !== -1) {
      const card = contentCards.value[index] as HTMLElement
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(resolve, 300)
      } else resolve()
    } else resolve()
  })
}

const contentObserverCallback = (entries: IntersectionObserverEntry[]) => {
  if (isScrolling) return
  if (activeIndex.value === -1) return
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const index = parseInt(entry.target.getAttribute('data-index') || '0')
      if (activeIndex.value !== index) activeIndex.value = index
    }
  })
}

const rootObserverCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && isExpanded.value) {
      handleDividerClick()
    }
  })
}

const initContentObserver = () => {
  const root = contentScroll.value
  contentObserver = new IntersectionObserver(contentObserverCallback, {
    root: root,
    rootMargin: '0px 0px -95% 0px',
    threshold: 0,
  })
  contentCards.value.forEach((card: Element) => contentObserver?.observe(card as Element))
}

const initRootObserver = () => {
  if (drawerContainerRef.value) {
    rootObserver = new IntersectionObserver(rootObserverCallback, { root: null, threshold: 0 })
    rootObserver.observe(drawerContainerRef.value)
  }
}

onMounted(() => {
  if (contentCards.value.length > 0) initContentObserver()
  initRootObserver()
})

onUnmounted(() => {
  if (contentObserver) contentObserver.disconnect()
  if (rootObserver) rootObserver.disconnect()
})
</script>

<style scoped>
.thumbnail-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 70vh;
  gap: 2rem;
}

.main-title {
  text-align: center;
  width: 100%;
  margin-top: 6rem;
  margin-bottom: 1.5rem;
}

.main-title h2 {
  font-size: 3rem;
  font-weight: 700;
  color: black;
  margin: 0 0 1.5rem 0;
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 400;
  color: #666;
  line-height: 1.6;
  margin: 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* 主标题响应式调整 */
@media (max-width: 1200px) {
  .main-title h2 {
    font-size: 2.5rem;
  }
  .subtitle {
    font-size: 1.125rem;
  }
}

@media (max-width: 768px) {
  .main-title h2 {
    font-size: 2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .main-title {
    margin-top: 4rem;
    margin-bottom: 1.5rem;
  }
}

.drawerContainer {
  display: flex;
  width: 100%;
  height: 70vh;
  background: #000000;
  overflow: hidden;
}

/* 响应式设计 - 小屏幕时调整布局 */
@media (max-width: 1200px) {
  .drawerContainer {
    height: 65vh;
  }
}

@media (max-width: 768px) {
  .drawerContainer {
    height: 60vh;
  }
}

.directoryPanel {
  display: flex;
  flex-direction: column;
  transition: flex 0.3s ease;
  flex: 0 0 20%;
  background: #000000;
  position: relative;
}

/* 小屏幕时左侧面板更宽，防止文字重叠 */
@media (max-width: 1400px) {
  .directoryPanel {
    flex: 0 0 22%;
  }
}

@media (max-width: 1200px) {
  .directoryPanel {
    flex: 0 0 25%;
  }
}

@media (max-width: 900px) {
  .directoryPanel {
    flex: 0 0 28%;
  }
}

@media (max-width: 768px) {
  .directoryPanel {
    flex: 0 0 32%;
  }
}

.directoryItems {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  position: relative;
  z-index: 1;
  transition: opacity 0.4s ease;
}

.directoryItem {
  display: flex;
  flex-direction: column;
  min-height: 5rem; /* 80px */
  padding: 0 1.25rem; /* 20px */
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

/* 小屏幕时item更紧凑 */
@media (max-width: 1400px) {
  .directoryItem {
    min-height: 4.5rem; /* 72px */
    padding: 0 1.125rem; /* 18px */
  }
}

@media (max-width: 1200px) {
  .directoryItem {
    min-height: 4.375rem; /* 70px */
    padding: 0 1rem; /* 16px */
  }
}

@media (max-width: 900px) {
  .directoryItem {
    min-height: 4rem; /* 64px */
    padding: 0 0.875rem; /* 14px */
  }
}

@media (max-width: 768px) {
  .directoryItem {
    min-height: 3.75rem; /* 60px */
    padding: 0 0.75rem; /* 12px */
  }
}

.directoryItem:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}
.directoryItem.active {
  background: transparent;
  color: white;
  position: relative;
  padding: 10px 15px;
  order: -1;
}

.directoryItem.active::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 15px;
  width: calc(100% - 30px);
  height: 2px;
  background: white;
}

.itemHeader {
  display: flex;
  align-items: center;
  height: 80px;
}

.directoryItem.active .itemHeader {
  height: auto;
  padding: 5px 0;
}
.itemTitle {
  font-size: 1.375rem; /* 22px */
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* 响应式字体大小调整 */
@media (max-width: 1400px) {
  .itemTitle {
    font-size: 1.25rem; /* 20px */
  }
}

@media (max-width: 1200px) {
  .itemTitle {
    font-size: 1.125rem; /* 18px */
  }
}

@media (max-width: 900px) {
  .itemTitle {
    font-size: 1rem; /* 16px */
  }
}

@media (max-width: 768px) {
  .itemTitle {
    font-size: 0.875rem; /* 14px */
  }
}
.directoryItem.active .itemTitle {
  color: white;
  font-size: 2.25rem; /* 36px */
  font-weight: 700;
}

/* 选中状态字体响应式调整 */
@media (max-width: 1400px) {
  .directoryItem.active .itemTitle {
    font-size: 2rem; /* 32px */
  }
}

@media (max-width: 1200px) {
  .directoryItem.active .itemTitle {
    font-size: 1.75rem; /* 28px */
  }
}

@media (max-width: 900px) {
  .directoryItem.active .itemTitle {
    font-size: 1.5rem; /* 24px */
  }
}

@media (max-width: 768px) {
  .directoryItem.active .itemTitle {
    font-size: 1.25rem; /* 20px */
  }
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  position: relative;
  z-index: 1;
}
.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0;
  backdrop-filter: blur(10px);
}
.pagination-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.9);
  color: #0a2463;
  transform: scale(1.1);
}
.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}
.page-info {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  min-width: 60px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.arrowButton {
  width: 40px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  box-shadow:
    0 0 25px black,
    0 0 30px black,
    0 0 35px black;
}
.arrowButton:hover {
  background: transparent;
}
.arrowIcon {
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.arrowIcon svg {
  width: 24px;
  height: 24px;
  fill: white;
  transition: transform 0.3s ease;
}

.arrowIcon svg.rotated {
  transform: rotate(180deg);
}
.arrowButton:hover .arrowIcon {
  transform: scale(1.1);
}

.arrowButton:hover .arrowIcon svg {
  fill: rgba(255, 255, 255, 0.8);
}

.contentPanel {
  flex: 1;
  padding: 0;
  background: #000000;
  position: relative;
  overflow: hidden;
}

.contentScrollWrapper {
  height: 100%;
  overflow: hidden;
  scroll-behavior: smooth;
}
.contentScrollWrapper.scroll-disabled {
  overflow-y: hidden;
  scroll-behavior: auto;
  scroll-snap-type: none;
}

.contentCard {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  color: white;
  position: relative;
  z-index: 1;
}
.cardImage {
  flex: 1;
  width: 100%;
  height: 100%;
  border-radius: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  overflow: hidden;
  position: relative;
}
.cardImage:hover {
  transform: scale(1.02);
}
.imageDisplay {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.imagePlaceholder {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
}

@media (max-width: 768px) {
  .drawerContainer {
    flex-direction: column;
    height: 80vh; /* 增加整体高度，给下面图片更多空间 */
  }
  .directoryPanel {
    height: auto;
    transition: all 0.3s ease;
  }
  .main-title h2 {
    font-size: 2.5rem;
  }
  .directoryItems {
    flex-direction: column;
    overflow-x: visible;
    justify-content: center;
    padding: 25px; /* 增加padding */
    gap: 4px; /* 进一步减小item之间的垂直间距 */
  }
  .directoryItem {
    min-width: 160px;
    min-height: auto; /* 让高度自适应 */
  }

  .itemHeader {
    height: auto; /* 覆盖固定的80px高度 */
    padding: 0.5rem 0; /* 添加适当的上下padding */
  }
  .directoryItem.expanded {
    min-height: auto;
  }
  .pagination-container {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  .pagination-btn {
    width: 32px;
    height: 32px;
  }
  .page-info {
    font-size: 0.9rem;
    min-width: 50px;
  }
  .arrowButton {
    width: 100%;
    height: 40px;
  }
  .contentPanel {
    flex: 1;
    height: 100%;
    padding: 0;
  }
  .contentCard {
    height: 100%;
    padding: 0;
  }
  .cardTitle {
    font-size: 24px;
  }
  .cardImage {
    height: 100%;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .main-title h2 {
    font-size: 2rem;
  }
  .directoryItem {
    min-width: 160px;
  }
  .itemTitle {
    font-size: 0.75rem; /* 12px - 比768px的14px更小 */
  }

  .directoryItem.active .itemTitle {
    font-size: 1rem; /* 16px - 选中状态也相应调整 */
  }
  .itemNumber {
    font-size: 24px;
  }
  .cardTitle {
    font-size: 20px;
  }
  .cardImage {
    height: 100%;
    max-width: 100%;
  }
}
</style>
