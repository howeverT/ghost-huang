<template>
  <div class="thumbnail-section">
    <div class="content-container">
      <!-- 标题容器 -->
      <div v-if="title" class="title-container">
        <h2>{{ title }}</h2>
      </div>
      <!-- 项目容器 -->
      <div class="items-container">
        <div
          v-for="(item, index) in currentPageItems"
          :key="index"
          class="frame-item"
          @click="handleItemClick(item)"
        >
          <div class="frame-border">
            <div class="frame-content">
              <div
                class="frame-image"
                :style="{
                  backgroundImage: `url(${item.image})`,
                }"
              ></div>
              <div class="frame-title">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页按钮 -->
      <div v-if="totalPages > 1" class="pagination-container">
        <button class="pagination-btn prev-btn" :disabled="currentPage === 0" @click="previousPage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <span class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button
          class="pagination-btn next-btn"
          :disabled="currentPage === totalPages - 1"
          @click="nextPage"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface ThumbnailItem {
  image: string
  title: string
  link?: string
}

interface Props {
  items?: ThumbnailItem[]
  itemsPerPage?: number
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { image: '/src/assets/background/Beijing-day1.jpg', title: '北京一日游' },
    { image: '/src/assets/background/Beijing-day2.jpg', title: '北京二日游' },
    { image: '/src/assets/background/Guangzhou.jpg', title: '广州之旅' },
    { image: '/src/assets/background/Chengdu.jpg', title: '成都印象' },
    { image: '/src/assets/background/History2024.jpg', title: '历史回顾' },
    { image: '/src/assets/background/background.jpg', title: '精彩瞬间' },
  ],
  itemsPerPage: 4,
  title: '',
})

const currentPage = ref(0)

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(props.items.length / props.itemsPerPage)
})

// 计算当前页显示的项目
const currentPageItems = computed(() => {
  const start = currentPage.value * props.itemsPerPage
  const end = start + props.itemsPerPage
  return props.items.slice(start, end)
})

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

// 上一页
const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

// 处理缩略图点击
const handleItemClick = (item: ThumbnailItem) => {
  if (item.link) {
    window.open(item.link, '_blank')
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.thumbnail-section {
  width: 100%;
  padding: 2rem 1rem;
  flex-shrink: 0;
}

.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-container {
  margin-bottom: 2rem;
  width: 100%;
  max-width: calc(100vw - 3rem);
  display: flex;
  justify-content: center;
}

.title-container h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.items-container {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: calc(100vw - 3rem);
}

.frame-item {
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.frame-item:hover {
  transform: scale(1.05);
}

.frame-border {
  width: calc(25% - 1.125rem);
  min-width: 22rem;
  height: 32rem;
  position: relative;
  flex-shrink: 0;
}

.frame-content {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.frame-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.frame-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 1rem 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  text-align: center;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(0, 0, 0, 0.2) 80%,
    transparent 100%
  );
}

/* 响应式布局 */
@media (min-width: 1800px) {
  .title-container,
  .items-container {
    max-width: calc(100vw - 4rem);
  }

  .frame-border {
    width: calc(25% - 1.875rem);
    min-width: 28rem;
    height: 38rem;
  }

  .items-container {
    gap: 2.5rem;
  }
}

@media (min-width: 1600px) and (max-width: 1799px) {
  .title-container,
  .items-container {
    max-width: calc(100vw - 4rem);
  }

  .frame-border {
    width: calc(25% - 1.5rem);
    min-width: 26rem;
    height: 36rem;
  }

  .items-container {
    gap: 2rem;
  }
}

@media (max-width: 1400px) {
  .title-container,
  .items-container {
    max-width: calc(100vw - 3rem);
  }

  .frame-border {
    width: calc(25% - 1.35rem);
    min-width: 24rem;
    height: 34rem;
  }

  .items-container {
    gap: 1.8rem;
  }
}

@media (max-width: 1200px) {
  .title-container,
  .items-container {
    max-width: calc(100vw - 2rem);
  }

  .title-container h2 {
    font-size: 2.2rem;
  }

  .frame-border {
    width: calc(25% - 1.125rem);
    min-width: 22rem;
    height: 32rem;
  }

  .items-container {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .title-container,
  .items-container {
    max-width: calc(100vw - 1.5rem);
  }

  .title-container h2 {
    font-size: 2rem;
  }

  .frame-border {
    width: calc(50% - 0.6rem);
    min-width: 18rem;
    height: 28rem;
  }

  .items-container {
    gap: 1.2rem;
  }
}

@media (max-width: 480px) {
  .title-container,
  .items-container {
    max-width: 100%;
  }

  .title-container h2 {
    font-size: 1.8rem;
  }

  .frame-border {
    width: calc(50% - 0.6rem);
    min-width: 160px;
    height: 22rem;
  }

  .items-container {
    gap: 1.2rem;
  }

  .frame-title {
    font-size: 1rem;
    padding: 1rem 0.8rem 0.8rem;
  }
}

/* 分页按钮样式 */
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2px solid #333;
  background-color: white;
  color: #333;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #333;
  color: white;
  transform: scale(1.1);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.page-info {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  min-width: 80px;
  text-align: center;
}

@media (max-width: 768px) {
  .pagination-container {
    margin-top: 1.5rem;
    gap: 0.8rem;
  }

  .pagination-btn {
    width: 40px;
    height: 40px;
  }

  .page-info {
    font-size: 1rem;
    min-width: 60px;
  }
}
</style>
