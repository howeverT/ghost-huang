<template>
  <div
    class="drawerContainer"
    ref="drawerContainerRef" >
    <div
      class="directoryPanel"
      :style="{ flex: isExpanded ? '0 0 35%' : '0 0 20%' }"
    >
      <div class="directoryItems">
        <div
          v-for="(item, index) in directoryItems"
          :key="index"
          class="directoryItem"
          :class="{
              // active状态受 activeIndex 联动控制
              active: activeIndex === index,
              // expanded 状态需要 activeIndex 匹配 且 isExpanded 为 true
              expanded: activeIndex === index && isExpanded
            }"
          @click="selectItem(index)"
        >
          <div class="itemHeader">
            <span class="itemNumber">{{ index + 1 }}</span>
            <span class="itemTitle">{{ item.title }}</span>
          </div>
          <div class="itemContent" v-if="activeIndex === index && isExpanded">
            <div class="itemDescription">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="divider"
      @click="handleDividerClick"
    >
      <div class="dividerIcon">{{ isExpanded ? '❮' : '❯' }}</div>
    </div>

    <div class="contentPanel">
      <div
        class="contentScrollWrapper"
        ref="contentScroll"
        :class="{ 'scroll-disabled': activeIndex === -1 }"
      >
        <div
          class="contentCard"
          v-for="(item, index) in directoryItems"
          :key="index"
          :data-index="index"
          :class="{ active: activeIndex === index }"
          ref="contentCards"
        >
          <div class="cardHeader">
            <div class="cardSubtitle">{{ item.subtitle }}</div>
            <div class="cardTitle">{{ item.title }}</div>
          </div>
          <div class="cardDescription">{{ item.description }}</div>
          <div class="cardImage">
            <div class="imagePlaceholder">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 当前激活的目录项索引，初始设置为 -1 表示未激活
const activeIndex = ref(-1)
// 控制是否展开目录面板，初始设置为 false
const isExpanded = ref(false)
// 记录上次点击是否是目录项（用于分割线逻辑），不再严格使用，但保留
ref(false)
// 内容滚动容器引用
const contentScroll = ref(null)
// 所有内容卡片的引用数组
const contentCards = ref([])
// 【新增】根容器引用
const drawerContainerRef = ref(null);
// Intersection Observer 实例 (用于内容卡片)
let contentObserver = null
// 【新增】Intersection Observer 实例 (用于根容器)
let rootObserver = null

// 目录数据 (保持不变)
const directoryItems = ref([
  {
    title: "和xxxx的照片",
    subtitle: "黄霄云成都演唱会",
    description: "面包面包",
  },
  {
    title: "xxxx时刻",
    subtitle: "黄霄云成都演唱会",
    description: "我的偶像是黄霄云!",
  },

])
computed(() => {
  return activeIndex.value !== -1 ? directoryItems.value[activeIndex.value] : null
})
// 标志位：内容滚动时，避免目录点击事件触发的滚动操作
let isScrolling = false

/**
 * selectItem 处理目录项选择事件 (左侧点击)
 * @param {number} index - 选中的目录项索引
 */
const selectItem = (index) => {
  isScrolling = true // 标记开始滚动

  // 确保设置激活状态
  activeIndex.value = index

  // 确保点击时面板展开
  isExpanded.value = true

  // 滚动到对应内容
  scrollToContent(index).then(() => {
    // 滚动完成后，解除标记
    setTimeout(() => {
      isScrolling = false;
    }, 500); // 留出缓冲时间，与滚动动画匹配
  });
}

/**
 * handleDividerClick 处理分割线点击事件
 */
const handleDividerClick = () => {
  // 切换面板展开状态
  isExpanded.value = !isExpanded.value

  // 如果面板被收起，取消目录项的展开状态
  if (!isExpanded.value) {
    activeIndex.value = -1;
  } else if (activeIndex.value === -1) {
    // 如果面板被展开，但当前没有激活项，默认激活第一项
    activeIndex.value = 0;
    scrollToContent(0);
  }
}

/**
 * 滚动到指定内容
 * @param {number} index - 内容索引
 * @returns {Promise<void>}
 */
const scrollToContent = (index) => {
  return new Promise(resolve => {
    if (contentScroll.value && activeIndex.value !== -1) {
      const card = contentCards.value[index];
      if (card) {
        // 使用 scrollIntoView 结合 block: 'start' 来滚动
        // 如果对齐仍然有偏差，可能需要像上一个回复中那样使用getBoundingClientRect进行精确计算和scrollTop设置
        // 考虑到您上一次修改后没有提供新的scrollToContent，我们沿用原始的：
        card.scrollIntoView({behavior: 'smooth', block: 'start'})
        setTimeout(resolve, 300);
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  })
}

// -------------------------------------------------------------------
// 【核心逻辑：滚动事件绑定 (Intersection Observer)】

/**
 * observerCallback - Intersection Observer 回调函数 (内容卡片)
 */
const contentObserverCallback = (entries) => {
  // 如果是手动点击目录触发的滚动，则忽略滚动事件
  if (isScrolling) return;

  // 如果当前没有激活任何项，则不响应滚动事件
  if (activeIndex.value === -1) return;

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 当卡片进入视口时
      const index = parseInt(entry.target.getAttribute('data-index'));

      // 检查是否已经是当前激活项，避免重复设置
      if (activeIndex.value !== index) {
        // 仅设置 activeIndex，Intersection Observer 不改变 isExpanded 状态
        activeIndex.value = index;
      }
    }
  });
};

/**
 * 【新增】rootObserverCallback - Intersection Observer 回调函数 (根容器)
 * @param {IntersectionObserverEntry[]} entries
 */
const rootObserverCallback = (entries) => {
  entries.forEach(entry => {
    // 如果根容器离开了视口
    if (!entry.isIntersecting) {
      // 只有在目录面板处于展开状态时，才执行收回操作
      if (isExpanded.value) {
        // 调用 handleDividerClick 来执行收回逻辑 (isExpanded = false, activeIndex = -1)
        handleDividerClick();
      }
    }
    // 根容器进入视口时，不做任何操作
  });
};


/**
 * 初始化 Content Intersection Observer
 */
const initContentObserver = () => {
  const root = contentScroll.value;

  // rootMargin: 设置底部阈值为 -95%，当内容卡片接近顶部时触发
  contentObserver = new IntersectionObserver(contentObserverCallback, {
    root: root,
    rootMargin: '0px 0px -95% 0px',
    threshold: 0
  });

  // 观察所有内容卡片
  contentCards.value.forEach(card => {
    contentObserver.observe(card);
  });
};

/**
 * 【新增】初始化 Root Intersection Observer
 */
const initRootObserver = () => {
  if (drawerContainerRef.value) {
    // root: null 表示相对于视口 (viewport) 观察
    // threshold: 0 表示只要有一个像素离开视口就触发
    rootObserver = new IntersectionObserver(rootObserverCallback, {
      root: null,
      threshold: 0
    });
    rootObserver.observe(drawerContainerRef.value);
  }
}

onMounted(() => {
  // 确保 DOM 渲染完毕后再初始化 Content Observer
  if (contentCards.value.length > 0) {
    initContentObserver();
  }

  // 【新增】初始化 Root Observer
  initRootObserver();
});

onUnmounted(() => {
  // 组件卸载时停止观察 Content Observer
  if (contentObserver) {
    contentObserver.disconnect();
  }
  // 【新增】组件卸载时停止观察 Root Observer
  if (rootObserver) {
    rootObserver.disconnect();
  }
});
</script>

<style scoped>
/* 样式保持不变 */
.drawerContainer {
  display: flex;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #d32f2f 0%, #ffd700 100%);
  overflow: hidden;
}

.directoryPanel {
  display: flex;
  flex-direction: column;
  /* 宽度由 isExpanded 控制 */
  transition: flex 0.3s ease;
  background-image: url('/Home/drawer/back1.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.directoryPanel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.directoryItems {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.directoryItem {
  display: flex;
  flex-direction: column;
  min-height: 80px;
  padding: 0 20px;
  /* 初始状态下，背景半透明 */
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.directoryItem:hover {
  background: rgba(255, 255, 255, 0.3);
}

.directoryItem.active {
  /* 激活时，背景不透明 */
  background: rgba(255, 255, 255, 0.9);
  color: #b71c1c;
}

.directoryItem.expanded {
  /* 仅在展开时生效 */
  min-height: 180px;
}

.itemHeader {
  display: flex;
  align-items: center;
  height: 80px;
}

.itemNumber {
  font-size: 32px;
  font-weight: bold;
  margin-right: 15px;
  color: rgba(255, 255, 255, 0.8);
}

.directoryItem.active .itemNumber {
  color: #d32f2f;
}

.itemTitle {
  font-size: 22px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.directoryItem.active .itemTitle {
  color: #b71c1c;
}

.itemContent {
  padding: 10px 0;
  animation: fadeIn 0.3s ease;
}

.itemDescription {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.directoryItem.active .itemDescription {
  color: rgba(0, 0, 0, 0.8);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.divider {
  width: 10px;
  background: #C9171D
;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.divider:hover {
  background: rgba(211, 47, 47, 0.8);
}

.dividerIcon {
  position: absolute;
  color: white;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contentPanel {
  flex: 1;
  padding: 40px;
  background-image: url('/Home/drawer/back2.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.contentPanel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
  pointer-events: none;
  z-index: 0;
}

.contentScrollWrapper {
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  /* === 新增/修改样式开始 === */
  /* For Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none; /* 隐藏滚动条 */
  }
  /* For IE and Edge */
  -ms-overflow-style: none;  /* 隐藏 IE and Edge 滚动条 */
  /* For Firefox */
  scrollbar-width: none;  /* 隐藏 Firefox 滚动条 */
  /* === 新增/修改样式结束 === */
}
/* 新增：禁用滚动的样式 */
.contentScrollWrapper.scroll-disabled {
  overflow-y: hidden;
  scroll-behavior: auto;
  scroll-snap-type: none;
}

.contentCard {
  height: 100vh;
  padding-bottom: 40px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  color: #1B3A2D;
  position: relative;
  z-index: 1;
  padding-top: 5vh;
}

.cardHeader {
  margin-bottom: 30px;
}

.cardSubtitle {
  font-size: 16px;
  color: rgba(27, 58, 45, 0.8);
  margin-bottom: 10px;
}

.cardTitle {
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(45deg, #1B3A2D, #4F7A66);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cardDescription {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(27, 58, 45, 0.9);
  margin-bottom: 30px;
  flex: 1;
}

.cardImage {
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.imagePlaceholder {
  font-size: 24px;
  color: rgba(27, 58, 45, 0.8);
  font-weight: 300;
}

@media (max-width: 768px) {
  .drawerContainer {
    flex-direction: column;
  }

  .directoryPanel {
    flex: 0 0 auto;
    height: auto;
    max-height: 40vh;
  }

  .directoryItems {
    flex-direction: row;
    overflow-x: auto;
    justify-content: flex-start;
    padding: 15px;
  }

  .directoryItem {
    min-width: 200px;
    min-height: 100px;
  }

  .directoryItem.expanded {
    min-height: 200px;
  }

  .divider {
    width: 100%;
    height: 10px;
  }

  .contentPanel {
    flex: 1;
    height: 60vh;
    padding: 20px;
  }

  .contentCard {
    height: 60vh;
    padding-bottom: 20px;
  }

  .cardTitle {
    font-size: 32px;
  }
}
</style>
