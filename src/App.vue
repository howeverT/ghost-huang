<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BackgroundSlideshow from './components/BackgroundSlideshow.vue'

const route = useRoute()
const pageTransitioning = ref(false)
const pageVisible = ref(true)

// 监听路由变化，添加页面切换动画
watch(() => route.path, () => {
  // 页面渐隐
  pageVisible.value = false
  pageTransitioning.value = true

  setTimeout(() => {
    // 页面渐显
    pageVisible.value = true
    pageTransitioning.value = false
  }, 300)
})
</script>

<template>
  <BackgroundSlideshow />

  <header class="top-navbar">
    <div class="nav-container">
      <nav>
        <RouterLink to="/">主页</RouterLink>
        <RouterLink to="/about">宇宙无敌号</RouterLink>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <div class="content-wrapper" :class="{
      'page-transitioning': pageTransitioning,
      'page-visible': pageVisible
    }">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 6vh;
  background: transparent;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5vw;
}

nav {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

nav a {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4vw;
  color: white;
  text-decoration: none;
  font-size: clamp(0.7rem, 2.5vw, 1.1rem);
  font-weight: 500;
  transition: all 0.3s ease;
  height: 100%;
  min-width: 15vw;
}

nav a:last-child {
  border-right: none;
}

nav a:hover {
  color: #667eea;
}

nav a.router-link-exact-active {
  color: #667eea;
  font-weight: bold;
}

.main-content {
  margin-top: 8vh;
  min-height: 92vh;
  width: 100vw;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  width: 100%;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2vh 5vw;
  transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
  opacity: 1;
  transform: translateY(0);
}

.content-wrapper.page-transitioning {
  opacity: 0;
  transform: translateY(20px);
}

.content-wrapper.page-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-navbar {
    height: 10vh;
  }

  .nav-container {
    padding: 0 3vw;
  }

  nav a {
    padding: 0 3vw;
    min-width: 20vw;
  }

  .main-content {
    margin-top: 10vh;
    min-height: 90vh;
  }

  .content-wrapper {
    max-width: 95vw;
    padding: 2vh 3vw;
  }
}

@media (max-width: 480px) {
  .top-navbar {
    height: 12vh;
  }

  .nav-container {
    padding: 0 2vw;
  }

  nav a {
    padding: 0 2vw;
    min-width: 25vw;
    font-size: clamp(0.9rem, 3vw, 1.2rem);
  }

  .main-content {
    margin-top: 12vh;
    min-height: 88vh;
  }

  .content-wrapper {
    max-width: 98vw;
    padding: 2vh 2vw;
  }
}
</style>
