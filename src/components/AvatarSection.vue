<script setup lang="ts">
interface AvatarItem {
  avatar: string
  name: string
  avatar_title: string
  link: string
}

interface ContentItem {
  subtitle: string
  avatars: AvatarItem[]
}

interface Props {
  title?: string
  content: ContentItem[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: () => [],
})
</script>

<template>
  <div class="avatar-section">
    <div class="container">
      <!-- 标题 -->
      <div v-if="title" class="section-title">
        <h2>{{ title }}</h2>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <div
          v-for="(contentItem, contentIndex) in content"
          :key="contentIndex"
          class="content-group"
        >
          <!-- 副标题 - 暂时隐藏 -->
          <!-- <div class="subtitle">
            <h3>{{ contentItem.subtitle }}</h3>
          </div> -->

          <!-- 头像列表 -->
          <div class="avatar-list">
            <a
              v-for="(avatar, avatarIndex) in contentItem.avatars"
              :key="avatarIndex"
              :href="avatar.link"
              target="_blank"
              rel="noopener noreferrer"
              class="avatar-item"
            >
              <div class="avatar-container">
                <img :src="avatar.avatar" :alt="avatar.name" class="avatar-image" />
              </div>
              <div class="avatar-name">{{ avatar.name }}</div>
              <div class="avatar-title">{{ avatar.avatar_title }}</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-section {
  width: 100%;
  padding: 4rem 0;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #667eea;
  margin: 0;
  position: relative;
  display: inline-block;
}

.section-title h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.content-area {
  width: 100%;
}

.content-group {
  margin-bottom: 3rem;
}

.content-group:last-child {
  margin-bottom: 0;
}

.subtitle {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitle h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #667eea;
  margin: 0;
  position: relative;
  display: inline-block;
}

.subtitle h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.avatar-list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.avatar-item:hover {
  transform: translateY(-5px);
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  transition: box-shadow 0.3s ease;
}

.avatar-item:hover .avatar-container {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar-item:hover .avatar-image {
  transform: scale(1.05);
}

.avatar-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  transition: color 0.3s ease;
  margin-bottom: 0.3rem;
}

.avatar-title {
  font-size: 0.9rem;
  font-weight: 400;
  color: #666;
  text-align: center;
  transition: color 0.3s ease;
}

.avatar-item:hover .avatar-name {
  color: #667eea;
}

.avatar-item:hover .avatar-title {
  color: #667eea;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .avatar-section {
    padding: 3rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .section-title h2 {
    font-size: 1.5rem;
  }

  .subtitle h3 {
    font-size: 1.5rem;
  }

  .avatar-list {
    gap: 2rem;
  }

  .avatar-container {
    width: 100px;
    height: 100px;
  }

  .avatar-name {
    font-size: 1rem;
  }

  .avatar-title {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .avatar-list {
    gap: 1.5rem;
  }

  .avatar-container {
    width: 80px;
    height: 80px;
  }

  .avatar-name {
    font-size: 0.9rem;
  }

  .avatar-title {
    font-size: 0.7rem;
  }

  .subtitle h3 {
    font-size: 1.3rem;
  }
}
</style>
