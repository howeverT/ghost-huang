<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import ContentSection from '../components/ContentSection.vue'
import OverlapSection from '../components/OverlapSection.vue'
import OverlapSecondSection from '../components/OverlapSecondSection.vue'
import ThumbnailGrid from '../components/ThumbnailGrid.vue'
import TabbedContentSection from '../components/TabbedContentSection.vue'
import AvatarSection from '../components/AvatarSection.vue'

// 定义页面数据类型
interface PageData {
  title: string
  year: string
  content: ContentItem[]
}

interface ContentItem {
  type: string
  title?: string
  title_align?: string
  title_margin?: string
  background_image?: string
  paragraphs?: string[]
  content?: any
  image_url?: string
  button_link?: string
  index: number
}

const pageLoaded = ref(false)
const pageData = ref<PageData | null>(null)

// 从JSON文件加载数据
const loadPageData = async () => {
  try {
    console.log('开始加载相关页面数据...')
    const response = await fetch('/src/assets/page_data/related/related.json')
    console.log('响应状态:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('原始数据:', data)

    // 取第一个页面数据
    pageData.value = data[0]
    console.log('成功加载相关页面数据:', pageData.value)
    console.log('内容数组长度:', pageData.value?.content?.length)
  } catch (error) {
    console.error('加载相关页面数据失败:', error)
    pageData.value = null
  }
}

onMounted(() => {
  loadPageData()

  setTimeout(() => {
    pageLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="related-page" :class="{ loaded: pageLoaded }">
    <div v-if="pageData" class="page-content">
      <!-- 动态渲染组件 -->
      <div v-for="item in pageData.content" :key="item.index" class="content-item">
        <!-- HeroSection -->
        <HeroSection
          v-if="item.type === 'HeroSection'"
          :title="item.title"
          :titleAlign="item.title_align as 'left' | 'center' | 'right'"
          :titleMargin="item.title_margin"
          :backgroundImage="item.background_image"
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
          :imageUrl="item.image_url || ''"
          :buttonLink="item.button_link || ''"
        />

        <!-- OverlapSecondSection -->
        <OverlapSecondSection
          v-else-if="item.type === 'OverlapSecondSection'"
          :title="item.title || ''"
          :content="item.content"
          :backgroundImage="item.image_url || ''"
          :links="[]"
        />

        <!-- ThumbnailGrid -->
        <ThumbnailGrid
          v-else-if="item.type === 'ThumbnailGrid'"
          :title="item.title"
          :items="item.content"
        />

        <!-- TabbedContentSection -->
        <TabbedContentSection
          v-else-if="item.type === 'TabbedContentSection'"
          :title="item.title || ''"
          :tabs="[]"
        />

        <!-- AvatarSection -->
        <AvatarSection
          v-else-if="item.type === 'AvatarSection'"
          :title="item.title"
          :content="item.content"
        />
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading">
      <p>加载中...</p>
    </div>
  </div>
</template>

<style scoped>
.related-page {
  min-height: 100vh;
  opacity: 0;
  transition: opacity 0.8s ease-out;
}

.related-page.loaded {
  opacity: 1;
}

.page-content {
  width: 100%;
}

.content-item {
  width: 100%;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
  color: #666;
}
</style>
