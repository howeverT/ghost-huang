<template>
  <div class="stage-container">
    <!-- 舞台背景层 -->
    <section class="parallax layer background" ref="bgRef">
      <img src="/Home/舞台/舞台.png" alt="舞台背景" />
    </section>

    <!-- 人像层 -->
    <section class="parallax layer portrait" ref="curtainRef">
      <img src="/Home/舞台/生成主体图片.png" alt="人像" />
    </section>

    <!-- 主舞台内容：案例展示 -->
    <section class="content-section">
      <h1>舞台技术最佳学习案例</h1>
      <p>
        本案例展示了舞台背景与人像在滚动中产生的视差效果，帮助你更直观地理解舞台布景与舞台表演的关系。
      </p>
      <div class="cards">
        <div v-for="(item, index) in cases" :key="index" class="card">
          <h2>{{ item.title }}</h2>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const bgRef = ref<HTMLElement | null>(null)
const curtainRef = ref<HTMLElement | null>(null)

const cases = [
  { title: "舞台灯光布置", desc: "学习灯光的角度、强度与色彩变化。" },
  { title: "舞美布景设计", desc: "通过布景创造氛围和场景转换。" },
  { title: "舞台机械控制", desc: "掌握升降台、旋转舞台的操作要点。" },
]

onMounted(() => {
  // 背景层：缓慢移动
  gsap.to(bgRef.value, {
    y: -100,
    ease: "none",
    scrollTrigger: {
      trigger: ".stage-container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  })

  // 人像层：更快移动
  gsap.to(curtainRef.value, {
    y: -250,
    ease: "none",
    scrollTrigger: {
      trigger: ".stage-container",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  })
})
</script>

<style scoped>
.stage-container {
  position: relative;
  height: 300vh; /* 拉长滚动区域，便于触发效果 */
  overflow-x: hidden;
  background: #111;
  color: #fff;
}

/* 通用层 */
.parallax.layer {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

.parallax img {
  width: 100%;
  display: block;
}

/* 背景层：稍微放大，让舞台更有包围感 */
.background img {
  transform: scale(1.2); /* 放大背景 */
  transform-origin: center center;
}

/* 人像层：缩小一点，避免过大遮挡舞台 */
.portrait img {
  transform: scale(0.8); /* 缩小人像 */
  transform-origin: center bottom; /* 以底部为基准缩放，看起来站在舞台上 */
}

.content-section {
  position: relative;
  top: 100vh; /* 进入视口后展示内容 */
  padding: 4rem 2rem;
  background: rgba(0, 0, 0, 0.85);
}

.cards {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  margin-top: 2rem;
}

.card {
  padding: 1.5rem;
  border-radius: 12px;
  background: #222;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}
</style>
