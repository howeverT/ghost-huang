<template>
  <div class="main-title-section">
    <div class="title-container">
      <h1 class="main-title">{{ title }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '主标题',
})
</script>

<style scoped>
.main-title-section {
  width: 100%;
  background-color: #f8f9fa;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 15vh;
}

.title-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.main-title {
  font-size: 3.5rem;
  color: #333;
  margin: 0;
  font-weight: 700;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title-section {
    padding: 1rem 0;
    min-height: 12vh;
  }

  .title-container {
    padding: 0 1.5rem;
  }

  .main-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .main-title-section {
    padding: 0.8rem 0;
    min-height: 10vh;
  }

  .title-container {
    padding: 0 1rem;
  }

  .main-title {
    font-size: 2rem;
  }
}
</style>
