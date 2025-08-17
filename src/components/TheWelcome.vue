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
let resetTime: any = 60000
let typeTime: any = 10

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
    router.push('/about')
  }, 1000)
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
  <div class="welcome-container" :class="{ 'fading': componentFading }">
    <!-- 居中显示打字机效果 -->
    <div class="center-section">
      <div class="typewriter-text">
        {{ displayText }}<span v-if="!isTypingComplete" class="cursor">|</span>
      </div>

      <!-- 按钮区域 - 始终占位 -->
      <div class="button-container">
        <button
          v-if="showButton"
          class="magic-button"
          @click="handleButtonClick"
        >
          坠入我的星辰大海
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  opacity: 1;
  transition: opacity 1s ease-in-out, transform 1s ease-in-out;
}

.welcome-container.fading {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.center-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 3rem;
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
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .typewriter-text {
    font-size: 2.5rem;
    max-width: 600px;
  }

  .magic-button {
    padding: 1.2rem 2.5rem;
    font-size: 1.3rem;
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
  }
}

@media (max-width: 480px) {
  .typewriter-text {
    font-size: 1.5rem;
    max-width: 400px;
  }

  .magic-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
