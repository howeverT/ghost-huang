<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import BackgroundSlideshow from './components/BackgroundSlideshow.vue'
</script>

<template>
  <BackgroundSlideshow />

  <header class="top-navbar">
    <div class="nav-container">
      <nav>
        <RouterLink to="/">星辰大海</RouterLink>
        <RouterLink to="/about">宇宙无敌号</RouterLink>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <div class="content-wrapper">
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
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 500;
  transition: all 0.3s ease;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  height: 100%;
  min-width: 15vw;
}

nav a:last-child {
  border-right: none;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

nav a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
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
