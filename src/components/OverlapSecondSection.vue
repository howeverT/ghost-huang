<template>
  <div class="overlap-second-section">
    <!-- 横条div - 占满屏幕宽度，包含标题、描述和链接 -->
    <div class="horizontal-bar">
      <div class="bar-content">
        <h2 class="bar-title">{{ title }}</h2>

        <!-- 链接直接显示，去掉div包装，所有链接在同一行 -->
        <div class="links-container">
          <div v-for="(link, index) in links" :key="index" class="link-item">
            <a :href="link.link" target="_blank" rel="noopener noreferrer" class="link-text">
              {{ link.link_title }}
            </a>
            <div class="link-date">{{ link.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片div - 横的，显示在左边 -->
    <div class="image-overlay">
      <img :src="backgroundImage" :alt="title" class="overlay-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
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
  text-align: left;
  color: white;
  max-width: 1200px;
  padding: 0 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: calc(15% + 250px + 2rem);
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
  font-size: 1.1rem; /* 调整字体大小 */
  font-weight: 800; /* 调整字体粗细 */
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
  font-size: 0.8rem; /* 调整字体大小 */
  font-weight: 500; /* 调整字体粗细 */
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
@media (min-width: 1400px) {
  .bar-content {
    margin-left: calc(15% + 250px + 2rem);
  }

  .bar-title {
    font-size: 2.2rem;
  }

  .link-text {
    font-size: 1.1rem;
    font-weight: 800;
  }

  .link-date {
    font-size: 0.85rem;
    font-weight: 500;
  }

  .links-container {
    gap: 1.8rem;
  }

  .link-item {
    max-width: 160px;
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
  .bar-content {
    margin-left: calc(15% + 250px + 2rem);
  }
}

@media (max-width: 1200px) {
  .horizontal-bar {
    height: 450px;
  }

  .bar-content {
    margin-left: calc(20% + 200px + 2rem);
  }

  .image-overlay {
    left: 20%;
  }

  .overlay-image {
    width: 400px;
    height: 400px; /* 增加高度 */
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

  .bar-content {
    margin-left: 0;
    text-align: center;
  }

  .image-overlay {
    left: 50%;
    top: 60%;
  }

  .overlay-image {
    width: 300px;
    height: 300px; /* 增加高度 */
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

  .bar-content {
    margin-left: 0;
    text-align: center;
  }

  .image-overlay {
    left: 50%;
    top: 65%;
  }

  .overlay-image {
    width: 250px;
    height: 250px; /* 增加高度 */
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
