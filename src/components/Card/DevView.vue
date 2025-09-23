<script setup lang="ts">
import { ref } from 'vue'
import ParallaxCard from './MiniCard/ParallaxCard.vue'

// 示例数据
const cards = ref([
  { id: 1, number: 1, image: '/images/img1.jpg' },
  { id: 2, number: 2, image: '/images/img2.jpg' },
  { id: 3, number: 3, image: '/images/img3.jpg' },
  { id: 4, number: 4, image: '/images/img4.jpg' },
  { id: 5, number: 5, image: '/images/img5.jpg' },
  { id: 6, number: 6, image: '/images/img6.jpg' }
])
</script>

<template>
  <div class="gallery-container">
    <ParallaxCard
      v-for="card in cards"
      :key="card.id"
      :backgroundImage="card.image"
      :number="card.number"
      class="gallery-card"
      rounded
    >
      <div class="card-caption">Card {{ card.number }}</div>
    </ParallaxCard>
  </div>
</template>

<style scoped>
.gallery-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem; /* 卡片间距 */
  justify-content: center;
  padding: 1rem;
}

/* 设置每个卡片宽度，自动换行形成多列 */
.gallery-card {
  flex: 1 1 300px; /* 最小宽度 300px，自适应扩展 */
  max-width: 350px;
}

/* 卡片内部文字 */
.card-caption {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  margin-top: 0.5rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
</style>
