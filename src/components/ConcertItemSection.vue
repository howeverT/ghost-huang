<template>
  <div class="concert-item-section">
    <div v-if="title" class="section-title">
      <h2>{{ title }}</h2>
      <p class="section-description">首页仅显示6个视频链接，可下拉点击下面的箭头来切换页数</p>
    </div>

    <!-- Tabs区域 -->
    <div v-if="tabs && tabs.length > 0" class="tabs-section">
      <div class="tabs-list">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>
    </div>
    <div class="items-container">
      <div class="left-column">
        <div
          v-for="(item, index) in currentLeftItems"
          :key="index"
          class="item-content"
          @click="handleItemClick(item)"
        >
          <div class="item-image">
            <div
              class="image-bg"
              :style="{
                backgroundImage: `url(${item.image || '/src/assets/background/History2024.jpg'})`,
              }"
            ></div>
          </div>
          <div class="item-text">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-date">{{ item.date }}</p>
          </div>
        </div>
      </div>
      <div class="right-column">
        <div
          v-for="(item, index) in currentRightItems"
          :key="index"
          class="item-content"
          @click="handleItemClick(item)"
        >
          <div class="item-image">
            <div
              class="image-bg"
              :style="{
                backgroundImage: `url(${item.image || '/src/assets/background/History2024.jpg'})`,
              }"
            ></div>
          </div>
          <div class="item-text">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-date">{{ item.date }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页控制 -->
    <div class="pagination-controls">
      <button class="pagination-btn prev-btn" :disabled="currentPage === 0" @click="prevPage">
        <img src="/src/assets/svg/chevron-icon.svg" alt="上一页" class="chevron-icon prev-icon" />
      </button>
      <span class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button
        class="pagination-btn next-btn"
        :disabled="currentPage === totalPages - 1"
        @click="nextPage"
      >
        <img src="/src/assets/svg/chevron-icon.svg" alt="下一页" class="chevron-icon next-icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
interface ConcertItem {
  title: string
  date: string
  image?: string
  url?: string
}

interface TabItem {
  id: string
  label: string
  items: ConcertItem[]
  backgroundImage: string
  imageTitle?: string
  imageCaption?: string
}

interface Props {
  items: ConcertItem[]
  title?: string
  tabs?: TabItem[]
}

const props = defineProps<Props>()

// Tabs相关
const activeTab = ref(props.tabs && props.tabs.length > 0 ? props.tabs[0].id : '')

// 分页相关
const currentPage = ref(0)
const itemsPerPage = 6

// 获取当前显示的items（优先使用tabs，否则使用items）
const currentItems = computed(() => {
  if (props.tabs && props.tabs.length > 0) {
    const activeTabData = props.tabs.find((tab) => tab.id === activeTab.value)
    return activeTabData ? activeTabData.items : []
  }
  return props.items
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(currentItems.value.length / itemsPerPage)
})

// 获取当前页的items
const currentPageItems = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return currentItems.value.slice(start, end)
})

// 将当前页的items分配到左右两列
const currentLeftItems = computed(() => {
  return currentPageItems.value.filter((_, index) => index % 2 === 0)
})

const currentRightItems = computed(() => {
  return currentPageItems.value.filter((_, index) => index % 2 === 1)
})

// Tab切换函数
const setActiveTab = (tabId: string) => {
  if (activeTab.value !== tabId) {
    // 笔刷和内容同时淡出
    const itemsContainer = document.querySelector('.items-container')
    const activeTabElement = document.querySelector('.tab-item.active')

    if (itemsContainer) {
      itemsContainer.style.opacity = '0'
      itemsContainer.style.transform = 'translateY(20px)'
    }

    // 直接操作CSS变量来控制笔刷的opacity
    if (activeTabElement) {
      activeTabElement.style.setProperty('--brush-opacity', '0')
    }

    // 延迟切换内容
    setTimeout(() => {
      activeTab.value = tabId
      currentPage.value = 0 // 切换tab时重置到第一页

      // 延迟一点让新tab的笔刷出现
      setTimeout(() => {
        const newActiveTabElement = document.querySelector('.tab-item.active')
        if (newActiveTabElement) {
          newActiveTabElement.style.setProperty('--brush-opacity', '1')
        }

        // 内容淡入
        if (itemsContainer) {
          itemsContainer.style.opacity = '1'
          itemsContainer.style.transform = 'translateY(0)'
        }
      }, 100)
    }, 200)
  }
}

// 分页控制函数
const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

// 处理item点击
const handleItemClick = (item: ConcertItem) => {
  if (item.url) {
    window.open(item.url, '_blank')
  }
}
</script>

<style scoped>
.concert-item-section {
  width: 100%;
  padding: 3rem 2rem;
  background-color: white;
}

.section-title {
  text-align: left;
  margin-bottom: 2rem;
  margin-left: calc(50% - 500px - 2rem);
}

.section-title h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1rem 0;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.section-description {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* Tabs样式 */
.tabs-section {
  margin-bottom: 3rem;
  margin-left: calc(50% - 500px - 2rem);
}

.tabs-list {
  display: flex;
  gap: 0;
  position: relative;
}

.tab-item {
  position: relative;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.tab-item.active {
  color: #333;
  font-weight: 600;
}

.tab-label {
  font-size: 1.1rem;
  color: #666;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  transition: color 0.3s ease;
}

.tab-item.active .tab-label {
  color: #333;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  width: 450px;
  height: 30px;
  background-image: url('/src/assets/svg/bishua.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 1;
  opacity: var(--brush-opacity, 1);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.items-container {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 4rem;
  transition: all 0.5s ease;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transform: translateY(5rem);
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.item-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 500px;
  position: relative;
  cursor: pointer;
  transition: all 0.5s ease;
  opacity: 1;
  transform: translateY(0);
}

.item-content:hover {
  transform: translateY(-5px);
}

.item-image {
  width: 100%;
  height: 600px;
  position: relative;
  margin-bottom: 1rem;
}

.image-bg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.item-text {
  padding: 0.5rem 0;
  text-align: left;
  width: 100%;
}

.item-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.item-date {
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .concert-item-section {
    padding: 2rem 1rem;
  }

  .section-title {
    margin-bottom: 2rem;
  }

  .section-title h2 {
    font-size: 2rem;
  }

  .section-description {
    font-size: 1rem;
  }

  .tabs-section {
    margin-left: calc(50% - 400px - 1rem);
    margin-bottom: 2.5rem;
  }

  .tab-item.active::after {
    width: 400px;
    height: 25px;
  }

  .tab-item {
    padding: 0.8rem 1.5rem;
  }

  .tab-label {
    font-size: 1rem;
  }

  .items-container {
    gap: 2rem;
  }

  .left-column {
    gap: 1.5rem;
    transform: translateY(3.5rem);
  }

  .right-column {
    gap: 1.5rem;
  }

  .item-content {
    width: 400px;
  }

  .item-image {
    height: 500px;
  }

  .item-text {
    padding: 0.3rem 0;
  }

  .item-title {
    font-size: 1.9rem;
  }

  .item-date {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .concert-item-section {
    padding: 1.5rem 0.5rem;
  }

  .section-title {
    margin-bottom: 1.5rem;
  }

  .section-title h2 {
    font-size: 1.8rem;
  }

  .section-description {
    font-size: 0.9rem;
  }

  .tabs-section {
    margin-left: calc(50% - 350px - 0.75rem);
    margin-bottom: 2rem;
  }

  .tab-item.active::after {
    width: 350px;
    height: 20px;
  }

  .tab-item {
    padding: 0.6rem 1rem;
  }

  .tab-label {
    font-size: 0.9rem;
  }

  .items-container {
    gap: 1.5rem;
  }

  .left-column {
    gap: 1rem;
    transform: translateY(2.5rem);
  }

  .right-column {
    gap: 1rem;
  }

  .item-content {
    width: 350px;
  }

  .item-image {
    height: 450px;
  }

  .item-text {
    padding: 0.2rem 0;
  }

  .item-title {
    font-size: 1.7rem;
  }

  .item-date {
    font-size: 0.85rem;
  }
}

/* 分页控制样式 */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 4rem;
}

.pagination-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.chevron-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.prev-icon {
  transform: rotate(90deg);
}

.next-icon {
  transform: rotate(-90deg);
}

.page-info {
  font-size: 1.1rem;
  color: #666;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 500;
}

/* 分页控制响应式设计 */
@media (max-width: 768px) {
  .pagination-controls {
    gap: 1.5rem;
    margin-top: 3rem;
  }

  .chevron-icon {
    width: 20px;
    height: 20px;
  }

  .page-info {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .pagination-controls {
    gap: 1rem;
    margin-top: 2.5rem;
  }

  .chevron-icon {
    width: 18px;
    height: 18px;
  }

  .page-info {
    font-size: 0.9rem;
  }
}
</style>
