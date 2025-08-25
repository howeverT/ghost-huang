<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { VideoPlay } from '@element-plus/icons-vue'

const pageLoaded = ref(false)
const currentIndex = ref(0)
const contentVisible = ref(true)

// 定义时间轴数据类型
interface TimelineItem {
  year: string
  links: {
    link_title: string
    link: string
    icon: string
  }[]
  image?: string[]
}

// 时间轴数据 - 从JSON文件读取
const timelineData = ref<TimelineItem[]>([])

// 从JSON文件加载数据
const loadTimelineData = async () => {
  try {
    const response = await fetch('/src/assets/page_data/history/history.json')
    const data = await response.json()
    timelineData.value = data
    console.log('成功加载数据:', data)
    console.log('数据长度:', data.length)
    console.log('当前索引:', currentIndex.value)
    console.log('当前数据:', data[currentIndex.value])
  } catch (error) {
    console.error('加载时间轴数据失败:', error)
    // 如果加载失败，使用默认数据
    timelineData.value = []
  }
}

// 切换到下一张图片
const nextImage = () => {
  if (timelineData.value.length === 0) return

  console.log('点击下一张，当前索引:', currentIndex.value)
  console.log('数据长度:', timelineData.value.length)

  // 先渐隐当前内容
  contentVisible.value = false

  setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % timelineData.value.length
    console.log('切换到新索引:', currentIndex.value)
    console.log('新数据:', timelineData.value[currentIndex.value])

    // 渐显新内容
    setTimeout(() => {
      contentVisible.value = true
    }, 100)
  }, 300)
}

// 切换到上一张图片
const prevImage = () => {
  if (timelineData.value.length === 0) return

  console.log('点击上一张，当前索引:', currentIndex.value)
  console.log('数据长度:', timelineData.value.length)

  // 先渐隐当前内容
  contentVisible.value = false

  setTimeout(() => {
    currentIndex.value =
      currentIndex.value === 0 ? timelineData.value.length - 1 : currentIndex.value - 1
    console.log('切换到新索引:', currentIndex.value)
    console.log('新数据:', timelineData.value[currentIndex.value])

    // 渐显新内容
    setTimeout(() => {
      contentVisible.value = true
    }, 100)
  }, 300)
}

// 获取当前显示的数据
const currentData = computed(() => {
  if (timelineData.value.length === 0) return null
  return timelineData.value[currentIndex.value]
})

// 根据类型获取链接
const getLinksByType = (type: string) => {
  if (!currentData.value?.links) return []
  return currentData.value.links.filter((link) => link.icon === type)
}

// 处理指示器点击
const handleIndicatorClick = (index: number) => {
  contentVisible.value = false
  setTimeout(() => {
    currentIndex.value = index
    setTimeout(() => {
      contentVisible.value = true
    }, 100)
  }, 300)
}

onMounted(() => {
  // 加载时间轴数据
  loadTimelineData()

  setTimeout(() => {
    pageLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="history-page" :class="{ loaded: pageLoaded }">
    <!-- 全屏背景走马灯 -->
    <div class="background-slideshow">
      <div
        class="background-image"
        :style="{
          backgroundImage: `url(${currentData?.image?.[0] || '/src/assets/background/background.jpg'})`,
        }"
      ></div>

      <!-- 半透明黑色蒙版 -->
      <div class="overlay-mask"></div>

      <!-- 导航箭头 -->
      <div class="navigation-arrows">
        <div class="arrow left-arrow" @click="prevImage" title="上一张">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="arrow right-arrow" @click="nextImage" title="下一张">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <!-- 指示器 -->
      <div class="indicators">
        <div
          v-for="(item, index) in timelineData"
          :key="item.year"
          class="indicator"
          :class="{ active: index === currentIndex }"
          @click="handleIndicatorClick(index)"
        ></div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-overlay content-right">
      <div class="content-container" :class="{ visible: contentVisible }">
        <!-- 介绍文字 -->
        <div class="description-section">
          <h3>{{ currentData?.year }}年</h3>

          <!-- 视频分类 -->
          <div v-if="getLinksByType('video').length > 0" class="category-section">
            <h4 class="category-title">🎥 视频</h4>
            <div class="links-grid">
              <a
                v-for="(link, index) in getLinksByType('video')"
                :key="index"
                :href="link.link"
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                <el-icon><VideoPlay /></el-icon>
                <span class="link-text">{{ link.link_title }}</span>
              </a>
            </div>
          </div>

          <!-- 综艺分类 -->
          <div v-if="getLinksByType('variety').length > 0" class="category-section">
            <h4 class="category-title">📺 综艺</h4>
            <div class="links-grid">
              <a
                v-for="(link, index) in getLinksByType('variety')"
                :key="index"
                :href="link.link"
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="link-text">{{ link.link_title }}</span>
              </a>
            </div>
          </div>

          <!-- 音乐节分类 -->
          <div v-if="getLinksByType('festival').length > 0" class="category-section">
            <h4 class="category-title">⭐ 音乐节/演出</h4>
            <div class="links-grid">
              <a
                v-for="(link, index) in getLinksByType('festival')"
                :key="index"
                :href="link.link"
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="link-text">{{ link.link_title }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 确保背景完全覆盖 */
:deep(body),
:deep(html) {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}

/* 确保没有滚动条 */
:deep(*) {
  box-sizing: border-box;
}

/* 确保整个页面没有滚动条 */
:deep(#app) {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

/* 确保main-content没有额外的margin或padding */
:deep(.main-content) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw !important;
  min-height: 100vh !important;
}

:deep(.content-wrapper) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw !important;
  max-width: 100vw !important;
}

.history-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.8s ease-out;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: none;
  min-width: 100vw;
  min-height: 100vh;
}

.history-page.loaded {
  opacity: 1;
}

/* 全屏背景走马灯 */
.background-slideshow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  transition: all 0.6s ease-in-out;
  z-index: 1;
  min-width: 100vw;
  min-height: 100vh;
}

/* 半透明黑色蒙版 */
.overlay-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2;
  pointer-events: none;
}

/* 导航箭头 */
.navigation-arrows {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 200;
  pointer-events: auto;
}

.arrow {
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.arrow:hover {
  background: rgba(0, 0, 0, 0.5);
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 指示器 */
.indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 200;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
}

.indicator.active {
  background: #667eea;
  border-color: #667eea;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
}

/* 内容覆盖层 */
.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 150;
  display: flex;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
  pointer-events: none;
}

/* 右侧布局 */
.content-right {
  justify-content: flex-end;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width: 35vw;
  width: 100%;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-in-out;
  pointer-events: auto;
  position: relative;
  z-index: 10;
}

/* 右侧布局时的边距 */
.content-right .content-container {
  margin-right: 8rem;
}

.content-container.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 介绍文字样式 */
.description-section {
  width: 100%;
  text-align: left;
  padding: 2.5rem;
  min-height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 100%;
  overflow: hidden;
  margin-top: 2rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

/* 隐藏滚动条 */
.description-section::-webkit-scrollbar {
  display: none;
}

/* 分类标题 */
.category-title {
  font-size: 1.5rem;
  color: #667eea;
  margin-bottom: 1rem;
  margin-top: 2rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.3);
  padding-bottom: 0.5rem;
}

/* 链接网格 */
.links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  max-height: 280px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding-right: 0.5rem;
}

/* 隐藏滚动条 */
.links-grid::-webkit-scrollbar {
  display: none;
}

/* 悬停效果增强 */
.links-grid .link-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.description-section h3 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #667eea;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.places-text {
  font-size: 1.5rem;
  line-height: 1.6;
  color: #667eea;
  margin-bottom: 1.5rem;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.8rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.places-text .el-icon {
  color: #667eea;
  font-size: 1.5rem;
}

.description-text {
  font-size: 1.3rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-style: italic;
  font-family: 'Georgia', serif;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  padding-left: 1rem;
}

/* 链接列表样式 */
.links-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  align-items: flex-start;
  width: 100%;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.8rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.link-item:hover {
  color: #667eea;
  transform: translateX(5px);
}

.link-item .el-icon {
  font-size: 1.2rem;
  color: #667eea;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.link-text {
  font-size: 0.9rem;
  font-weight: 500;
  word-wrap: break-word;
  overflow-wrap: break-word;
  flex: 1;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-container {
    max-width: 90%;
    margin-right: 6rem;
  }
}

@media (max-width: 768px) {
  .navigation-arrows {
    padding: 0 1rem;
  }

  .arrow {
    width: 50px;
    height: 50px;
  }

  .content-overlay {
    padding: 1rem;
    justify-content: center;
  }

  .content-container {
    margin-right: 0;
    max-width: 95%;
  }

  .description-section {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .arrow {
    width: 40px;
    height: 40px;
  }

  .content-container {
    max-width: 98%;
  }

  .description-section {
    padding: 1rem;
  }
}
</style>
