<template>
  <div class="test-page">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="timelineData.length > 0" class="content-container">
      <!-- 左侧图片区域 -->
      <div class="left-section">
        <div class="image-container" :class="{ visible: contentVisible }">
          <img
            :src="currentData?.image[0] || '/src/assets/background/background.jpg'"
            :alt="currentData?.title"
            class="main-image"
          />
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="right-section">
        <div class="content-wrapper" :class="{ visible: contentVisible }">
          <h1 class="title">{{ currentData?.title }}</h1>
          <p class="date">{{ currentData?.date }}</p>
          <p class="description">{{ currentData?.description }}</p>

          <div class="links-section">
            <h3>相关链接：</h3>
            <div class="links-list">
              <a
                v-for="(link, index) in currentData?.links"
                :key="index"
                :href="link.link"
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                {{ link.link_title }}
              </a>
            </div>
          </div>
        </div>

        <!-- 导航箭头 - 移到最右侧 -->
        <div class="arrow-navigation">
          <button
            @click="prevItem"
            :disabled="currentIndex === 0"
            class="arrow-btn up-arrow"
            title="上一项"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 14L12 9L17 14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            @click="nextItem"
            :disabled="currentIndex === timelineData.length - 1"
            class="arrow-btn down-arrow"
            title="下一项"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 定义数据类型
interface TimelineItem {
  date: string
  title: string
  description: string
  places: string
  display?: 'left' | 'right'
  links: {
    link_title: string
    link: string
    icon: string
  }[]
  image: string[]
}

// 响应式数据
const loading = ref(true)
const error = ref('')
const timelineData = ref<TimelineItem[]>([])
const currentIndex = ref(0)
const contentVisible = ref(true)

// 计算当前显示的数据
const currentData = computed(() => {
  if (timelineData.value.length === 0) return null
  return timelineData.value[currentIndex.value]
})

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await fetch('/src/assets/page_data/collection/haoshengyin.json')
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()
    timelineData.value = data
    console.log('成功加载数据:', data)
  } catch (err) {
    console.error('加载数据失败:', err)
    error.value = err instanceof Error ? err.message : '加载数据失败'
  } finally {
    loading.value = false
  }
}

// 导航函数
const nextItem = () => {
  if (currentIndex.value < timelineData.value.length - 1) {
    // 先渐隐当前内容
    contentVisible.value = false

    setTimeout(() => {
      currentIndex.value++
      // 延迟一点让新内容渐显
      setTimeout(() => {
        contentVisible.value = true
      }, 100)
    }, 300)
  }
}

const prevItem = () => {
  if (currentIndex.value > 0) {
    // 先渐隐当前内容
    contentVisible.value = false

    setTimeout(() => {
      currentIndex.value--
      // 延迟一点让新内容渐显
      setTimeout(() => {
        contentVisible.value = true
      }, 100)
    }, 300)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.test-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.loading,
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #666;
}

.error {
  color: #e74c3c;
}

.content-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

/* 左侧图片区域 */
.left-section {
  flex: 1;
  background-color: #f8f9fa;
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
}

.image-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transform: scale(1.05);
  transition: all 0.6s ease-in-out;
}

.image-container.visible {
  opacity: 1;
  transform: scale(1);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 右侧内容区域 */
.right-section {
  flex: 1;
  background-color: white;
  padding: 3rem 6rem 3rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
}

.content-wrapper {
  width: 100%;
  max-width: 500px;
  color: #333;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-in-out;
}

.content-wrapper.visible {
  opacity: 1;
  transform: translateY(0);
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.date {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  font-weight: 500;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 2.5rem;
  text-align: justify;
}

.links-section {
  margin-bottom: 2.5rem;
}

.links-section h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.link-item {
  color: #667eea;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.link-item:hover {
  color: #5a6fd8;
  padding-left: 0.5rem;
  border-bottom-color: #667eea;
}

/* 导航箭头 */
.arrow-navigation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

.arrow-btn {
  background-color: #667eea;
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.arrow-btn:hover:not(:disabled) {
  background-color: #5a6fd8;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.arrow-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.up-arrow {
  order: 1;
}

.down-arrow {
  order: 2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }

  .left-section {
    height: 40vh;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
  }

  .image-container {
    height: 100%;
  }

  .right-section {
    height: 60vh;
    padding: 2rem 5rem 2rem 2rem;
    clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 100%);
    justify-content: center;
  }

  .arrow-navigation {
    right: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .right-section {
    padding: 1.5rem 4rem 1.5rem 1.5rem;
  }

  .title {
    font-size: 1.8rem;
  }

  .arrow-navigation {
    flex-direction: row;
    justify-content: center;
  }

  .arrow-btn {
    width: 45px;
    height: 45px;
  }
}
</style>
