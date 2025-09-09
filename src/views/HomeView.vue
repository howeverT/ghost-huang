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
  <main :class="{ loaded: pageLoaded }">
    <!-- 背景图 -->
    <div class="background-image"></div>
    <!-- 黑色蒙版 -->
    <div class="overlay"></div>

    <div class="content">
      <TheWelcome />
    </div>
  </main>
</template>

<style scoped>
main {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
  position: relative;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/src/assets/background/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -2;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.content {
  position: relative;
  z-index: 1;
}

main.loaded {
  opacity: 1;
  transform: translateY(0);
}
</style>
