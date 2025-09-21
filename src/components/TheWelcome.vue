<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const displayText = ref('')
const fullText = '我是阿鬼，希望我今晚带你进入了我温暖的星辰大海。别怕别着急，我一直都在。love you!'
const currentIndex = ref(0)
const isTypingComplete = ref(false)
const showButton = ref(false)
const componentFading = ref(false)
let typeTimer: any = null
let pauseTimer: any = null
const resetTime: any = 60000
const typeTime: any = 10

const typeWriter = () => {
  if (currentIndex.value < fullText.length) {
    displayText.value += fullText[currentIndex.value]
    currentIndex.value++
    typeTimer = setTimeout(typeWriter, typeTime) // 每typeTime毫秒显示一个字
  } else {
    isTypingComplete.value = true
    // 显示按钮
    setTimeout(() => {
      showButton.value = true
    }, 1000)
    // resetTime
    pauseTimer = setTimeout(() => {
      resetTypewriter()
    }, resetTime)
  }
}

const resetTypewriter = () => {
  displayText.value = ''
  currentIndex.value = 0
  isTypingComplete.value = false
  showButton.value = false
  typeWriter()
}

const handleButtonClick = () => {
  componentFading.value = true

  // 整个组件渐渐消失后跳转
  setTimeout(() => {
    router.push('/concert/universe/ningbo')
  }, 1000)
}

// 滚动到视频区域
// 滚动到视频区域
const scrollToVideo = () => {
  // 触发父组件的滚动事件
  window.dispatchEvent(new CustomEvent('scrollToVideo'))
}

// 滚动到文字区域
const scrollToText = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  typeWriter()
})

onUnmounted(() => {
  if (typeTimer) clearTimeout(typeTimer)
  if (pauseTimer) clearTimeout(pauseTimer)
})
</script>

<template>
  <div class="welcome-content" :class="{ fading: componentFading }">
    <div class="center-section">
      <div class="typewriter-text">
        {{ displayText }}<span v-if="!isTypingComplete" class="cursor">|</span>
      </div>

      <!-- 按钮区域 - 始终占位 -->
      <div class="button-container">
        <button v-if="showButton" class="magic-button" @click="handleButtonClick">
          坠入我的星辰大海
        </button>
      </div>
    </div>

    <!-- 底部箭头 -->
    <div class="bottom-chevron" @click="scrollToVideo">
      <svg viewBox="0 0 20 25" xmlns="http://www.w3.org/2000/svg" class="chevron-icon">
        <path
          d="M7.3 0L0 7.1l5.5 5.4L0 17.9 7.3 25 20 12.5 7.3 0zm-5 17.9l5.5-5.4-5.5-5.4 5-4.9 10.4 10.3L7.3 22.8l-5-4.9z"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.welcome-content {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.welcome-content.fading {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
  transition: all 1s ease-in-out;
}

.center-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 2rem;
}

@media (max-width: 768px) {
  .center-section {
    gap: 2rem;
  }

  .bottom-chevron {
    bottom: 1.5rem;
  }

  .chevron-icon {
    width: 35px;
    height: 35px;
  }

  .video-section {
    padding: 1.5rem;
  }

  .bilibili-iframe {
    height: 400px;
  }
}

@media (max-width: 480px) {
  .center-section {
    gap: 0.5rem;
  }

  .bottom-chevron {
    bottom: 1rem;
  }

  .chevron-icon {
    width: 30px;
    height: 30px;
  }

  .video-section {
    padding: 1rem;
  }

  .bilibili-iframe {
    height: 300px;
  }
}

@media (max-width: 360px) {
  .center-section {
    gap: 0.5rem;
  }

  .bottom-chevron {
    bottom: 0.8rem;
  }

  .chevron-icon {
    width: 28px;
    height: 28px;
  }

  .video-section {
    padding: 0.8rem;
  }

  .bilibili-iframe {
    height: 250px;
  }
}

.typewriter-text {
  font-size: 3rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.1em;
  line-height: 1.5;
  max-width: 800px;
}

.cursor {
  animation: blink 1s infinite;
  color: #ffffff;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* 按钮样式 */
.button-container {
  height: 80px; /* 固定高度，始终占位 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}

.magic-button {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  min-width: 300px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.magic-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  background: rgba(0, 0, 0, 0.8);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 箭头样式 */
.bottom-chevron,
.top-chevron {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.bottom-chevron {
  bottom: 2rem;
}

.top-chevron {
  top: 2rem;
}

.bottom-chevron:hover,
.top-chevron:hover {
  transform: translateX(-50%) scale(1.1);
}

.chevron-icon {
  width: 40px;
  height: 40px;
  fill: white;
  transform: rotate(90deg);
  animation: bounce 2s infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.chevron-up {
  transform: rotate(-90deg);
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: rotate(90deg) translateX(0);
  }
  40% {
    transform: rotate(90deg) translateX(-10px);
  }
  60% {
    transform: rotate(90deg) translateX(-5px);
  }
}

.video-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  z-index: 3;
}

.bilibili-iframe {
  width: 100%;
  height: 600px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .typewriter-text {
    font-size: 2.8rem;
    max-width: 700px;
  }

  .magic-button {
    padding: 1.3rem 2.8rem;
    font-size: 1.4rem;
    min-width: 280px;
    height: 55px;
  }

  .bilibili-iframe {
    height: 500px;
  }
}

@media (max-width: 1024px) {
  .typewriter-text {
    font-size: 2.5rem;
    max-width: 600px;
  }

  .magic-button {
    padding: 1.2rem 2.5rem;
    font-size: 1.3rem;
    min-width: 260px;
    height: 50px;
  }

  .bilibili-iframe {
    height: 450px;
  }
}

@media (max-width: 768px) {
  .typewriter-text {
    font-size: 2rem;
    max-width: 500px;
  }

  .magic-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    min-width: 240px;
    height: 45px;
  }

  .bilibili-iframe {
    height: 400px;
  }

  .video-container {
    padding: 1.5rem;
  }
}

@media (max-width: 600px) {
  .typewriter-text {
    font-size: 1.8rem;
    max-width: 450px;
  }

  .magic-button {
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
    min-width: 220px;
    height: 42px;
  }

  .bilibili-iframe {
    height: 300px;
  }

  .video-container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .typewriter-text {
    font-size: 1.5rem;
    max-width: 400px;
  }

  .magic-button {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
    min-width: 200px;
    height: 40px;
  }

  .bilibili-iframe {
    height: 250px;
  }

  .video-container {
    padding: 0.8rem;
  }
}

@media (max-width: 360px) {
  .typewriter-text {
    font-size: 1.3rem;
    max-width: 350px;
  }

  .magic-button {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
    min-width: 180px;
    height: 38px;
  }

  .bilibili-iframe {
    height: 200px;
  }

  .video-container {
    padding: 0.5rem;
  }
}
</style>
