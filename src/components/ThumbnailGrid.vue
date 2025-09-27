<template>
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
            expanded: activeIndex === index && isExpanded
          }"
          @click="selectItem(index)"
        >
          <div class="itemHeader">
            <span class="itemNumber">{{ index + 1 }}</span>
            <span class="itemTitle">{{ item.title }}</span>
          </div>
          <div class="itemContent" v-if="activeIndex === index && isExpanded">
            <div class="itemDescription">{{ item.description || '' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="divider" @click="handleDividerClick">
      <div class="dividerIcon">{{ isExpanded ? '❮' : '❯' }}</div>
    </div>

    <!-- 右侧内容面板 -->
    <div class="contentPanel">
      <div
        class="contentScrollWrapper"
        ref="contentScroll"
        :class="{ 'scroll-disabled': activeIndex === -1 }"
      >
        <div
          class="contentCard"
          v-for="(item, index) in currentPageItems"
          :key="index"
          :data-index="index"
          :class="{ active: activeIndex === index }"
          ref="contentCards"
        >
          <div
            class="cardImage"
            :style="{ backgroundImage: `url(${getImagePath(item.image || '')})` }"
          >
            <div class="cardOverlay">
              <div class="cardHeader">
                <div class="cardSubtitle">{{ item.subtitle || '' }}</div>
                <div class="cardTitle">{{ item.title }}</div>
              </div>
              <div class="cardDescription">{{ item.description || '' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getImagePath } from '@/utils/pathUtils'

interface ThumbnailItem {
  image?: string
  title: string
  description?: string
  subtitle?: string
  link?: string
}

interface Props {
  items?: ThumbnailItem[]
  itemsPerPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { image: getImagePath('/src/assets/background/Beijing-day1.jpg'), title: '北京一日游' },
    { image: getImagePath('/src/assets/background/Beijing-day2.jpg'), title: '北京二日游' },
    { image: getImagePath('/src/assets/background/Guangzhou.jpg'), title: '广州之旅' },
    { image: getImagePath('/src/assets/background/Chengdu.jpg'), title: '成都印象' },
    { image: getImagePath('/src/assets/background/History2024.jpg'), title: '历史回顾' },
    { image: getImagePath('/src/assets/background/background.jpg'), title: '精彩瞬间' },
  ],
  itemsPerPage: 4
})

const currentPage = ref(0)
const totalPages = computed(() => Math.ceil(props.items.length / props.itemsPerPage))
const currentPageItems = computed(() => {
  const start = currentPage.value * props.itemsPerPage
  const end = start + props.itemsPerPage
  return props.items.slice(start, end)
})

const activeIndex = ref(-1)
const isExpanded = ref(false)
let isScrolling = false

const contentScroll = ref<HTMLElement | null>(null)
const contentCards = ref<HTMLElement[]>([])
const drawerContainerRef = ref<HTMLElement | null>(null)

const handleDividerClick = () => {
  isExpanded.value = !isExpanded.value
  if (!isExpanded.value) {
    activeIndex.value = -1
  } else if (activeIndex.value === -1) {
    activeIndex.value = 0
    scrollToContent(0)
  }
}

const selectItem = (index: number) => {
  isScrolling = true
  activeIndex.value = index
  isExpanded.value = true
  scrollToContent(index).then(() => {
    setTimeout(() => (isScrolling = false), 500)
  })
}

const scrollToContent = (index: number) => {
  return new Promise<void>((resolve) => {
    if (contentScroll.value && activeIndex.value !== -1) {
      const card = contentCards.value[index]
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(resolve, 300)
      } else resolve()
    } else resolve()
  })
}

let contentObserver: IntersectionObserver | null = null
let rootObserver: IntersectionObserver | null = null

const contentObserverCallback = (entries: IntersectionObserverEntry[]) => {
  if (isScrolling) return
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = parseInt(entry.target.getAttribute('data-index') || '-1')
      if (index !== -1 && activeIndex.value !== index) activeIndex.value = index
    }
  })
}

const rootObserverCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting && isExpanded.value) handleDividerClick()
  })
}

const initContentObserver = () => {
  if (!contentScroll.value) return
  contentObserver = new IntersectionObserver(contentObserverCallback, {
    root: contentScroll.value,
    rootMargin: '0px 0px -95% 0px',
    threshold: 0
  })
  contentCards.value.forEach(card => contentObserver!.observe(card))
}

const initRootObserver = () => {
  if (!drawerContainerRef.value) return
  rootObserver = new IntersectionObserver(rootObserverCallback, {
    root: null,
    threshold: 0
  })
  rootObserver.observe(drawerContainerRef.value)
}

onMounted(() => {
  contentCards.value = Array.from(document.querySelectorAll('.contentCard')) as HTMLElement[]
  initContentObserver()
  initRootObserver()
})

onUnmounted(() => {
  contentObserver?.disconnect()
  rootObserver?.disconnect()
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

/* 目录面板 */
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

.directoryItems {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  position: relative;
  z-index: 1;
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
  overflow: hidden;
}

.directoryItem:hover {
  background: rgba(255, 255, 255, 0.3);
}

.directoryItem.active {
  background: rgba(255, 255, 255, 0.9);
  color: #b71c1c;
}

.directoryItem.expanded {
  min-height: 180px;
}

.itemHeader {
  display: flex;
  align-items: center;
  height: 80px;
}

.itemNumber {
  font-size: 32px;
  font-weight: bold;
  margin-right: 15px;
  color: rgba(255, 255, 255, 0.8);
}

.directoryItem.active .itemNumber {
  color: #d32f2f;
}

.itemTitle {
  font-size: 22px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.directoryItem.active .itemTitle {
  color: #b71c1c;
}

.itemContent {
  padding: 10px 0;
  animation: fadeIn 0.3s ease;
}

.itemDescription {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.directoryItem.active .itemDescription {
  color: rgba(0, 0, 0, 0.8);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 分割线 */
.divider {
  width: 10px;
  background: #C9171D;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.divider:hover {
  background: rgba(211, 47, 47, 0.8);
}

.dividerIcon {
  position: absolute;
  color: white;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 内容面板 */
.contentPanel {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.contentScrollWrapper {
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
}

.contentScrollWrapper.scroll-disabled {
  overflow-y: hidden;
  scroll-behavior: auto;
  scroll-snap-type: none;
}

/* 内容卡片：图片占大部分 */
.contentCard {
  height: 100vh;
  scroll-snap-align: start;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.cardImage {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

.cardOverlay {
  width: 100%;
  padding: 40px;
  background: rgba(0,0,0,0.3);
  color: #fff;
  backdrop-filter: blur(4px);
}

.cardHeader {
  margin-bottom: 20px;
}

.cardSubtitle {
  font-size: 18px;
  opacity: 0.8;
}

.cardTitle {
  font-size: 42px;
  font-weight: bold;
}

.cardDescription {
  font-size: 18px;
  line-height: 1.5;
}
</style>
