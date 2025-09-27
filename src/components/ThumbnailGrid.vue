<template>
  <div
    class="drawerContainer"
    ref="drawerContainerRef"
  >
    <!-- 左侧目录面板 -->
    <div
      class="directoryPanel"
      :style="{ flex: isExpanded ? '0 0 30%' : '0 0 20%' }"
    >
      <!-- 标题容器 -->
      <div v-if="title" class="title-container">
        <h2>{{ title }}</h2>
      </div>

      <div class="directoryItems">
        <div
          v-for="(item, index) in currentPageItems"
          :key="index"
          class="directoryItem"
          :class="{
            active: activeIndex === index,
            expanded: activeIndex === index && isExpanded
          }"
          @click="selectItem(index)"
        >
          <div class="itemHeader">
            <span class="itemNumber">{{ (currentPage * itemsPerPage) + index + 1 }}</span>
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

    <!-- 中间分割线 -->
    <div
      class="divider"
      @click="handleDividerClick"
    >
      <div class="dividerIcon">{{ isExpanded ? '❮' : '❯' }}</div>
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
          <div class="cardHeader">
            <div class="cardTitle">{{ item.title }}</div>
          </div>
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
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    {
      image: getImagePath('/src/assets/background/Beijing-day1.jpg'),
      title: '北京一日游'
    },
    {
      image: getImagePath('/src/assets/background/Beijing-day2.jpg'),
      title: '北京二日游'
    },
    {
      image: getImagePath('/src/assets/background/Guangzhou.jpg'),
      title: '广州之旅'
    },
    {
      image: getImagePath('/src/assets/background/Chengdu.jpg'),
      title: '成都印象'
    },
    {
      image: getImagePath('/src/assets/background/History2024.jpg'),
      title: '历史回顾'
    },
    {
      image: getImagePath('/src/assets/background/background.jpg'),
      title: '精彩瞬间'
    },
  ],
  itemsPerPage: 4,
  title: '',
})

const currentPage = ref(0)
const isTransitioning = ref(false)
const activeIndex = ref(-1)
const isExpanded = ref(false)
const contentScroll = ref(null)
const contentCards = ref([])
const drawerContainerRef = ref(null)

let contentObserver = null
let rootObserver = null
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
  activeIndex.value = index
  isExpanded.value = true
  scrollToContent(index).then(() => {
    setTimeout(() => { isScrolling = false }, 500)
  })
}

const handleDividerClick = () => {
  isExpanded.value = !isExpanded.value
  if (!isExpanded.value) {
    activeIndex.value = -1
  } else if (activeIndex.value === -1) {
    activeIndex.value = 0
    scrollToContent(0)
  }
}

const scrollToContent = (index: number) => {
  return new Promise<void>(resolve => {
    if (contentScroll.value && activeIndex.value !== -1) {
      const card = contentCards.value[index]
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
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = parseInt(entry.target.getAttribute('data-index') || '0')
      if (activeIndex.value !== index) activeIndex.value = index
    }
  })
}

const rootObserverCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(entry => {
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
    threshold: 0
  })
  contentCards.value.forEach((card: Element) => contentObserver?.observe(card))
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
.drawerContainer {
  display: flex;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #d32f2f 0%, #ffd700 100%);
  overflow: hidden;
}

.directoryPanel {
  display: flex;
  flex-direction: column;
  transition: flex 0.3s ease;
  background-image: url('/Home/drawer/back1.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.directoryPanel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.title-container {
  padding: 2rem 1rem 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.title-container h2 {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
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
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.directoryItem {
  display: flex;
  flex-direction: column;
  min-height: 80px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.directoryItem:hover { background: rgba(255, 255, 255, 0.3); transform: scale(1.02); }
.directoryItem.active { background: rgba(255, 255, 255, 0.9); color: #b71c1c; }
.directoryItem.expanded { min-height: 180px; }

.itemHeader { display: flex; align-items: center; height: 80px; }
.itemNumber { font-size: 32px; font-weight: bold; margin-right: 15px; color: rgba(255, 255, 255, 0.8); }
.directoryItem.active .itemNumber { color: #d32f2f; }
.itemTitle { font-size: 22px; font-weight: 600; color: rgba(255, 255, 255, 0.9); }
.directoryItem.active .itemTitle { color: #b71c1c; }

.pagination-container { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1rem; position: relative; z-index: 1; }
.pagination-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 2px solid rgba(255, 255, 255, 0.8); background: rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.9); border-radius: 50%; cursor: pointer; transition: all 0.3s ease; font-size: 0; backdrop-filter: blur(10px); }
.pagination-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.9); color: #d32f2f; transform: scale(1.1); }
.pagination-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
.page-info { font-size: 1rem; font-weight: 600; color: rgba(255, 255, 255, 0.9); min-width: 60px; text-align: center; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); }

.divider { width: 10px; background: #C9171D; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; position: relative; }
.divider:hover { background: rgba(211, 47, 47, 0.8); }
.dividerIcon { position: absolute; color: white; font-size: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }

.contentPanel { flex: 1; padding: 40px; background-image: url('/Home/drawer/back2.jpg'); background-size: cover; background-position: center; position: relative; overflow: hidden; }
.contentPanel::before { content: ''; position: absolute; inset: 0; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(2px); pointer-events: none; z-index: 0; }

.contentScrollWrapper { height: 100%; overflow-y: auto; scroll-behavior: smooth; scroll-snap-type: y mandatory; }
.contentScrollWrapper.scroll-disabled { overflow-y: hidden; scroll-behavior: auto; scroll-snap-type: none; }

.contentCard { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; scroll-snap-align: start; color: #1B3A2D; position: relative; z-index: 1; }
.cardHeader { margin-bottom: 20px; text-align: center; }
.cardTitle { font-size: 48px; font-weight: bold; background: linear-gradient(45deg, #1B3A2D, #4F7A66); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.cardImage { flex: 1; width: 100%; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.1); cursor: pointer; transition: transform 0.3s ease; overflow: hidden; }
.cardImage:hover { transform: scale(1.02); }
.imageDisplay { width: 100%; height: 100%; background-size: cover; background-position: center; background-repeat: no-repeat; display: flex; align-items: center; justify-content: center; }
.imagePlaceholder { font-size: 24px; color: rgba(27, 58, 45, 0.8); font-weight: 300; }

@media (max-width: 768px) {
  .drawerContainer { flex-direction: column; }
  .directoryPanel { flex: 0 0 auto; height: auto; max-height: 40vh; }
  .title-container { padding: 1rem; }
  .title-container h2 { font-size: 1.5rem; }
  .directoryItems { flex-direction: row; overflow-x: auto; justify-content: flex-start; padding: 15px; }
  .directoryItem { min-width: 200px; min-height: 100px; }
  .directoryItem.expanded { min-height: 200px; }
  .pagination-container { padding: 0.5rem; gap: 0.5rem; }
  .pagination-btn { width: 32px; height: 32px; }
  .page-info { font-size: 0.9rem; min-width: 50px; }
  .divider { width: 100%; height: 10px; }
  .contentPanel { flex: 1; height: 60vh; padding: 20px; }
  .contentCard { height: 60vh; padding-bottom: 20px; }
  .cardTitle { font-size: 32px; }
  .cardImage { height: 250px; }
}

@media (max-width: 480px) {
  .title-container h2 { font-size: 1.2rem; }
  .directoryItem { min-width: 160px; }
  .itemTitle { font-size: 18px; }
  .itemNumber { font-size: 24px; }
  .cardTitle { font-size: 24px; }
  .cardImage { height: 200px; }
}
</style>
