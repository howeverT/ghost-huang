<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const displayText = ref('')
const fullText = '我是阿鬼，希望我今晚带你进入了我温暖的星辰大海。别怕别着急，我一直都在。love you!'
const currentIndex = ref(0)
const isTypingComplete = ref(false)
let typeTimer: any = null
let pauseTimer: any = null
let resetTime: any = 10000
let typeTime: any = 200

const typeWriter = () => {
  if (currentIndex.value < fullText.length) {
    displayText.value += fullText[currentIndex.value]
    currentIndex.value++
    typeTimer = setTimeout(typeWriter, typeTime) // 每typeTime毫秒显示一个字
  } else {
    isTypingComplete.value = true
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
  typeWriter()
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
  <div class="welcome-container">
    <!-- 左侧打字机效果 -->
    <div class="left-section">
      <div class="typewriter-text">
        {{ displayText }}<span v-if="!isTypingComplete" class="cursor">|</span>
      </div>
    </div>

    <!-- 右侧拍立得展示框 -->
    <div class="right-section">
      <div class="polaroid-frame">
        <div class="polaroid-image">
          <!-- 这里可以放置人像图片 -->
          <div class="placeholder-image">人像图片</div>
        </div>
        <div class="polaroid-caption">
          阿鬼
        </div>
      </div>

      <div class="person-description">
        <h3>关于阿鬼</h3>
        <p>一个温暖而有趣的人，喜欢分享美好，带给大家温暖和快乐。</p>
        <p>愿我的星辰大海能成为你心灵的港湾。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 80vh;
  padding: 2rem;
  gap: 3rem;
}

.left-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80vw;
  height: 100vh;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 20vw;
}

.typewriter-text {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.1em;
  line-height: 1.5;
  max-width: 600px;
}

.cursor {
  animation: blink 1s infinite;
  color: #ffffff;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 拍立得样式 */
.polaroid-frame {
  background: #ffffff;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transform: rotate(-2deg);
  transition: transform 0.3s ease;
}

.polaroid-frame:hover {
  transform: rotate(0deg) scale(1.05);
}

.polaroid-image {
  width: 250px;
  height: 300px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
}

.placeholder-image {
  color: #999;
  font-size: 1.2rem;
  text-align: center;
}

.polaroid-caption {
  margin-top: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  color: #333;
  text-align: center;
  font-weight: bold;
}

/* 人物介绍样式 */
.person-description {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  max-width: 350px;
}

.person-description h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.person-description p {
  color: #ffffff;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .welcome-container {
    flex-direction: column;
    gap: 2rem;
  }

  .left-section, .right-section {
    flex: none;
    width: 100%;
  }

  .typewriter-text {
    font-size: 1.8rem;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .welcome-container {
    padding: 1rem;
  }

  .typewriter-text {
    font-size: 1.5rem;
  }

  .polaroid-image {
    width: 200px;
    height: 250px;
  }

  .person-description {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .typewriter-text {
    font-size: 1.2rem;
  }

  .polaroid-image {
    width: 180px;
    height: 220px;
  }

  .person-description {
    padding: 1rem;
  }
}
</style>
