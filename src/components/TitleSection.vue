<template>
  <div class="title-section">
    <div class="title-wrapper">
      <div class="title-content">
        <div class="polaroid-frame">
          <div class="polaroid-image" :style="{ backgroundImage: `url(${imageUrl})` }"></div>
          <div class="polaroid-caption">成都印象</div>
        </div>
        <div class="title-content-right">
          <h2 class="title-text">{{ titleText }}</h2>
          <div v-if="subtitle" class="subtitle-text">
            {{ subtitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  titleText?: string
  imageUrl?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  titleText:
    'In a world of complexity, we offer simplicity through consistent, world-class services and integrated solutions.',
  imageUrl: '/src/assets/background/Chengdu.jpg',
  subtitle: '',
})
</script>

<style scoped>
.title-section {
  width: 100%;
  background-color: white;
  padding: 2rem 0;
  min-height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.title-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.title-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rem;
  padding: 0 2rem;
}

.polaroid-frame {
  background: white;
  padding: 1.5rem 1.5rem 2.2rem 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: rotate(-5deg);
  flex-shrink: 0;
}

.polaroid-image {
  width: 300px;
  height: 420px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #eee;
}

.polaroid-caption {
  margin-top: 1.2rem;
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.title-content-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.title-text {
  font-size: 2.5rem;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
  margin: 0;
  text-align: left;
  min-width: 0;
}

.subtitle-text {
  font-size: 2.5rem;
  color: #333;
  font-weight: 600;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title-wrapper {
    padding: 0 1.5rem;
    max-width: 1000px;
  }

  .title-content {
    gap: 3rem;
    padding: 0 1.5rem;
  }

  .polaroid-frame {
    padding: 0.8rem 0.8rem 1.5rem 0.8rem;
  }

  .polaroid-image {
    width: 240px;
    height: 336px;
  }

  .title-text {
    font-size: 2rem;
  }

  .subtitle-text {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .title-wrapper {
    padding: 0 1rem;
    max-width: 900px;
  }

  .title-content {
    gap: 2rem;
    flex-direction: column;
    padding: 0 1rem;
  }

  .polaroid-frame {
    padding: 0.6rem 0.6rem 1.2rem 0.6rem;
    transform: rotate(-3deg);
  }

  .polaroid-image {
    width: 210px;
    height: 294px;
  }

  .title-text {
    font-size: 1.5rem;
    text-align: center;
  }

  .subtitle-text {
    font-size: 1.5rem;
  }
}
</style>
