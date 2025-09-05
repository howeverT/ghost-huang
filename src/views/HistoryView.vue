<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
    const response = await fetch('/src/assets/page_data/history/tabbed_content.json')
    if (!response.ok) {
      throw new Error('Failed to fetch history data')
    }

    const data = await response.json()

    // 直接使用数据，因为tabbed_content.json已经是正确的结构
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
