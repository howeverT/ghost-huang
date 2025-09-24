<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { onMounted, ref } from 'vue'
import DevView from '@/components/Card/Waterfall.vue'
import BackGPage from '@/components/Card/BackGPage.vue'

const pageLoaded = ref(false)
const videoScreen = ref<HTMLElement | null>(null)

onMounted(() => {
  // 页面加载完成后触发渐显动画
  setTimeout(() => {
    pageLoaded.value = true
  }, 100)

  // 监听滚动到视频的事件
  window.addEventListener('scrollToVideo', scrollToVideo)
})

// 滚动到视频区域
const scrollToVideo = () => {
  if (videoScreen.value) {
    videoScreen.value.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

// 滚动到文字区域
const scrollToText = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>

  <main :class="{ loaded: pageLoaded }">
    <!-- 第一个屏幕 - 文字和按钮 -->
    <div class="screen-section text-screen">
      <div class="content">
        <TheWelcome />
      </div>
    </div>

    <!-- 第二个屏幕 - 视频 -->
    <div class="screen-section video-screen" ref="videoScreen">
      <div class="video-content">
        <!-- 视频标题 -->
        <div class="video-title">
          <h2>出道十周年 专题纪录片《回音》</h2>
          <p class="video-subtitle">漫漫长夜不曾离开，我向你奔赴而来，你就是我们的星辰大海</p>
        </div>

        <div class="video-container">
          <iframe
            src="//player.bilibili.com/player.html?isOutside=true&aid=115003906592061&bvid=BV1C6bPzkEsd&cid=31787582711&p=1"
            scrolling="no"
            border="0"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
            class="bilibili-iframe"
          ></iframe>
        </div>

        <!-- 返回箭头 -->
<!--         <div class="bottom-chevron" @click="scrollToText">-->
<!--          <svg viewBox="0 0 20 25" xmlns="http://www.w3.org/2000/svg" class="chevron-icon">-->
<!--            <path-->
<!--              d="M7.3 0L0 7.1l5.5 5.4L0 17.9 7.3 25 20 12.5 7.3 0zm-5 17.9l5.5-5.4-5.5-5.4 5-4.9 10.4 10.3L7.3 22.8l-5-4.9z"-->
<!--            />-->
<!--          </svg>-->
<!--        </div>-->
      </div>
    </div>
  </main>

  <!-- <DevView /> -->
</template>

<style scoped>
main {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
  position: relative;
  width: 100vw;
  height: 200vh; /* 两个全屏高度，内容可以滚动 */
  overflow-x: hidden;
}

.screen-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.video-screen {
  position: relative;
}

.content {
  position: relative;
  z-index: 1;
}

.video-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
}

.video-title {
  text-align: center;
  margin-bottom: 1rem;
  z-index: 3;
}

.video-title h2 {
  color: white;
  font-size: 2.5rem;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  margin: 0 0 1rem 0;
  letter-spacing: 0.1em;
}

.video-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 400;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
  line-height: 1.6;
  letter-spacing: 0.05em;
}

.video-container {
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
}

.bilibili-iframe {
  width: 100%;
  height: 600px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.bottom-chevron {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 3;
  animation: bounce 2s infinite;
}

.chevron-icon {
  width: 40px;
  height: 40px;
  fill: white;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.chevron-icon:hover {
  transform: rotate(90deg) scale(1.1);
}

/* 跳动动画 */
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-content {
    padding: 1rem;
  }

  .video-title h2 {
    font-size: 2rem;
  }

  .video-subtitle {
    font-size: 1rem;
  }

  .video-title {
    margin-bottom: 0.8rem;
  }

  .bilibili-iframe {
    height: 400px;
  }

  .video-container {
    padding: 0;
  }

  .bottom-chevron {
    bottom: 1.5rem;
  }

  .chevron-icon {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 480px) {
  .video-content {
    padding: 0.5rem;
  }

  .video-title h2 {
    font-size: 1.5rem;
  }

  .video-subtitle {
    font-size: 0.9rem;
  }

  .video-title {
    margin-bottom: 0.6rem;
  }

  .bilibili-iframe {
    height: 300px;
  }

  .video-container {
    padding: 0;
  }

  .bottom-chevron {
    bottom: 1rem;
  }

  .chevron-icon {
    width: 25px;
    height: 25px;
  }
}

main.loaded {
  opacity: 1;
  transform: translateY(0);
}
</style>
