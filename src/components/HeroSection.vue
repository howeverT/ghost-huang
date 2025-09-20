<template>
  <div class="hero-section">
    <div class="background-image" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <div class="overlay-mask"></div>
    <div class="content-container">
      <div class="main-title" :class="`title-${titleAlign}`" :style="{ marginRight: titleMargin }">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  backgroundImage?: string
  title?: string
  titleAlign?: 'left' | 'center' | 'right'
  titleMargin?: string
}

withDefaults(defineProps<Props>(), {
  backgroundImage: '/src/assets/background/background.jpg',
  title: '标题',
  titleAlign: 'right',
  titleMargin: '5%',
})
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 1;
}

.overlay-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.content-container {
  position: relative;
  z-index: 3;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 2rem;
  box-sizing: border-box;
}

.main-title {
  font-size: 17rem;
  font-weight: bold;
  margin: 0;
  text-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.9),
    2px 2px 4px rgba(0, 0, 0, 0.7);
  letter-spacing: 0.2em;
  animation: fadeInUp 1.5s ease-out;
  writing-mode: horizontal-tb;
  white-space: nowrap;
  z-index: 10;
  display: block;
  width: 100%;
}

/* 标题对齐样式 */
.title-left {
  text-align: left;
  align-self: flex-start;
  margin-left: 0;
  margin-right: auto;
}

.title-center {
  text-align: center;
  align-self: center;
  margin-left: auto;
  margin-right: auto;
}

.title-right {
  text-align: right;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1540px) {
  .main-title {
    font-size: 10rem;
    margin-right: 3%;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 10rem;
    margin-right: 3%;
  }
}

@media (max-width: 580px) {
  .main-title {
    font-size: 5rem;
    margin-right: 2%;
  }
}
</style>
