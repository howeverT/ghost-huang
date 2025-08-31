<template>
  <div class="tabbed-content-section">
    <div class="content-wrapper">
      <div class="content-layout">
        <!-- 左侧Tabs区域 -->
        <div class="tabs-container" ref="tabsContainerRef">
          <div class="tabs-header">
            <h2 class="section-title">{{ props.title }}</h2>
          </div>

          <!-- 横向Tabs -->
          <div class="tabs-list">
            <div
              v-for="(tab, index) in tabs"
              :key="tab.id"
              class="tab-item"
              :class="{ active: activeTab === tab.id }"
              @click="setActiveTab(tab.id)"
            >
              <span class="tab-label">{{ tab.label }}</span>
              <div class="ink-line" v-if="activeTab === tab.id"></div>
            </div>
          </div>

          <!-- Tab内容区域 -->
          <div class="tab-content">
            <div
              v-for="(tab, index) in tabs"
              :key="tab.id"
              class="content-panel"
              :class="{ active: activeTab === tab.id }"
            >
              <div class="content-items">
                <a
                  v-for="(item, itemIndex) in paginatedItems(tab.items)"
                  :key="itemIndex"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="content-item"
                >
                  {{ item.date }} - {{ item.title }}
                </a>
              </div>
              <!-- 走马灯箭头按钮 -->
              <div v-if="sortedItems(tab.items).length > itemsPerPage" class="carousel-arrows">
                <div v-if="currentPage > 0" class="arrow prev" @click="prevPage">
                  <img src="/src/assets/svg/chevron-icon.svg" alt="上一页" />
                </div>
                <div v-if="currentPage < maxPage(tab.items)" class="arrow next" @click="nextPage">
                  <img src="/src/assets/svg/chevron-icon.svg" alt="下一页" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧背景图片区域 -->
        <div class="background-container">
          <div class="background-image" :style="{
            backgroundImage: `url(${currentBackgroundImage})`,
            height: '500px'
          }">
            <div class="image-overlay">
              <h3 class="image-title">{{ currentTabData?.imageTitle || '背景图片' }}</h3>
              <p class="image-caption">{{ currentTabData?.imageCaption || '点击左侧标签查看不同内容' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

interface TabItem {
  id: string
  label: string
  items: {
    title: string
    url: string
    date: string
  }[]
  backgroundImage: string
  imageTitle?: string
  imageCaption?: string
}

interface Props {
  tabs: TabItem[]
  title: string
}

const props = defineProps<Props>()

const activeTab = ref('part1')
const tabsContainerRef = ref<HTMLElement>()
const leftContentHeight = ref(0)
const currentPage = ref(0) // 当前页码
const itemsPerPage = ref(5) // 每页显示5个item

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  // 只在第一次加载时计算高度，切换tab后不再重新计算
}

// 计算最大页码
const maxPage = (items: any[]) => {
  return Math.ceil(items.length / itemsPerPage.value) - 1
}

// 获取当前页的items
const paginatedItems = (items: any[]) => {
  const start = currentPage.value * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedItems(items).slice(start, end)
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

// 下一页
const nextPage = () => {
  const maxPageValue = maxPage(sortedItems(currentTabData.value?.items || []))
  if (currentPage.value < maxPageValue) {
    currentPage.value++
  }
}

const currentTabData = computed(() => {
  return props.tabs.find(tab => tab.id === activeTab.value)
})

const currentBackgroundImage = computed(() => {
  return currentTabData.value?.backgroundImage || '/src/assets/background/background.jpg'
})

const sortedItems = (items: any[]) => {
  return [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// 计算左边内容的实际高度
const calculateLeftContentHeight = () => {
  // 找到item最多的tab
  const tabWithMostItems = props.tabs.reduce((maxTab, currentTab) =>
    currentTab.items.length > maxTab.items.length ? currentTab : maxTab
  )

  // 计算总高度：包含必要的padding和margin
  const titleHeight = 80 // 标题大约80px
  const titleMarginBottom = 32 // margin-bottom: 2rem = 32px
  const tabsListHeight = 60 // tabs列表大约60px
  const tabsMarginBottom = 32 // margin-bottom: 2rem = 32px
  const itemHeight = 32 // 每个item 32px
  const itemSpacing = 16 // item之间的间距
  const totalItemHeight = tabWithMostItems.items.length * (itemHeight + itemSpacing)
  const contentBottomPadding = 32 // 内容区域底部的padding

  leftContentHeight.value = titleHeight + titleMarginBottom + tabsListHeight + tabsMarginBottom + totalItemHeight + contentBottomPadding

  console.log('计算出的左边内容高度:', leftContentHeight.value)
  console.log('item最多的tab:', tabWithMostItems.label, 'item数量:', tabWithMostItems.items.length)
}

// 组件挂载后计算高度
onMounted(() => {
  // 延迟一点时间确保DOM完全渲染
  setTimeout(() => {
    calculateLeftContentHeight()
  }, 100)
})
</script>

<style scoped>
.tabbed-content-section {
  width: 100%;
  background-color: white;
  padding: 3rem 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  width: 100%;
}

.content-layout {
  display: flex;
  gap: 6rem;
  align-items: flex-start;
  min-height: 70vh;
  padding: 0 1rem;
}

/* 左侧Tabs区域 */
.tabs-container {
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  margin-left: 8em;
  justify-content: flex-start;
}

.tabs-header {
  margin-bottom: 2rem;
  text-align: left;
}

.section-title {
  font-size: 2rem;
  color: #000;
  margin: 0;
  font-weight: 900;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

/* 横向Tabs */
.tabs-list {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  justify-content: flex-start;
}

.tab-item {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;
}

.tab-item:hover {
  color: #000;
}

.tab-label {
  font-size: 1.2rem;
  color: #000;
  font-weight: 900;
  transition: color 0.3s ease;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.tab-item.active .tab-label {
  color: #000;
  font-weight: 900;
}

/* 水墨笔迹横线 */
.ink-line {
  position: absolute;
  bottom: -1rem;
  left: 0;
  right: 0;
  height: 20px;
  background-image: url('/src/assets/svg/bishua.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  animation: inkFlow 0.6s ease-out;
}

/* 走马灯箭头样式 */
.carousel-arrows {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.arrow {
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.arrow img {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.arrow:hover img {
  opacity: 1;
}

.arrow.prev img {
  transform: rotate(180deg);
}

.arrow.next img {
  transform: rotate(0deg);
}

@keyframes inkFlow {
  0% {
    transform: scaleX(0);
    opacity: 0;
  }
  100% {
    transform: scaleX(1);
    opacity: 0.6;
  }
}

/* Tab内容区域 */
.tab-content {
  flex: 1;
  position: relative;
}

.content-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
  pointer-events: none;
}

.content-panel.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.content-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-item {
  color: #000;
  text-decoration: none;
  font-size: 1.1rem;
  line-height: 1.6;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  border-bottom: 1px solid transparent;
  font-weight: 600;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.content-item:hover {
  color: #000;
  border-bottom-color: #000;
  transform: translateX(5px);
}

/* 右侧背景图片区域 */
.background-container {
  flex: 1;
  max-width: 500px;
  position: relative;
  margin-right: 8rem;
  height: fit-content;
  margin-top: 3rem;
}

.background-image {
  width: 100%;
  height: auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem;
  text-align: center;
}

.image-title {
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.image-caption {
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-layout {
    flex-direction: column;
    gap: 2rem;
  }

  .tabs-container,
  .background-container {
    max-width: none;
  }

  .background-image {
    min-height: 50vh;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 1rem;
  }

  .tabs-container {
    padding: 1rem 0;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .tabs-list {
    gap: 1.5rem;
  }

  .tab-label {
    font-size: 1.1rem;
  }

  .content-item {
    font-size: 1rem;
  }

  .image-overlay {
    padding: 1.5rem;
  }

  .image-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .tabbed-content-section {
    padding: 2rem 0;
  }

  .tabs-container {
    padding: 0.5rem 0;
  }

  .tabs-list {
    gap: 1rem;
    flex-wrap: wrap;
  }

  .tab-item {
    padding: 0.3rem 0;
  }

  .content-item {
    font-size: 0.95rem;
  }
}
</style>
