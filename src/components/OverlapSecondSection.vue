<template>
  <div class="overlap-second-section">
    <!-- 横条div - 占满屏幕宽度，包含标题、描述和链接 -->
    <div class="horizontal-bar">
      <!-- 左箭头 -->
      <button class="arrow-btn arrow-left" @click="prevContent" :disabled="currentIndex === 0">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div class="bar-content">
        <h2 class="bar-title">{{ currentContent.title }}</h2>

        <!-- 链接直接显示，去掉div包装，所有链接在同一行 -->
        <div class="links-container">
          <div v-for="(link, index) in currentContent.links" :key="index" class="link-item">
            <a :href="link.link" target="_blank" rel="noopener noreferrer" class="link-text">
              {{ link.link_title }}
            </a>
            <div class="link-date">{{ link.date }}</div>
          </div>
        </div>
      </div>

      <!-- 右箭头 -->
      <button
        class="arrow-btn arrow-right"
        @click="nextContent"
        :disabled="currentIndex === contentList.length - 1"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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

    <!-- 图片div - 横的，显示在左边 -->
    <div class="image-overlay">
      <img
        :src="currentContent.backgroundImage"
        :alt="currentContent.title"
        class="overlay-image"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface LinkItem {
  link_title: string
  date: string
  link: string
}

interface ContentItem {
  title: string
  content: string
  backgroundImage: string
  links: LinkItem[]
}

interface Props {
  title: string
  content: string
  backgroundImage: string
  links: LinkItem[]
}

const props = defineProps<Props>()

// 测试数据 - 创建多个内容项
const contentList = ref<ContentItem[]>([
  {
    title: '我们的歌',
    content: '2025.05.24 宇宙无敌号成都站演唱会大电影 全程4K超清饭拍',
    backgroundImage: '/src/assets/background/History2024.jpg',
    links: props.links,
  },
  {
    title: '测试内容2',
    content: '这是第二个测试内容',
    backgroundImage: '/src/assets/background/Beijing-day1.jpg',
    links: [
      {
        link_title: '测试链接1',
        date: '2024-01-01',
        link: 'https://example.com/1',
      },
      {
        link_title: '测试链接2',
        date: '2024-01-02',
        link: 'https://example.com/2',
      },
    ],
  },
  {
    title: '测试内容3',
    content: '这是第三个测试内容',
    backgroundImage: '/src/assets/background/Beijing-day2.jpg',
    links: [
      {
        link_title: '测试链接3',
        date: '2024-01-03',
        link: 'https://example.com/3',
      },
      {
        link_title: '测试链接4',
        date: '2024-01-04',
        link: 'https://example.com/4',
      },
    ],
  },
])

// 当前内容索引
const currentIndex = ref(0)

// 当前显示的内容
const currentContent = computed(() => contentList.value[currentIndex.value])

// 切换到下一个内容
const nextContent = () => {
  if (currentIndex.value < contentList.value.length - 1) {
    currentIndex.value++
  }
}

// 切换到上一个内容
const prevContent = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
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

/* 箭头按钮 */
.arrow-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  z-index: 3;
}

.arrow-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-50%) scale(1.1);
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.arrow-left {
  left: 2rem;
}

.arrow-right {
  right: 2rem;
}

.bar-content {
  text-align: left;
  color: white;
  max-width: 1200px;
  padding: 0 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.bar-title {
  font-size: 3rem;
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

/* 链接容器 - 所有链接在同一行 */
.links-container {
  margin-top: 1rem;
  display: flex;
  flex-wrap: nowrap;
  gap: 2.5rem; /* 增加链接之间的间隔 */
  align-items: flex-start;
}

/* 链接项 - 包含标题和日期 */
.link-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左对齐 */
  flex-shrink: 0;
  max-width: 200px;
}

/* 纯文字链接 - 不换行 */
.link-text {
  color: white;
  text-decoration: none;
  font-size: 1.4rem; /* 更大字体 */
  font-weight: 900; /* 更粗字体 */
  transition: all 0.3s ease;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  white-space: nowrap; /* 不换行 */
  text-align: left; /* 左对齐 */
  line-height: 1.2;
  padding: 0; /* 去掉padding */
  margin: 0; /* 去掉margin */
}

/* 链接日期 - 小字左对齐 */
.link-date {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem; /* 再大一点 */
  font-weight: 600; /* 更粗一点 */
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  text-align: left; /* 左对齐 */
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
@media (max-width: 1200px) {
  .horizontal-bar {
    height: 450px;
  }

  .image-overlay {
    left: 20%;
  }

  .overlay-image {
    width: 400px;
    height: 400px; /* 增加高度 */
  }

  .arrow-btn {
    width: 45px;
    height: 45px;
  }

  .arrow-left {
    left: 1.5rem;
  }

  .arrow-right {
    right: 1.5rem;
  }

  .bar-title {
    font-size: 2.5rem;
  }

  .bar-description {
    font-size: 1.1rem;
  }

  .links-container {
    gap: 2rem;
  }

  .link-item {
    max-width: 180px;
  }

  .link-text {
    font-size: 1.3rem;
    font-weight: 900;
  }

  .link-date {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .link-item {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .horizontal-bar {
    height: 500px;
  }

  .image-overlay {
    left: 50%;
    top: 60%;
  }

  .overlay-image {
    width: 300px;
    height: 300px; /* 增加高度 */
  }

  .arrow-btn {
    width: 40px;
    height: 40px;
  }

  .arrow-left {
    left: 1rem;
  }

  .arrow-right {
    right: 1rem;
  }

  .bar-title {
    font-size: 2rem;
  }

  .bar-description {
    font-size: 1rem;
  }

  .links-container {
    gap: 1.8rem;
  }

  .link-item {
    max-width: 160px;
  }

  .link-text {
    font-size: 1.2rem;
    font-weight: 900;
  }

  .link-date {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .link-item {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .links-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .horizontal-bar {
    height: 550px;
  }

  .image-overlay {
    left: 50%;
    top: 65%;
  }

  .overlay-image {
    width: 250px;
    height: 250px; /* 增加高度 */
  }

  .arrow-btn {
    width: 35px;
    height: 35px;
  }

  .arrow-left {
    left: 0.5rem;
  }

  .arrow-right {
    right: 0.5rem;
  }

  .bar-title {
    font-size: 1.8rem;
  }

  .bar-description {
    font-size: 0.9rem;
  }

  .links-container {
    gap: 1.5rem;
  }

  .link-item {
    max-width: 140px;
  }

  .link-text {
    font-size: 1.1rem;
    font-weight: 900;
  }

  .link-date {
    font-size: 0.8rem;
    font-weight: 600;
  }

  .link-item {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
  }

  .links-title {
    font-size: 1.2rem;
  }
}
</style>
