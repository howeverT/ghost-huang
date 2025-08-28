<template>
  <div class="content-section">
    <div class="content-wrapper">
      <h2 class="section-title">{{ title }}</h2>
      <div v-for="(paragraph, index) in paragraphs" :key="index" class="section-text">
        {{ paragraph }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  paragraphs?: string[]
}

withDefaults(defineProps<Props>(), {
  title: '欢迎标题',
  paragraphs: ['这是第一段介绍文字，您可以自定义内容。', '这是第二段介绍文字，您可以自定义内容。'],
})
</script>

<style scoped>
.content-section {
  width: 100%;
  background-color: white;
  padding: 2rem 0;
  min-height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: left;
}

.section-title {
  font-size: 3rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 600;
  text-align: left;
}

.section-text {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #666;
  margin-bottom: 1.5rem;
  text-align: left;
  text-indent: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }

  .section-text {
    font-size: 1.1rem;
    text-indent: 0;
  }

  .content-wrapper {
    padding: 0 1.5rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 2rem;
  }

  .section-text {
    font-size: 1rem;
    text-indent: 0;
  }

  .content-wrapper {
    padding: 0 1rem;
  }
}
</style>
