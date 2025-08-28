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
    <TheWelcome />

    <!-- 测试链接 -->
    <div class="test-links">
      <h2>测试链接</h2>
      <div class="link-container">
        <router-link to="/concert/chengdu" class="test-link"> 成都音乐会页面 </router-link>
        <router-link to="/chengdu" class="test-link"> 成都页面 </router-link>
      </div>
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
}

main.loaded {
  opacity: 1;
  transform: translateY(0);
}

.test-links {
  text-align: center;
  padding: 2rem;
  margin-top: 2rem;
}

.test-links h2 {
  color: #333;
  margin-bottom: 1rem;
}

.link-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.test-link {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.test-link:hover {
  background-color: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>
