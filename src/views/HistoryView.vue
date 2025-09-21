<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPageDataPath } from '@/utils/pathUtils'
import HeroSection from '@/components/HeroSection.vue'
import TabbedContentSection from '@/components/TabbedContentSection.vue'
import ConcertItemSection from '@/components/ConcertItemSection.vue'
import OverlapSecondSection from '@/components/OverlapSecondSection.vue'

// 类型定义
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

interface ConcertItem {
  title: string
  date: string
  image?: string
  url?: string
}

interface LinkItem {
  link_title: string
  date: string
  link: string
}

interface HistoryItem {
  type: string
  title?: string
  title_align?: string
  title_margin?: string
  background_image?: string
  paragraphs?: string[]
  tabs?: TabItem[]
  items?: ConcertItem[]
  content?: string
  links?: LinkItem[]
  index: number
}

interface HistoryData {
  title: string
  content: HistoryItem[]
}

// 响应式数据
const loading = ref(true)
const error = ref('')
const historyData = ref<HistoryData | null>(null)
const router = useRouter()

// 年份导航
const availableYears = ['2024', '2023']
const navigateToYear = (year: string) => {
  router.push(`/history/${year}`)
}

// 计算属性：按index排序的内容
const sortedContent = computed(() => {
  if (!historyData.value?.content) return []
  return [...historyData.value.content].sort((a, b) => a.index - b.index)
})

// 加载历史数据
const loadHistoryData = async () => {
  try {
    loading.value = true
    error.value = ''

    // 加载JSON文件
    const response = await fetch(getPageDataPath('history/history_2024.json'))
    if (!response.ok) {
      throw new Error('Failed to fetch history data')
    }

    const data = await response.json()

    // 直接使用数据，因为history_2024.json已经是正确的结构
    historyData.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载数据失败'
    console.error('加载历史数据失败:', err)
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadHistoryData()
})
</script>

<template>
  <div class="history-page">
    <!-- 年份导航 -->
    <div class="year-navigation">
      <h2>选择年份查看历史内容</h2>
      <div class="year-buttons">
        <button
          v-for="year in availableYears"
          :key="year"
          @click="navigateToYear(year)"
          class="year-btn"
        >
          {{ year }}年
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="historyData" class="history-content">
      <!-- 动态渲染组件 -->
      <template v-for="(item, index) in sortedContent" :key="index">
        <!-- HeroSection -->
        <HeroSection
          v-if="item.type === 'HeroSection'"
          :background-image="item.background_image"
          :title="item.title"
          :title-align="item.title_align as 'left' | 'center' | 'right'"
          :title-margin="item.title_margin"
        />

        <!-- TabbedContentSection -->
        <TabbedContentSection
          v-else-if="item.type === 'TabbedContentSection'"
          :tabs="item.tabs || []"
          :title="item.title || ''"
        />

        <!-- OverlapSecondSection -->
        <OverlapSecondSection
          v-else-if="item.type === 'OverlapSecondSection'"
          :title="item.title || ''"
          :content="item.content || ''"
          :background-image="item.background_image || ''"
          :links="item.links || []"
        />

        <!-- ConcertItemSection -->
        <ConcertItemSection
          v-else-if="item.type === 'ConcertItemSection'"
          :items="item.items || []"
          :title="item.title"
          :tabs="item.tabs"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.history-page {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

/* 年份导航样式 */
.year-navigation {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.year-navigation h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.year-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.year-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  backdrop-filter: blur(10px);
}

.year-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .year-navigation {
    padding: 2rem 1rem;
  }

  .year-navigation h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .year-buttons {
    gap: 1rem;
  }

  .year-btn {
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #666;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
}

.history-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
