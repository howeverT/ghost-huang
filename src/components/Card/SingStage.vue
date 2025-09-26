<template>
  <div class="stage-container">
    <!-- 背景层 -->
    <section class="parallax layer background" ref="bgRef">
      <img :src="stageBg" alt="舞台背景" />
    </section>

    <!-- 人像层 -->
    <section
      v-for="(portrait, index) in portraits"
      :key="index"
      class="parallax layer portrait"
      :ref="el => portraitRefs[index] = el as HTMLElement | null"
      :style="getPortraitStyle(portrait)"
    >
      <img :src="portrait.src" :alt="'人像' + index" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type CSSProperties } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// 让 gsap 能用 scrollTrigger
gsap.registerPlugin(ScrollTrigger)

// ✅ 静态资源用 import，避免 vite 构建时报错
import stageBg from "/Home/stage/stage.png"
import portrait1 from "/Home/stage/genai.png"
import portrait2 from "/Home/stage/genai2.png"

// 背景层 ref
const bgRef = ref<HTMLElement | null>(null)

// 人像层 refs
const portraitRefs: (HTMLElement | null)[] = []

// 人像数据
const portraits = [
  { src: portrait1, left: 100, top: 18 },
  { src: portrait2, left: 60, top: 16 },
]

// 样式生成函数，确保符合 Vue 的 CSSProperties 类型
const getPortraitStyle = (portrait: { left: number; top: number }): CSSProperties => ({
  position: "absolute",
  left: portrait.left + "%",
  top: portrait.top + "%",
  transform: "translate(-50%, -100%) scale(1)",
  opacity: 0,
})

onMounted(() => {
  if (!bgRef.value || portraitRefs.length === 0) return

  // 背景动画
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

  // 每个人像独立动画
  portraitRefs.forEach((el) => {
    if (!el) return
    gsap.set(el, { y: 0, opacity: 0 })
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".stage-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      }
    })
    tl.to(el, { y: -250, ease: "none" }, 0)
      .to(el, { opacity: 1, duration: 0.2 }, 0)
      .to(el, { opacity: 1, duration: 0.6 }, 0.2)
      .to(el, { opacity: 0, duration: 0.2 }, 0.8)
  })
})
</script>

<style scoped>
.stage-container {
  position: relative;
  height: 300vh;
  overflow-x: hidden;
  background: #111;
  width: 100%;
}

.parallax.layer {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

.parallax img {
  width: 100%;
  display: block;
  will-change: transform, opacity;
}

.background img {
  transform: scale(1.2);
  transform-origin: center center;
}

.portrait img {
  width: 30%;
  height: auto;
  transform: scale(0.9);
  transform-origin: center bottom;
}
</style>
