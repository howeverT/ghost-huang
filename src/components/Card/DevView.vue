<script setup lang="ts">
import { ref } from 'vue'
import ParallaxCard from './MiniCard/ParallaxCard.vue'

// 示例数据
const cards = ref([
  { id: 1, number: 1, image: 'public/Home/视差滚动/20250408_PmkAV3B93_1.jpg' },
  { id: 2, number: 2, image: 'public/Home/视差滚动/20231110_NrWWmqmLa_4.jpg' },
  { id: 3, number: 3, image: 'public/Home/视差滚动/20231231_NzH5RtVA6_5.jpg' },
  { id: 4, number: 4, image: 'public/Home/视差滚动/20231228_Nzehu3u23_8.jpg' },
  { id: 5, number: 5, image: 'public/Home/视差滚动/20200314_IytEIpKMe_8.jpg' },
  { id: 6, number: 6, image: 'public/Home/视差滚动/20200521_J2XHYxApv_1.jpg' }
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
