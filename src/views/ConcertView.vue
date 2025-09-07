<template>
  <div class="concert-page">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="concertData" class="concert-content">
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

        <!-- ContentSection -->
        <ContentSection
          v-else-if="item.type === 'ContentSection'"
          :title="item.title"
          :paragraphs="item.paragraphs"
        />

        <!-- OverlapSection -->
        <OverlapSection
          v-else-if="item.type === 'OverlapSection'"
          :title="item.title"
          :content="item.content"
          :image-url="item.image_url"
          :button-link="item.button_link"
        />

        <!-- TitleSection -->
        <TitleSection
          v-else-if="item.type === 'TitleSection'"
          :title-text="item.title_text"
          :subtitle="item.subtitle"
        />

        <!-- ThumbnailGrid -->
        <ThumbnailGrid
          v-else-if="item.type === 'ThumbnailGrid'"
          :items="item.items"
          :title="item.title"
          :items-per-row="getItemsPerRow(item.items?.length || 0)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import ContentSection from '@/components/ContentSection.vue'
import OverlapSection from '@/components/OverlapSection.vue'
import TitleSection from '@/components/TitleSection.vue'
import ThumbnailGrid from '@/components/ThumbnailGrid.vue'

// 路由参数
const route = useRoute()
const city = route.params.city as string

// 类型定义
interface ConcertItem {
  type: string
  title?: string
  title_align?: string
  title_margin?: string
  background_image?: string
  paragraphs?: string[]
  content?: string
  image_url?: string
  title_text?: string
  subtitle?: string
  button_link?: string
  items?: Array<{
    image: string
    title: string
    link?: string
  }>
  index: number
}

interface ConcertData {
  date: string
  title: string
  places: string
  content: ConcertItem[]
}

// 响应式数据
const loading = ref(true)
const error = ref('')
const concertData = ref<ConcertData | null>(null)

// 计算属性：按index排序的内容
const sortedContent = computed(() => {
  if (!concertData.value?.content) return []
  return [...concertData.value.content].sort((a, b) => a.index - b.index)
})

// 根据item数量计算每行显示数量
const getItemsPerRow = (itemCount: number): number => {
  if (itemCount === 2) return 2
  if (itemCount === 4) return 2
  if (itemCount === 6) return 3
  return 2 // 默认值
}

// 加载音乐会数据
const loadConcertData = async () => {
  try {
    loading.value = true
    error.value = ''

    // 加载JSON文件
    const response = await fetch('/src/assets/page_data/concert/concert_new.json')
    if (!response.ok) {
      throw new Error('Failed to fetch concert data')
    }

    const data = await response.json()

    // 根据城市查找对应的数据
    const cityData = data.find((item: ConcertData) => item.title === city)

    if (!cityData) {
      throw new Error(`未找到城市 ${city} 的音乐会数据`)
    }

    concertData.value = cityData
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载数据失败'
    console.error('加载音乐会数据失败:', err)
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadConcertData()
})
</script>

<style scoped>
.concert-page {
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

.concert-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
