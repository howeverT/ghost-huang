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

        <!-- TitleSection -->
        <TitleSection
          v-else-if="item.type === 'TitleSection'"
          :title-text="item.title_text || ''"
          :subtitle="item.subtitle || ''"
          :picture="item.picture || ''"
          :picture-title="item.picture_title || ''"
          :content="Array.isArray(item.content) ? item.content : []"
        />

        <!-- OverlapSection -->
        <OverlapSection
          v-else-if="item.type === 'OverlapSection'"
          :title="item.title"
          :content="item.content"
          :image-url="item.image_url"
          :button-link="item.button_link"
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
          :items="(item.items as any) || []"
          :title="item.title"
          :tabs="item.tabs"
        />

        <!-- TabbedContentSection -->
        <TabbedContentSection
          v-else-if="item.type === 'TabbedContentSection'"
          :tabs="item.tabs || []"
          :title="item.title || ''"
        />

        <!-- ThumbnailGrid -->
        <ThumbnailGrid
          v-else-if="item.type === 'ThumbnailGrid'"
          :items="item.items"
          :title="item.title"
          :subtitle="item.subtitle"
          :items-per-row="getItemsPerRow(item.items?.length || 0)"
        />

        <!-- 未知组件类型 -->
        <div v-else class="unknown-component">
          <p>未知组件类型: {{ item.type }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPageDataPath } from '@/utils/pathUtils'
import HeroSection from '@/components/HeroSection.vue'
import ContentSection from '@/components/ContentSection.vue'
import OverlapSection from '@/components/OverlapSection.vue'
import OverlapSecondSection from '@/components/OverlapSecondSection.vue'
import TitleSection from '@/components/TitleSection.vue'
import ThumbnailGrid from '@/components/ThumbnailGrid.vue'
import ConcertItemSection from '@/components/ConcertItemSection.vue'
import TabbedContentSection from '@/components/TabbedContentSection.vue'

// 路由参数
const route = useRoute()
const city = computed(() => route.params.city as string)
const pathType = computed(() => (route.path.includes('/open/') ? 'open' : 'universe'))

// 类型定义
interface TabItem {
  id: string
  label: string
  items: {
    title: string
    url: string
    date: string
    image?: string
  }[]
  backgroundImage: string
  imageTitle?: string
  imageCaption?: string
}

interface LinkItem {
  link_title: string
  date: string
  link: string
}

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
  picture?: string
  picture_title?: string
  button_link?: string
  items?: Array<{
    image: string
    title: string
    link?: string
  }>
  tabs?: TabItem[]
  links?: LinkItem[]
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

    // 根据路径类型和城市参数决定加载哪个JSON文件
    const currentPathType = pathType.value
    const currentCity = city.value
    const basePath = `concert/${currentPathType}`
    let jsonPath = getPageDataPath(`${basePath}/concert_new.json`) // 默认路径

    if (currentPathType === 'universe') {
      if (currentCity === 'beijing' || currentCity === 'beijing2024') {
        jsonPath = getPageDataPath(`${basePath}/concert_beijing2024.json`)
      } else if (currentCity === 'guangzhou' || currentCity === 'guangzhou2025') {
        jsonPath = getPageDataPath(`${basePath}/concert_guangzhou2025.json`)
      } else if (currentCity === 'chengdu' || currentCity === 'chengdu2025') {
        jsonPath = getPageDataPath(`${basePath}/concert_chengdu2025.json`)
      } else if (currentCity === 'shanghai' || currentCity === 'shanghai2025') {
        jsonPath = getPageDataPath(`${basePath}/concert_shanghai2025.json`)
      } else if (currentCity === 'ningbo' || currentCity === 'ningbo2025') {
        jsonPath = getPageDataPath(`${basePath}/concert_ningbo2025.json`)
      }
    } else if (currentPathType === 'open') {
      if (currentCity === 'guangzhou' || currentCity === 'guangzhou2023') {
        jsonPath = getPageDataPath(`${basePath}/concert_guangzhou2023.json`)
      }
      // 可以在这里添加更多 open 类型的城市
    }

    const response = await fetch(jsonPath)
    if (!response.ok) {
      throw new Error(`Failed to fetch concert data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // 如果加载的是数组（concert_new.json），需要找到对应的城市
    if (Array.isArray(data)) {
      const cityData = data.find((item: ConcertData) => item.title === currentCity)
      if (!cityData) {
        throw new Error(`未找到城市 ${currentCity} 的音乐会数据`)
      }
      concertData.value = cityData
    } else {
      // 如果加载的是单个城市文件，直接使用
      concertData.value = data
    }
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

// 监听路由参数变化，重新加载数据
watch(
  () => [route.params.city, route.path],
  () => {
    loadConcertData()
  },
)
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

.unknown-component {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  margin: 1rem 0;
  border-radius: 8px;
}

.unknown-component p {
  color: #6c757d;
  font-size: 1.1rem;
}
</style>
