<template>
  <div class="title-section">
    <div class="title-wrapper">
      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 左侧拍立得区域 -->
        <div class="polaroid-section">
          <div class="polaroid-frame">
            <div class="polaroid-image" :style="{ backgroundImage: `url(${picture})` }"></div>
            <div class="polaroid-caption">{{ pictureTitle }}</div>
          </div>
        </div>

        <!-- 右侧内容区域 - 包含标题、副标题和5个Part -->
        <div class="content-section">
          <!-- 标题和副标题 -->
          <div class="header-section">
            <h2 class="title-text">{{ titleText }}</h2>
            <div v-if="subtitle" class="subtitle-text">
              {{ subtitle }}
            </div>
          </div>

          <!-- 5列歌单区域 -->
          <div class="playlist-section">
            <div v-for="(part, index) in content" :key="index" class="playlist-column">
              <h3 class="part-title">{{ part.tab }}</h3>
              <ul class="song-list">
                <li v-for="(song, songIndex) in part.song" :key="songIndex" class="song-item">
                  {{ song }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PlaylistPart {
  tab: string
  song: string[]
}

interface Props {
  titleText?: string
  picture?: string
  pictureTitle?: string
  subtitle?: string
  content?: PlaylistPart[]
}

withDefaults(defineProps<Props>(), {
  titleText: '成都站歌单',
  picture: '/src/assets/background/Chengdu.jpg',
  pictureTitle: '成都印象',
  subtitle: '成都东安湖体育公园多功能体育馆 - 2025/05/24',
  content: () => [],
})
</script>

<style scoped>
.title-section {
  width: 100%;
  background-color: white;
  padding: 3rem 0;
  flex-shrink: 0;
}

.title-wrapper {
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
}

.main-content {
  display: flex;
  gap: 6rem;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.title-text {
  font-size: 3rem;
  color: #333;
  font-weight: 700;
  margin: 0 0 1rem 0;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.subtitle-text {
  font-size: 1.5rem;
  color: #666;
  margin: 0;
  font-weight: 400;
}

.polaroid-section {
  flex-shrink: 0;
  margin-right: 2rem;
  margin-left: -3rem;
}

.polaroid-frame {
  background: white;
  padding: 2rem 2rem 3rem 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: rotate(-3deg);
  transition: transform 0.3s ease;
}

.polaroid-frame:hover {
  transform: rotate(-1deg) scale(1.02);
}

.polaroid-image {
  width: 350px;
  height: 500px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid #f0f0f0;
  border-radius: 4px;
}

.polaroid-caption {
  margin-top: 1.5rem;
  font-size: 1.6rem;
  color: #333;
  text-align: center;
  font-family: 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.playlist-section {
  flex: 1;
  display: flex;
  gap: 2rem;
  min-height: 500px;
  align-items: flex-start;
}

.playlist-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.part-title {
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
  margin: 0 0 1rem 0;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  text-align: center;
}

.song-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.song-item {
  font-size: 0.9rem;
  color: #333;
  padding: 0.4rem 0;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.4;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .main-content {
    gap: 5rem;
  }

  .polaroid-section {
    margin-right: 1.5rem;
  }

  .playlist-section {
    gap: 1.5rem;
  }

  .part-title {
    font-size: 1.1rem;
  }

  .song-item {
    font-size: 0.85rem;
  }
}

@media (max-width: 1200px) {
  .main-content {
    gap: 4rem;
  }

  .polaroid-section {
    margin-right: 1rem;
  }

  .polaroid-image {
    width: 300px;
    height: 420px;
  }

  .playlist-section {
    min-height: 420px;
    gap: 1rem;
  }

  .part-title {
    font-size: 1rem;
  }

  .song-item {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .title-wrapper {
    padding: 0 1.5rem;
  }

  .main-content {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }

  .content-section {
    width: 100%;
  }

  .polaroid-section {
    margin-right: 0;
  }

  .polaroid-frame {
    padding: 1.5rem 1.5rem 2rem 1.5rem;
  }

  .polaroid-image {
    width: 280px;
    height: 380px;
  }

  .title-text {
    font-size: 2.5rem;
  }

  .subtitle-text {
    font-size: 1.3rem;
  }

  .playlist-section {
    min-height: auto;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }

  .playlist-column {
    flex: 0 0 calc(50% - 0.5rem);
    margin-bottom: 2rem;
  }

  .part-title {
    font-size: 1.2rem;
  }

  .song-item {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .title-wrapper {
    padding: 0 1rem;
  }

  .polaroid-frame {
    padding: 1rem 1rem 1.5rem 1rem;
    transform: rotate(-2deg);
  }

  .polaroid-image {
    width: 250px;
    height: 340px;
  }

  .title-text {
    font-size: 2rem;
  }

  .subtitle-text {
    font-size: 1.1rem;
  }

  .playlist-column {
    flex: 0 0 100%;
    margin-bottom: 1.5rem;
  }

  .part-title {
    font-size: 1.1rem;
  }

  .song-item {
    font-size: 0.85rem;
    padding: 0.3rem 0;
  }
}
</style>
