<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { onMounted, ref } from 'vue'

const pageLoaded = ref(false)

onMounted(() => {
  // 页面加载完成后触发渐显动画
  setTimeout(() => {
    pageLoaded.value = true
  }, 100)
})
</script>

<template>
  <main :class="{ 'loaded': pageLoaded }">
    <TheWelcome />
  </main>
</template>

<style scoped>
main {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

main.loaded {
  opacity: 1;
  transform: translateY(0);
}
</style>
