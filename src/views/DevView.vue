<script setup lang="ts">
import ParallaxCard from '@/components/Card/ParallaxCard.vue' // 引入组件
</script>

<template>
  <div class="page-content">
    <p v-for="i in 10" :key="i">页面正常文本 {{ i }}</p>

    <!-- 基础用法 -->
    <ParallaxCard
      :background-image="'https://picsum.photos/1920/1080?random=2'"
      :img-width="720"
      :img-height="1080"
      :default-height="600"
    >
      <div class="content-dark">
        <h2>基础视差效果</h2>
        <p>这是一个使用深色半透明背景的内容区域</p>
        <p>滚动时背景图片会产生视差效果</p>
      </div>
    </ParallaxCard>

    <p v-for="i in 5" :key="'mid'+i">中间的一些文本 {{ i }}</p>

    <!-- 多个内容块 -->
    <ParallaxCard
      :background-image="'https://picsum.photos/1920/1080?random=1'"
      :img-width="1200"
      :img-height="1600"
      :default-height="700"
      custom-class="my-custom-card"
    >
      <div class="content-light flex-column">
        <h2>浅色内容样式</h2>
        <p>这个卡片使用了浅色半透明背景</p>
        <button class="cta-button">了解更多</button>
      </div>

      <div class="content-transparent flex-center">
        <h3>透明内容区域</h3>
        <p>这里的内容直接显示在背景图片上</p>
      </div>
    </ParallaxCard>

    <p v-for="i in 5" :key="'mid2'+i">更多文本内容 {{ i }}</p>

    <!-- 不同布局的使用 -->
    <ParallaxCard
      :background-image="'https://picsum.photos/1920/1080?random=4'"
      :img-width="800"
      :img-height="1200"
      :default-height="500"
      :rounded="false"
    >
      <div class="content-dark flex-between">
        <div>
          <h3>左侧内容</h3>
          <p>使用 flex-between 布局</p>
        </div>
        <div>
          <h3>右侧内容</h3>
          <p>两端对齐分布</p>
        </div>
      </div>
    </ParallaxCard>

    <p v-for="i in 5" :key="'mid3'+i">最后的一些文本 {{ i }}</p>

    <!-- 自定义样式示例 -->
    <ParallaxCard
      :background-image="'https://picsum.photos/1920/1080?random=3'"
      :img-width="1920"
      :img-height="1080"
      :default-height="400"
    >
      <div class="custom-content">
        <div class="badge">NEW</div>
        <h2>自定义样式内容</h2>
        <p>你可以完全自定义内容区域的样式</p>
        <div class="button-group">
          <button class="btn btn-primary">主要按钮</button>
          <button class="btn btn-secondary">次要按钮</button>
        </div>
      </div>
    </ParallaxCard>

    <p v-for="i in 10" :key="'end'+i">结束文本 {{ i }}</p>
  </div>
</template>

<style scoped>
.page-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2em;
  line-height: 1.6;
  font-size: 1rem;
}

/* 自定义按钮样式 */
.cta-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.8em 2em;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 自定义内容样式 */
.custom-content {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
  border-radius: 1em;
  padding: 2em;
  color: white;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 600px;
}

.badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: #ff6b6b;
  color: white;
  padding: 0.3em 0.8em;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 1em;
  justify-content: center;
  margin-top: 1.5em;
}

.btn {
  padding: 0.7em 1.5em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #333;
}

/* 自定义卡片样式 */
:deep(.my-custom-card) {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
    align-items: center;
  }

  .custom-content {
    padding: 1.5em;
  }
}
</style>
