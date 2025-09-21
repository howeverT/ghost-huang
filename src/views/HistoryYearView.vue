<template>
  <div class="history-year-page">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="yearData" class="history-content">
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

        <!-- TabbedContentSection -->
        <TabbedContentSection
          v-else-if="item.type === 'TabbedContentSection'"
          :tabs="item.tabs || []"
          :title="item.title || ''"
        />

        <!-- ThumbnailGrid -->
        <ThumbnailGrid
          v-else-if="item.type === 'ThumbnailGrid'"
          :items="
            (item.items || []).map((item) => ({
              image: item.image || '',
              title: item.title,
              link: item.url,
            }))
          "
          :title="item.title || ''"
        />

        <!-- ContentSection -->
        <ContentSection
          v-else-if="item.type === 'ContentSection'"
          :title="item.title || ''"
          :paragraphs="item.paragraphs || []"
        />

        <!-- OverlapSection -->
        <OverlapSection
          v-else-if="item.type === 'OverlapSection'"
          :title="item.title || ''"
          :content="item.content || ''"
          :image-url="item.image_url || ''"
          :button-link="item.button_link || ''"
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
import HeroSection from '@/components/HeroSection.vue'
import TabbedContentSection from '@/components/TabbedContentSection.vue'
import ConcertItemSection from '@/components/ConcertItemSection.vue'
import OverlapSecondSection from '@/components/OverlapSecondSection.vue'
import OverlapSection from '@/components/OverlapSection.vue'
import ThumbnailGrid from '@/components/ThumbnailGrid.vue'
import ContentSection from '@/components/ContentSection.vue'

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
  image_url?: string
  button_link?: string
  index: number
}

interface YearData {
  title: string
  year: string
  content: HistoryItem[]
}

const route = useRoute()
const loading = ref(true)
const error = ref('')
const yearData = ref<YearData | null>(null)

// 按index排序的内容
const sortedContent = computed(() => {
  if (!yearData.value) return []
  return [...yearData.value.content].sort((a, b) => a.index - b.index)
})

// 加载年份数据
const loadYearData = async (year: string) => {
  try {
    loading.value = true
    error.value = ''

    // 根据年份加载对应的JSON文件
    let data
    if (year === '2024') {
      data = await import('@/assets/page_data/history/history_2024.json')
    } else {
      // 尝试加载其他年份的数据
      try {
        data = await import(`@/assets/page_data/history/history_${year}.json`)
      } catch (importError) {
        throw new Error(`年份 ${year} 的数据文件不存在`)
      }
    }

    // 检查数据结构
    if (Array.isArray(data.default)) {
      // 如果是数组，取第一个元素（假设是当前年份的数据）
      yearData.value = data.default[0]
    } else {
      yearData.value = data.default
    }

    if (!yearData.value) {
      throw new Error('数据格式错误')
    }
  } catch (err) {
    console.error('加载年份数据失败:', err)
    error.value = err instanceof Error ? err.message : '加载数据失败'
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  const year = route.params.year as string
  if (year) {
    loadYearData(year)
  } else {
    error.value = '年份参数缺失'
    loading.value = false
  }
})

// 监听路由参数变化，重新加载数据
watch(
  () => route.params.year,
  (newYear) => {
    if (newYear) {
      loadYearData(newYear as string)
    }
  },
)
</script>

<style scoped>
.history-year-page {
  min-height: 100vh;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
}

.history-content {
  width: 100%;
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
