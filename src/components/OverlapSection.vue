<template>
  <div class="white-container">
    <div class="overlap-section">
      <!-- 右侧黑色长方形 -->
      <div class="right-rectangle">
        <div class="black-content">
          <h3 class="black-title">{{ title }}</h3>
          <p class="black-text">{{ content }}</p>
          <button v-if="buttonLink" class="action-button" @click="handleButtonClick">
            跳转视频 <el-icon class="chevron-icon"><ArrowRight /></el-icon>
          </button>
        </div>
      </div>

      <!-- 左侧图片长方形 -->
      <div class="left-rectangle">
        <div
          class="image-content"
          :style="{ backgroundImage: `url(${getImagePath(imageUrl)})` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getImagePath } from '@/utils/pathUtils'

interface Props {
  title?: string
  content?: string
  imageUrl?: string
  buttonLink?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  content: '这是内容文字，您可以自定义。',
  imageUrl: '/src/assets/background/background.jpg',
  buttonLink: '',
})

// 处理按钮点击
const handleButtonClick = () => {
  if (props.buttonLink) {
    window.open(props.buttonLink, '_blank')
  }
}
</script>

<style scoped>
.white-container {
  width: 100vw;
  background-color: white;
  padding: 4rem 0;
  flex-shrink: 0;
  position: relative;
  min-height: 80vh;
}

.overlap-section {
  position: relative;
  width: 100vw;
  margin: 11vh 0 0 0;
  background-color: transparent;
  overflow: visible;
  height: 50vh;
}

.right-rectangle {
  position: absolute;
  right: 0;
  top: 0;
  width: 70%;
  height: 48vh;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.black-content {
  color: white;
  padding: 3rem;
  max-width: 50%;
  text-align: left;
}

.black-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 600;
}

.black-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #ccc;
  text-align: justify;
  margin-bottom: 2rem;
}

.action-button {
  background-color: white;
  color: black;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.action-button:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.chevron-icon {
  margin-left: 0.5rem;
  width: 1.2em;
  height: 1.2em;
  vertical-align: middle;
  fill: currentColor; /* SVG会继承父元素的颜色 */
  position: relative;
  top: -2.5px; /* 微调位置，让箭头稍微往上一点点 */
}

.left-rectangle {
  position: absolute;
  left: -8%;
  top: -11vh;
  width: 45%;
  height: 50vh;
  background-color: #fff;
  z-index: 2;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.image-content {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 响应式设计 */
@media (max-width: 1000px) {
  .overlap-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: auto;
    width: 100%;
    max-width: calc(100vw - 3rem);
    margin: 11vh auto 0;
  }

  .left-rectangle {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    max-width: 500px;
    height: 40vh;
    margin: 0 auto;
    order: 1;
  }

  .right-rectangle {
    position: relative;
    right: 0;
    top: 0;
    width: 100%;
    height: auto;
    min-height: 40vh;
    order: 2;
  }

  .black-content {
    max-width: 90%;
    padding: 2rem;
  }

  .black-title {
    font-size: 1.4rem;
  }

  .black-text {
    font-size: 0.8rem;
    margin-bottom: 1.2rem;
  }

  .action-button {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 800px) {
  .left-rectangle {
    max-width: 450px;
  }
}

@media (max-width: 768px) {
  .overlap-section {
    margin-top: 5vh;
  }

  .black-content {
    padding: 1.5rem;
  }

  .black-title {
    font-size: 1.6rem;
  }

  .black-text {
    font-size: 0.9rem;
  }

  .left-rectangle {
    height: 35vh;
    max-width: 400px;
  }

  .action-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .overlap-section {
    margin-top: 3vh;
  }

  .black-content {
    padding: 1rem;
    max-width: 95%;
  }

  .black-title {
    font-size: 1.5rem;
  }

  .black-text {
    font-size: 0.85rem;
  }

  .left-rectangle {
    height: 30vh;
  }

  .action-button {
    padding: 0.6rem 1.1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 360px) {
  .black-title {
    font-size: 1.3rem;
  }

  .black-text {
    font-size: 0.8rem;
  }

  .action-button {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}
</style>
