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
                  v-for="(item, itemIndex) in sortedItems(tab.items)"
                  :key="itemIndex"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="content-item"
                >
                  {{ item.date }} - {{ item.title }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧背景图片区域 -->
        <div class="background-container">
          <div class="background-image" :style="{ backgroundImage: `url(${currentBackgroundImage})` }">
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

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  // 切换tab后重新计算高度
  nextTick(() => {
    calculateLeftContentHeight()
  })
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
  if (tabsContainerRef.value) {
    leftContentHeight.value = tabsContainerRef.value.offsetHeight
  }
}

// 组件挂载后计算高度
onMounted(() => {
  calculateLeftContentHeight()
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
  min-height: 90vh;
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
