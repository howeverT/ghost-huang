<template>
  <div class="page-container" ref="containerRef">
    <!-- 背景层 -->
    <div class="background-layer">
      <div
        v-for="(page, index) in pages"
        :key="`bg-${index}`"
        class="background-image"
        :class="{ active: currentPage === index }"
        :style="{
          backgroundImage: `url(${page.backgroundImage})`,
          transform: `translateY(${getBackgroundOffset(index)}px)`
        }"
      />
    </div>

    <!-- 页面内容层 -->
    <div class="pages-wrapper" ref="pagesRef">
      <section
        v-for="(page, index) in pages"
        :key="`page-${index}`"
        class="page-section"
        :class="[page.theme, { active: currentPage === index }]"
        :data-page="index"
      >
        <div class="page-content">
          <div class="content-inner" :class="page.contentAlign">
            <h1 class="page-title" v-if="page.title">{{ page.title }}</h1>
            <p class="page-subtitle" v-if="page.subtitle">{{ page.subtitle }}</p>
            <div class="page-description" v-if="page.description">
              {{ page.description }}
            </div>
            <div class="page-actions" v-if="page.actions">
              <button
                v-for="action in page.actions"
                :key="action.text"
                class="action-btn"
                :class="action.type"
                @click="action.handler"
              >
                {{ action.text }}
              </button>
            </div>
          </div>
        </div>

        <!-- 页面指示器 -->
        <div class="page-indicator" v-if="index < pages.length - 1">
          <div class="scroll-hint">
            <span>滚动继续</span>
            <div class="scroll-arrow"></div>
          </div>
        </div>
      </section>
    </div>

    <!-- 导航点 -->
    <nav class="page-nav">
      <button
        v-for="(page, index) in pages"
        :key="`nav-${index}`"
        class="nav-dot"
        :class="{ active: currentPage === index }"
        @click="scrollToPage(index)"
        :title="page.title"
      >
        <span class="nav-label">{{ page.navLabel || page.title }}</span>
      </button>
    </nav>

    <!-- 进度条 -->
    <div class="scroll-progress">
      <div class="progress-bar" :style="{ width: `${scrollProgress}%` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

interface PageAction {
  text: string
  type?: 'primary' | 'secondary' | 'outline'
  handler: () => void
}

interface PageData {
  title: string
  subtitle?: string
  description?: string
  backgroundImage: string
  theme: 'dark' | 'light' | 'gradient'
  contentAlign: 'center' | 'left' | 'right'
  navLabel?: string
  actions?: PageAction[]
}

// 页面数据
const pages = ref<PageData[]>([
  {
    title: '欢迎来到我们的世界',
    subtitle: '探索无限可能',
    description: '这里是一个充满创意和灵感的地方，我们用心创造每一个细节，为您带来最好的体验。',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    theme: 'dark',
    contentAlign: 'center',
    navLabel: '首页',
    actions: [
      { text: '开始探索', type: 'primary', handler: () => scrollToPage(1) },
      { text: '了解更多', type: 'outline', handler: () => console.log('了解更多') }
    ]
  },
  {
    title: '精美设计',
    subtitle: '每一个像素都有意义',
    description: '我们相信好的设计不仅仅是美观，更是功能与美学的完美结合。',
    backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
    theme: 'light',
    contentAlign: 'left',
    navLabel: '设计',
    actions: [
      { text: '查看作品', type: 'primary', handler: () => console.log('查看作品') }
    ]
  },
  {
    title: '卓越性能',
    subtitle: '速度与质量并存',
    description: '我们不断优化每一行代码，确保为用户提供流畅、快速的使用体验。',
    backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop',
    theme: 'gradient',
    contentAlign: 'right',
    navLabel: '性能'
  },
  {
    title: '联系我们',
    subtitle: '让我们一起创造奇迹',
    description: '准备好开始您的项目了吗？我们期待与您合作，共同创造令人惊叹的作品。',
    backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
    theme: 'dark',
    contentAlign: 'center',
    navLabel: '联系',
    actions: [
      { text: '立即联系', type: 'primary', handler: () => console.log('立即联系') },
      { text: '获取报价', type: 'secondary', handler: () => console.log('获取报价') }
    ]
  }
])

const containerRef = ref<HTMLElement>()
const pagesRef = ref<HTMLElement>()
const currentPage = ref(0)
const isScrolling = ref(false)
const scrollProgress = ref(0)

// 计算背景图偏移
const getBackgroundOffset = (index: number) => {
  const diff = index - currentPage.value
  return diff * -100 // 背景图移动距离
}

// 滚动到指定页面
const scrollToPage = (pageIndex: number) => {
  if (isScrolling.value || !pagesRef.value) return

  isScrolling.value = true
  const targetY = pageIndex * window.innerHeight

  pagesRef.value.scrollTo({
    top: targetY,
    behavior: 'smooth'
  })

  setTimeout(() => {
    isScrolling.value = false
  }, 1000)
}

// 处理滚动事件
const handleScroll = () => {
  if (!pagesRef.value || isScrolling.value) return

  const scrollTop = pagesRef.value.scrollTop
  const pageHeight = window.innerHeight
  const totalHeight = pages.value.length * pageHeight

  // 计算当前页面
  const newCurrentPage = Math.round(scrollTop / pageHeight)
  if (newCurrentPage !== currentPage.value && newCurrentPage >= 0 && newCurrentPage < pages.value.length) {
    currentPage.value = newCurrentPage
  }

  // 计算滚动进度
  scrollProgress.value = Math.min(100, (scrollTop / (totalHeight - pageHeight)) * 100)
}

// 处理鼠标滚轮事件
const handleWheel = (e: WheelEvent) => {
  if (isScrolling.value) {
    e.preventDefault()
    return
  }

  e.preventDefault()

  const delta = e.deltaY > 0 ? 1 : -1
  const nextPage = Math.max(0, Math.min(pages.value.length - 1, currentPage.value + delta))

  if (nextPage !== currentPage.value) {
    scrollToPage(nextPage)
  }
}

// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  if (isScrolling.value) return

  switch (e.key) {
    case 'ArrowDown':
    case 'PageDown':
      e.preventDefault()
      if (currentPage.value < pages.value.length - 1) {
        scrollToPage(currentPage.value + 1)
      }
      break
    case 'ArrowUp':
    case 'PageUp':
      e.preventDefault()
      if (currentPage.value > 0) {
        scrollToPage(currentPage.value - 1)
      }
      break
    case 'Home':
      e.preventDefault()
      scrollToPage(0)
      break
    case 'End':
      e.preventDefault()
      scrollToPage(pages.value.length - 1)
      break
  }
}

// 处理触摸事件
let touchStartY = 0
const handleTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0].clientY
}

const handleTouchEnd = (e: TouchEvent) => {
  if (isScrolling.value) return

  const touchEndY = e.changedTouches[0].clientY
  const diff = touchStartY - touchEndY

  if (Math.abs(diff) > 50) { // 最小滑动距离
    const direction = diff > 0 ? 1 : -1
    const nextPage = Math.max(0, Math.min(pages.value.length - 1, currentPage.value + direction))

    if (nextPage !== currentPage.value) {
      scrollToPage(nextPage)
    }
  }
}

onMounted(() => {
  if (pagesRef.value) {
    pagesRef.value.addEventListener('scroll', handleScroll)
    pagesRef.value.addEventListener('wheel', handleWheel, { passive: false })
    pagesRef.value.addEventListener('touchstart', handleTouchStart)
    pagesRef.value.addEventListener('touchend', handleTouchEnd)
  }

  document.addEventListener('keydown', handleKeydown)

  // 初始化滚动位置
  nextTick(() => {
    scrollToPage(0)
  })
})

onUnmounted(() => {
  if (pagesRef.value) {
    pagesRef.value.removeEventListener('scroll', handleScroll)
    pagesRef.value.removeEventListener('wheel', handleWheel)
    pagesRef.value.removeEventListener('touchstart', handleTouchStart)
    pagesRef.value.removeEventListener('touchend', handleTouchEnd)
  }

  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.page-container {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 背景层 */
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%; /* 稍微大一些以支持视差效果 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.background-image.active {
  opacity: 1;
}

/* 页面内容层 */
.pages-wrapper {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.pages-wrapper::-webkit-scrollbar {
  display: none;
}

.page-section {
  height: 100vh;
  width: 100%;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
  box-sizing: border-box;
}

/* 页面内容 */
.page-content {
  width: 100%;
  max-width: 1200px;
  z-index: 2;
}

.content-inner {
  max-width: 800px;
  animation: fadeInUp 1s ease-out;
}

.content-inner.center {
  margin: 0 auto;
  text-align: center;
}

.content-inner.left {
  text-align: left;
}

.content-inner.right {
  margin-left: auto;
  text-align: right;
}

.page-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.page-subtitle {
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  margin-bottom: 2rem;
  opacity: 0.9;
  font-weight: 300;
}

.page-description {
  font-size: clamp(1rem, 2vw, 1.3rem);
  line-height: 1.6;
  margin-bottom: 3rem;
  opacity: 0.8;
  max-width: 600px;
}

.content-inner.center .page-description {
  margin-left: auto;
  margin-right: auto;
}

.content-inner.right .page-description {
  margin-left: auto;
}

/* 主题样式 */
.page-section.dark {
  color: white;
}

.page-section.dark::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1;
}

.page-section.light {
  color: #333;
}

.page-section.light::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  z-index: 1;
}

.page-section.gradient {
  color: white;
}

.page-section.gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%);
  z-index: 1;
}

/* 按钮样式 */
.page-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.content-inner.center .page-actions {
  justify-content: center;
}

.content-inner.right .page-actions {
  justify-content: flex-end;
}

.action-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.action-btn.primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.action-btn.primary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

.action-btn.outline {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.action-btn.outline:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 页面指示器 */
.page-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  animation: bounce 2s infinite;
}

.scroll-arrow {
  width: 1px;
  height: 2rem;
  background: rgba(255, 255, 255, 0.5);
  margin-top: 0.5rem;
  position: relative;
}

.scroll-arrow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -3px;
  width: 7px;
  height: 7px;
  border-right: 1px solid rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.8);
  transform: rotate(45deg);
}

/* 导航点 */
.page-nav {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.nav-dot:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.2);
}

.nav-dot.active {
  background: white;
  border-color: white;
}

.nav-label {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 0.9rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
}

.nav-dot:hover .nav-label {
  opacity: 1;
}

/* 进度条 */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 10;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

/* 动画 */
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

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-10px) translateX(-50%);
  }
  60% {
    transform: translateY(-5px) translateX(-50%);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .page-section {
    padding: 1rem;
  }

  .page-nav {
    right: 1rem;
  }

  .nav-label {
    display: none;
  }

  .page-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .content-inner.center .page-actions,
  .content-inner.right .page-actions {
    align-items: stretch;
  }

  .action-btn {
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-indicator {
    bottom: 1rem;
  }

  .scroll-hint {
    font-size: 0.8rem;
  }
}
</style>
