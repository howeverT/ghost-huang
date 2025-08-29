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
        <div class="image-content" :style="{ backgroundImage: `url(${imageUrl})` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  width: 100%;
  height: 50vh;
  background-color: transparent;
  overflow: visible;
  margin-top: 11vh;
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
  font-size: 2.5rem;
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
@media (max-width: 768px) {
  .overlap-section {
    height: 50vh;
  }

  .black-content {
    padding: 2rem;
  }

  .black-title {
    font-size: 2rem;
  }

  .black-text {
    font-size: 1rem;
  }

  .left-rectangle {
    left: -5%;
    top: -20%;
    width: 35%;
  }
}

@media (max-width: 480px) {
  .overlap-section {
    height: 40vh;
  }

  .black-content {
    padding: 1.5rem;
  }

  .black-title {
    font-size: 1.5rem;
  }

  .black-text {
    font-size: 0.9rem;
  }

  .left-rectangle {
    left: -3%;
    top: -15%;
    width: 32%;
  }
}
</style>
