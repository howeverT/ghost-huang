<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pageTransitioning = ref(false)
const pageVisible = ref(true)

// 菜单状态
const showMobileMenu = ref(false)
const showUniverseSubmenu = ref(false)
const showHistorySubmenu = ref(false)
const showCollectionSubmenu = ref(false)
const isMenuClosing = ref(false)

// 滚动状态
const isScrolled = ref(false)

// 滚动监听函数
const handleScroll = () => {
  // 菜单打开时，菜单栏始终显示，不隐藏
  if (showMobileMenu.value) {
    isScrolled.value = false
    return
  }
  // 只有菜单关闭时才根据滚动位置决定是否隐藏
  isScrolled.value = window.scrollY > 50
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 监听菜单状态变化
watch(showMobileMenu, (newValue) => {
  if (newValue) {
    // 菜单打开时，确保菜单栏显示
    isScrolled.value = false
  }
})

// 菜单数据
const menuItems = [
  {
    name: '主页',
    path: '/',
    hasSubmenu: false,
  },
  {
    name: '宇宙无敌号',
    hasSubmenu: true,
    submenuOpen: showUniverseSubmenu,
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
    submenuOpen: showHistorySubmenu,
    submenuItems: [
      { name: '2025', path: '/history/2025' },
      { name: '2024', path: '/history/2024' },
      { name: '2023', path: '/history/2023' },
      { name: '2022', path: '/history/2022' },
      { name: '2021', path: '/history/2021' },
      { name: '2020', path: '/history/2020' },
    ],
  },
  {
    name: '合集',
    hasSubmenu: true,
    submenuOpen: showCollectionSubmenu,
    submenuItems: [
      { name: '好声音', path: '/collection/haoshengyin' },
      { name: '天赐的声音', path: '/collection/tianci' },
      { name: '流觞', path: '/collection/liutang' },
      { name: '我们的歌', path: '/collection/oursong' },
      { name: '歌手', path: '/collection/singer' },
      { name: '热门', path: '/collection/hit' },
      { name: '新鲜', path: '/collection/fresh' },
      { name: '蒙面', path: '/collection/mask' },
    ],
  },
  {
    name: '账号',
    path: '/related',
    hasSubmenu: false,
  },
]

// 监听路由变化，添加页面切换动画
watch(
  () => route.path,
  () => {
    // 页面渐隐
    pageVisible.value = false
    pageTransitioning.value = true

    setTimeout(() => {
      // 页面渐显
      pageVisible.value = true
      pageTransitioning.value = false
    }, 300)
  },
)

// 切换菜单显示状态
const toggleMobileMenu = () => {
  if (showMobileMenu.value) {
    // 如果菜单是打开的，调用关闭函数
    closeMobileMenu()
  } else {
    // 如果菜单是关闭的，打开菜单
    showMobileMenu.value = true
    isScrolled.value = false
  }
}

// 关闭菜单
const closeMobileMenu = () => {
  isMenuClosing.value = true
  // 等待动画完成后才真正关闭菜单
  setTimeout(() => {
    showMobileMenu.value = false
    showUniverseSubmenu.value = false
    showHistorySubmenu.value = false
    showCollectionSubmenu.value = false
    isMenuClosing.value = false
  }, 500) // 500ms 动画时间
}

// 处理菜单点击
const handleMenuClick = (path: string) => {
  // 跳转路由
  window.location.href = path
  // 关闭菜单
  closeMobileMenu()
}

// 切换子菜单
const toggleSubmenu = (submenuRef: any) => {
  submenuRef.value = !submenuRef.value
}
</script>

<template>
  <!-- <BackgroundSlideshow /> -->

  <header class="top-navbar" :class="{ hidden: isScrolled && !showMobileMenu }">
    <div class="nav-container">
      <div class="menu-wrapper" @click="toggleMobileMenu">
        <div class="header-primary-nav-hamburger js-header-primary-nav-hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="menu-text">{{ showMobileMenu ? 'Close' : 'Menu' }}</span>
      </div>
    </div>

    <!-- 下拉菜单 -->
    <div v-if="showMobileMenu" class="mobile-menu-overlay" @click="closeMobileMenu">
      <div class="mobile-menu" :class="{ closing: isMenuClosing }" @click.stop>
        <div v-for="(item, index) in menuItems" :key="index" class="menu-item">
          <!-- 有子菜单的项目 -->
          <div v-if="item.hasSubmenu" class="menu-item-with-submenu">
            <div class="menu-link-container" @click="toggleSubmenu(item.submenuOpen)">
              <span class="menu-link-text">{{ item.name }}</span>
              <svg
                class="chevron-icon"
                :class="{ rotated: item.submenuOpen?.value }"
                viewBox="0 0 8 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.493.533l2.741 1.901L6.976.533l.855 1.68-3.517 2.82h-.127L.669 2.213l.824-1.68z"
                  fill="white"
                />
              </svg>
            </div>

            <!-- 子菜单 -->
            <div v-if="item.submenuOpen?.value" class="submenu">
              <div v-for="subItem in item.submenuItems" :key="subItem.path" class="submenu-item">
                <a
                  @click="handleMenuClick(subItem.path)"
                  class="submenu-link"
                  style="cursor: pointer"
                >
                  {{ subItem.name }}
                </a>
              </div>
            </div>
          </div>

          <!-- 没有子菜单的项目 -->
          <div v-else class="menu-item-simple">
            <a @click="handleMenuClick(item.path || '')" class="menu-link" style="cursor: pointer">
              {{ item.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>

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
</template>

<style scoped>
.top-navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 6vh;
  background: transparent;
  z-index: 1003;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: transform 0.3s ease;
}

.top-navbar:not(.hidden) {
  z-index: 1005;
}

.top-navbar.hidden {
  transform: translateY(-100%);
}

.nav-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 5vw 0 5vw;
}

.menu-wrapper {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1004;
}

.menu-wrapper:hover {
  transform: scale(1.05);
}

.menu-text {
  font-family: 'Halcom-Medium', Arial, sans-serif;
  color: white;
  font-size: clamp(1.2rem, 3.5vw, 1.8rem);
  font-weight: 700;
  transition: color 0.3s ease;
}

.menu-wrapper:hover .menu-text {
  color: #667eea;
}

.header-primary-nav-hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 32px;
  height: 24px;
  transition: all 0.3s ease;
}

.header-primary-nav-hamburger span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: white;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.menu-wrapper:hover .header-primary-nav-hamburger span {
  background-color: #667eea;
}

/* 下拉菜单样式 */
.mobile-menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.mobile-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #05051e;
  padding: 8vh 0 0 0;
  overflow-y: auto;
  animation: slideInFromTop 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 5vw;
  z-index: 1001;
}

.mobile-menu.closing {
  animation: slideOutToTop 0.5s ease;
}

.menu-item {
  width: auto;
  min-width: 200px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 主菜单项样式 */
.menu-item-with-submenu {
  width: auto;
  min-width: 200px;
}

.menu-link-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 2rem 0 2rem 0;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-direction: row;
}

.menu-link-text {
  color: white;
  font-size: clamp(2.2rem, 6vw, 3.5rem);
  font-weight: 700;
  font-family: 'Halcom-Medium', Arial, sans-serif;
  transition: all 0.3s ease;
}

.menu-link-container:hover .menu-link-text {
  color: #999;
  text-decoration: underline;
}

.chevron-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

/* 子菜单样式 */
.submenu {
  background: rgba(5, 5, 30, 0.3);
  padding-right: 0;
  width: auto;
  min-width: 200px;
}

.submenu-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.submenu-link {
  display: block;
  padding: 1rem 0 1rem 0;
  color: white;
  text-decoration: none;
  font-size: clamp(1rem, 3vw, 1.4rem);
  font-weight: 500;
  font-family: 'Halcom-Medium', Arial, sans-serif;
  transition: all 0.3s ease;
  text-align: left;
  background: none;
  border: none;
  outline: none;
}

.submenu-link:hover {
  color: #999;
  text-decoration: underline;
  background: none;
}

.submenu-link:visited {
  color: white;
  background: none;
}

.submenu-link:focus {
  background: none;
  outline: none;
}

.submenu-link.router-link-exact-active {
  color: #667eea;
  font-weight: 600;
  background: none;
}

/* 简单菜单项样式 */
.menu-item-simple {
  width: auto;
  min-width: 200px;
}

.menu-link {
  display: block;
  padding: 2rem 0 2rem 0;
  color: white;
  text-decoration: none;
  font-size: clamp(2.2rem, 6vw, 3.5rem);
  font-weight: 700;
  font-family: 'Halcom-Medium', Arial, sans-serif;
  transition: all 0.3s ease;
  text-align: left;
  background: none;
  border: none;
  outline: none;
}

.menu-link:hover {
  color: #999;
  text-decoration: underline;
  background: none;
}

.menu-link:visited {
  color: white;
  background: none;
}

.menu-link:focus {
  background: none;
  outline: none;
}

.menu-link.router-link-exact-active {
  color: #667eea;
  font-weight: 800;
  background: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromTop {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideOutToTop {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
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

/* 响应式设计 */
@media (max-width: 768px) {
  .top-navbar {
    height: 8vh;
  }

  .nav-container {
    padding: 0 3vw;
  }

  .menu-wrapper {
    gap: 1.2rem;
  }

  .menu-text {
    font-size: clamp(1.4rem, 4vw, 2rem);
  }

  .header-primary-nav-hamburger {
    width: 36px;
    height: 28px;
  }

  .header-primary-nav-hamburger span {
    height: 4px;
  }

  .mobile-menu {
    padding-left: 5vw;
  }

  .menu-item {
    min-width: 150px;
  }

  .menu-item-with-submenu {
    min-width: 150px;
  }

  .menu-item-simple {
    min-width: 150px;
  }

  .submenu {
    min-width: 150px;
  }

  .menu-link-container {
    padding: 1.8rem 0 1.8rem 0;
  }

  .menu-link-text {
    font-size: clamp(2.4rem, 7vw, 3.5rem);
  }

  .submenu-link {
    padding: 0.8rem 0 0.8rem 0;
    font-size: clamp(1.2rem, 4vw, 1.6rem);
  }

  .menu-link {
    padding: 1.8rem 0 1.8rem 0;
    font-size: clamp(2.4rem, 7vw, 3.5rem);
    text-align: left;
  }

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
  .top-navbar {
    height: 10vh;
  }

  .nav-container {
    padding: 0 2vw;
  }

  .menu-wrapper {
    gap: 1rem;
  }

  .menu-text {
    font-size: clamp(1.6rem, 5vw, 2.2rem);
  }

  .header-primary-nav-hamburger {
    width: 40px;
    height: 30px;
  }

  .header-primary-nav-hamburger span {
    height: 4px;
  }

  .mobile-menu {
    padding-left: 5vw;
  }

  .menu-item {
    min-width: 120px;
  }

  .menu-item-with-submenu {
    min-width: 120px;
  }

  .menu-item-simple {
    min-width: 120px;
  }

  .submenu {
    min-width: 120px;
  }

  .menu-link-container {
    padding: 1.5rem 0 1.5rem 0;
  }

  .menu-link-text {
    font-size: clamp(2.6rem, 8vw, 3.8rem);
  }

  .submenu-link {
    padding: 0.7rem 0 0.7rem 1.2rem;
    font-size: clamp(1.4rem, 5vw, 1.8rem);
  }

  .menu-link {
    padding: 1.5rem 0 1.5rem 0;
    font-size: clamp(2.6rem, 8vw, 3.8rem);
    text-align: left;
  }

  .main-content {
    margin-top: 0;
    min-height: 100vh;
  }

  .content-wrapper {
    max-width: 100vw;
    padding: 0;
  }
}

/* 主页背景样式 - 固定在视口上 */
.home-background {
  background-image: url('/ghost-huang/src/assets/background/background.jpg');
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
</style>
