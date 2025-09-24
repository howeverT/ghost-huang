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
    <div class="waterfall-container">
      <div
        v-for="(item, index) in currentItems"
        :key="index"
        class="parallax-item"
        @click="handleItemClick(item)"
      >
        <ParallaxCard
          :backgroundImage="getImagePath(item.image || '/src/assets/background/History2024.jpg')"
          :number="index + 1"
          :defaultHeight="600 + Math.random() * 300"
          class="gallery-card"
          rounded
        >
          <div class="card-caption">
            <h3>{{ item.title }}</h3>
            <p>{{ item.date }}</p>
          </div>
        </ParallaxCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getImagePath } from '@/utils/pathUtils'
import ParallaxCard from '@/components/Card/MiniCard/ParallaxCard.vue'
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

// 获取当前显示的items（优先使用tabs，否则使用items）
const currentItems = computed(() => {
  if (props.tabs && props.tabs.length > 0) {
    const activeTabData = props.tabs.find((tab) => tab.id === activeTab.value)
    return activeTabData ? activeTabData.items : []
  }
  return props.items
})

// Tab切换函数
const setActiveTab = (tabId: string) => {
  if (activeTab.value !== tabId) {
    // 笔刷和内容同时淡出
    const itemsContainer = document.querySelector(
      '.concert-item-section .items-container',
    ) as HTMLElement
    const activeTabElement = document.querySelector(
      '.concert-item-section .tab-item.active',
    ) as HTMLElement

    if (itemsContainer) {
      itemsContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
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

      // 延迟一点让新tab的笔刷出现
      setTimeout(() => {
        const newActiveTabElement = document.querySelector(
          '.concert-item-section .tab-item.active',
        ) as HTMLElement
        if (newActiveTabElement) {
          newActiveTabElement.style.setProperty('--brush-opacity', '1')
        }

        // 内容淡入
        if (itemsContainer) {
          itemsContainer.style.opacity = '1'
          itemsContainer.style.transform = 'translateY(0)'
        }
      }, 100)
    }, 300)
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
  text-align: center;
  margin-bottom: 2rem;
  width: 100%;
  max-width: calc(100vw - 3rem);
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
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
  width: 100%;
  max-width: calc(100vw - 3rem);
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
}

.tabs-list {
  display: flex;
  gap: 0;
  position: relative;
  justify-content: center;
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

.waterfall-container {
  max-width: calc(100vw - 3rem);
  margin: 0 auto;
  column-count: 3;
  column-gap: 2rem;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

@media (max-width: 1200px) {
  .waterfall-container {
    column-count: 2;
    column-gap: 1.5rem;
  }

  .section-title {
    text-align: center !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .tabs-section {
    text-align: center !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .waterfall-container {
    column-count: 2;
    column-gap: 1rem;
  }

  .card-caption h3 {
    font-size: 1.2rem;
  }

  .card-caption p {
    font-size: 0.9rem;
  }
}

.parallax-item {
  display: inline-block;
  width: 100%;
  position: relative;
  cursor: pointer;
  transition: all 0.5s ease;
  opacity: 1;
  transform: translateY(0);
  margin-bottom: 2rem;
  break-inside: avoid;
}

.parallax-item:hover {
  transform: translateY(-5px);
}

.gallery-card {
  width: 100%;
  margin: 0 !important;
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
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(0, 0, 0, 0.3) 80%,
    transparent 100%
  );
}

.card-caption h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  color: white;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.card-caption p {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  line-height: 1.5;
  color: white;
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

  .waterfall-container {
    column-count: 1;
    column-gap: 1.5rem;
  }

  .parallax-item {
    width: 100%;
    max-width: 400px;
  }

  .card-caption {
    padding: 1rem;
  }

  .card-caption h3 {
    font-size: 1.9rem;
  }

  .card-caption p {
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

  .waterfall-container {
    column-count: 1;
    column-gap: 1rem;
  }

  .parallax-item {
    width: 100%;
    max-width: 350px;
  }

  .card-caption {
    padding: 0.8rem;
  }

  .card-caption h3 {
    font-size: 1.7rem;
  }

  .card-caption p {
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
