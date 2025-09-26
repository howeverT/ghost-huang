<!-- App.vue -->
<template>
  <div class="app">
    <!-- 使用导航栏组件 -->
    <NavigationBar
      :menu-items="customMenuItems"
      :scroll-threshold="50"
      :hide-on-scroll="true"
      @menu-toggle="onMenuToggle"
      @menu-click="onMenuClick"
      @scroll-change="onScrollChange"
      ref="navigationRef"
    />

    <!-- 主内容区域 -->
    <main class="main-content" :class="{ 'home-background': route.path === '/' }">
      <div
        class="content-wrapper"
        :class="{
          'page-transitioning': pageTransitioning,
          'page-visible': pageVisible,
        }"
      >
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavigationBar from '@/views/NavigationBar.vue'

const route = useRoute()
const navigationRef = ref()

// 页面过渡状态
const pageTransitioning = ref(false)
const pageVisible = ref(true)

// 不能使用响应式数据
const customMenuItems = [
  {
    name: '主页',
    path: '/',
    hasSubmenu: false,
  },
  {
    name: '宇宙无敌号',
    hasSubmenu: true,
    submenuOpen: ref(false),
    submenuItems: [
      { name: '北京站', path: '/concert/universe/beijing' },
      { name: '广州站', path: '/concert/universe/guangzhou' },
      { name: '成都站', path: '/concert/universe/chengdu' },
      { name: '上海站', path: '/concert/universe/shanghai' },
      { name: '宁波站', path: '/concert/universe/ningbo' },
    ],
  },
  {
    name: '打开演唱会',
    path: '/concert/open/guangzhou',
    hasSubmenu: false,
  },
  {
    name: '考古区',
    hasSubmenu: true,
    submenuOpen: ref(false),
    submenuItems: [
      { name: '2025', path: '/history/2025' },
      { name: '2024', path: '/history/2024' },
      { name: '2023', path: '/history/2023' },
      { name: '2022', path: '/history/2022' },
      { name: '2021', path: '/history/2021' },
      { name: '2020', path: '/history/2020' },
      { name: '2019', path: '/history/2019' },
      { name: '2018', path: '/history/2018' }
    ],
  },
  {
    name: '合集',
    hasSubmenu: true,
    submenuOpen: ref(false),
    submenuItems: [
      { name: '好声音', path: '/collection/haoshengyin' },
      { name: '天赐的声音', path: '/collection/tianci' },
      { name: '流淌的歌声', path: '/collection/liutang' },
      { name: '我们的歌', path: '/collection/oursong' },
      { name: '歌手', path: '/collection/singer' },
      { name: '爆款来了', path: '/collection/hit' },
      { name: '新生请指教', path: '/collection/fresh' },
      { name: '蒙面唱将猜猜猜', path: '/collection/mask' },
    ],
  },
  {
    name: '账号区',
    path: '/related',
    hasSubmenu: false,
  },
]

// 监听路由变化，确保页面正确显示
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (newPath !== oldPath) {
      pageVisible.value = true
      pageTransitioning.value = false
    }
  },
)

// 导航栏事件处理器
const onMenuToggle = (isOpen: boolean) => {
  console.log('菜单状态变化:', isOpen)
  // 可以在这里处理菜单打开/关闭的逻辑
  // 比如禁用/启用页面滚动等
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
}

const onMenuClick = (path: string) => {
  console.log('点击菜单项:', path)
  // 可以在这里添加路由跳转前的处理逻辑
  // 比如页面过渡动画等
  pageTransitioning.value = true
  setTimeout(() => {
    pageTransitioning.value = false
    pageVisible.value = true
  }, 300)
}

const onScrollChange = (isScrolled: boolean) => {
  console.log('滚动状态变化:', isScrolled)
  // 可以在这里处理滚动状态变化的逻辑
}

// 暴露一些方法给子组件或其他地方使用
const closeMenu = () => {
  if (navigationRef.value) {
    navigationRef.value.closeMobileMenu()
  }
}

const toggleMenu = () => {
  if (navigationRef.value) {
    navigationRef.value.toggleMobileMenu()
  }
}

// 导出方法供其他组件使用
defineExpose({
  closeMenu,
  toggleMenu,
})
</script>

<style scoped>
.app {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

.content-wrapper {
  width: 100vw;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  transition:
    opacity 0.6s ease-in-out,
    transform 0.6s ease-in-out;
  opacity: 1;
  transform: translateY(0);
}

.content-wrapper.page-transitioning {
  opacity: 0;
  transform: translateY(20px);
}

.content-wrapper.page-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 主页背景样式 - 固定在视口上 */
.home-background {
  background-image: url('/src/assets/background/background.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
}

/* 主页背景蒙版 */
.home-background::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: -1;
  pointer-events: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    margin-top: 0;
    min-height: 100vh;
  }

  .content-wrapper {
    max-width: 100vw;
    padding: 0;
  }
}

@media (max-width: 480px) {
  .main-content {
    margin-top: 0;
    min-height: 100vh;
  }

  .content-wrapper {
    max-width: 100vw;
    padding: 0;
  }
}
</style>
