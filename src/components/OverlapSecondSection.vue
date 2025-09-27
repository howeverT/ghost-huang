<template>
  <div class="overlap-second-section">
    <!-- 横条div - 占满屏幕宽度，包含标题、描述和链接 -->
    <div class="horizontal-bar">
      <div class="bar-content">
        <h2 class="bar-title">{{ title }}</h2>

        <!-- 链接直接显示，去掉div包装，所有链接在同一行 -->
        <div class="links-container">
          <div v-for="(link, index) in links" :key="index" class="link-item">
            <!-- 内部链接使用 Vue Router -->
            <a
              v-if="isInternalLink(link.link)"
              @click="handleInternalLink(link.link, $event)"
              class="link-text"
            >
              {{ link.link_title }}
            </a>
            <!-- 外部链接直接跳转 -->
            <a v-else :href="link.link" target="_blank" rel="noopener noreferrer" class="link-text">
              {{ link.link_title }}
            </a>
            <div class="link-date">{{ link.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片div - 横的，显示在左边 -->
    <div class="image-overlay">
      <img :src="getImagePath(backgroundImage)" :alt="title" class="overlay-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getImagePath } from '@/utils/pathUtils'
import { useRouter } from 'vue-router'

interface LinkItem {
  link_title: string
  date: string
  link: string
}

interface Props {
  title: string
  content: string
  backgroundImage: string
  links: LinkItem[]
}

const props = defineProps<Props>()
const router = useRouter()

// 判断是否为内部链接
const isInternalLink = (link: string): boolean => {
  return link.startsWith('/') && !link.startsWith('http')
}

// 处理内部链接点击
const handleInternalLink = (link: string, event: Event) => {
  event.preventDefault()
  router.push(link)
}
</script>

<style scoped>
.overlap-second-section {
  position: relative;
  width: 100%;
  margin: 4rem 0;
}

/* 横条div - 占满屏幕宽度 */
.horizontal-bar {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.bar-content {
  text-align: center;
  color: white;
  max-width: 1200px;
  padding: 0 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: calc(15% + 250px + 20px);
  margin-right: 15%;
}

.bar-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.bar-description {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 链接容器 - 所有链接在同一行，居中显示 */
.links-container {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem; /* 增加链接之间的间隔 */
  align-items: center;
  justify-content: center;
}

/* 链接项 - 包含标题和日期 */
.link-item {
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中对齐 */
  flex-shrink: 1;
  max-width: 200px;
  min-width: 120px;
}

/* 纯文字链接 - 可以换行 */
.link-text {
  color: white;
  text-decoration: none;
  font-size: 1.1rem; /* 调整字体大小 */
  font-weight: 800; /* 调整字体粗细 */
  transition: all 0.3s ease;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  white-space: normal; /* 可以换行 */
  text-align: center; /* 居中对齐 */
  line-height: 1.2;
  padding: 0; /* 去掉padding */
  margin: 0; /* 去掉margin */
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 链接日期 - 小字居中对齐 */
.link-date {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem; /* 调整字体大小 */
  font-weight: 500; /* 调整字体粗细 */
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  text-align: center; /* 居中对齐 */
  margin-top: 0.3rem;
  line-height: 1.2;
  padding: 0; /* 去掉padding */
}

.link-text:hover {
  color: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 图片div - 横的，显示在左边 */
.image-overlay {
  position: absolute;
  top: 50%;
  left: 15%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.overlay-image {
  width: 500px;
  height: 500px; /* 增加高度 */
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

/* 响应式设计 */
@media (min-width: 1200px) {
  .bar-content {
    margin-left: calc(15% + 250px + 20px);
    margin-right: 15%;
    max-width: calc(100% - 15% - 250px - 40px);
  }

  .image-overlay {
    left: 15%;
  }

  .overlay-image {
    width: 500px;
    height: 500px;
  }

  .bar-title {
    font-size: 2rem;
    line-height: 1.2;
  }

  .links-container {
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .link-item {
    max-width: 180px;
  }

  .link-text {
    font-size: 1rem;
  }

  .link-date {
    font-size: 0.8rem;
  }
}

@media (max-width: 1200px) {
  .overlap-second-section {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    align-items: center;
  }

  .horizontal-bar {
    width: 100%;
    height: auto;
    min-height: 300px;
    order: 2;
    margin-top: -50px;
    z-index: 1;
  }

  .image-overlay {
    width: 100%;
    max-width: 400px;
    order: 1;
    margin: 0 auto;
    z-index: 2;
    position: relative;
    top: auto;
    left: auto;
    transform: none;
  }

  .overlay-image {
    width: 100%;
    max-width: 400px;
    height: 300px;
    object-fit: cover;
  }

  .bar-content {
    padding: 3rem 2rem 2rem 2rem;
    text-align: center;
    align-items: center;
    margin-left: 0;
    max-width: 400px;
    width: 100%;
  }

  .bar-title {
    font-size: 2rem;
  }

  .links-container {
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: center;
  }

  .link-text {
    font-size: 1rem;
  }

  .link-date {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .overlap-second-section {
    align-items: center;
  }

  .horizontal-bar {
    min-height: 250px;
    margin-top: -40px;
  }

  .image-overlay {
    max-width: 350px;
  }

  .overlay-image {
    height: 250px;
  }

  .bar-content {
    padding: 2.5rem 2rem 2rem 2rem;
    margin-left: 0;
    max-width: 350px;
    width: 100%;
  }

  .bar-title {
    font-size: 1.8rem;
  }

  .links-container {
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }

  .link-text {
    font-size: 0.9rem;
  }

  .link-date {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .overlap-second-section {
    align-items: center;
  }

  .horizontal-bar {
    min-height: 200px;
    margin-top: -30px;
  }

  .image-overlay {
    max-width: 300px;
  }

  .overlay-image {
    height: 200px;
  }

  .bar-content {
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    margin-left: 0;
    max-width: 300px;
    width: 100%;
  }

  .bar-title {
    font-size: 1.6rem;
  }

  .links-container {
    gap: 0.8rem;
    justify-content: center;
    align-items: center;
  }

  .link-text {
    font-size: 0.8rem;
  }

  .link-date {
    font-size: 0.7rem;
  }
}
</style>
