<template>
  <header class="top-navbar" :class="{
    hidden: isScrolled && !showMobileMenu,
    expanded: showMobileMenu
  }">
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
          <!-- 有子菜单 -->
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

            <div v-if="item.submenuOpen?.value" class="submenu">
              <div v-for="subItem in item.submenuItems" :key="subItem.path" class="submenu-item">
                <a @click="handleMenuClick(subItem.path, $event)" class="submenu-link" style="cursor: pointer">
                  {{ subItem.name }}
                </a>
              </div>
            </div>
          </div>

          <!-- 无子菜单 -->
          <div v-else class="menu-item-simple">
            <a @click="handleMenuClick(item.path || '', $event)" class="menu-link" style="cursor: pointer">
              {{ item.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

interface MenuItem {
  name: string
  path?: string
  hasSubmenu: boolean
  submenuOpen?: any
  submenuItems?: Array<{ name: string; path: string }>
}

interface Props {
  menuItems?: MenuItem[]
  scrollThreshold?: number
  hideOnScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  scrollThreshold: 50,
  hideOnScroll: true,
  menuItems: () => []
})

const emit = defineEmits<{
  'menu-toggle': [isOpen: boolean]
  'menu-click': [path: string]
  'scroll-change': [isScrolled: boolean]
}>()

const router = useRouter()

const showMobileMenu = ref(false)
const isMenuClosing = ref(false)
const isScrolled = ref(false)

// 默认菜单
const showUniverseSubmenu = ref(false)
const showHistorySubmenu = ref(false)
const showCollectionSubmenu = ref(false)

const defaultMenuItems: MenuItem[] = [
  { name: '主页', path: '/', hasSubmenu: false },
  { name: '宇宙无敌号', hasSubmenu: true, submenuOpen: showUniverseSubmenu, submenuItems: [
      { name: '北京站', path: '/concert/universe/beijing' },
      { name: '广州站', path: '/concert/universe/guangzhou' },
      { name: '成都站', path: '/concert/universe/chengdu' },
      { name: '上海站', path: '/concert/universe/shanghai' },
      { name: '宁波站', path: '/concert/universe/ningbo' }
    ]},
  { name: '打开演唱会', path: '/concert/open/guangzhou', hasSubmenu: false },
  { name: '考古区', hasSubmenu: true, submenuOpen: showHistorySubmenu, submenuItems: [
      { name: '2025', path: '/history/2025' },
      { name: '2024', path: '/history/2024' },
      { name: '2023', path: '/history/2023' },
      { name: '2022', path: '/history/2022' },
      { name: '2021', path: '/history/2021' },
      { name: '2020', path: '/history/2020' }
    ]},
  { name: '合集', hasSubmenu: true, submenuOpen: showCollectionSubmenu, submenuItems: [
      { name: '好声音', path: '/collection/haoshengyin' },
      { name: '天赐的声音', path: '/collection/tianci' },
      { name: '流淌的歌声', path: '/collection/liutang' },
      { name: '我们的歌', path: '/collection/oursong' },
      { name: '歌手', path: '/collection/singer' },
      { name: '爆款来了', path: '/collection/hit' },
      { name: '新生请指教', path: '/collection/fresh' },
      { name: '蒙面唱将猜猜猜', path: '/collection/mask' }
    ]},
  { name: '账号区', path: '/related', hasSubmenu: false }
]

// 支持父组件传入菜单
const menuItems = Array.isArray(props.menuItems) && props.menuItems.length > 0 ? props.menuItems : defaultMenuItems

// 滚动处理
const handleScroll = () => {
  if (!props.hideOnScroll) return
  if (showMobileMenu.value) { isScrolled.value = false; return }
  const scrolled = window.scrollY > props.scrollThreshold
  if (scrolled !== isScrolled.value) {
    isScrolled.value = scrolled
    emit('scroll-change', scrolled)
  }
}

onMounted(() => {
  if (props.hideOnScroll) window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  if (props.hideOnScroll) window.removeEventListener('scroll', handleScroll)
})

// 菜单开关
watch(showMobileMenu, (val) => emit('menu-toggle', val))
const toggleMobileMenu = () => { showMobileMenu.value = !showMobileMenu.value; if (showMobileMenu.value) isScrolled.value = false }
const closeMobileMenu = () => {
  isMenuClosing.value = true
  setTimeout(() => {
    showMobileMenu.value = false
    showUniverseSubmenu.value = false
    showHistorySubmenu.value = false
    showCollectionSubmenu.value = false
    isMenuClosing.value = false
  }, 500)
}

// 子菜单切换
const toggleSubmenu = (submenuRef: any) => { submenuRef.value = !submenuRef.value }

// 菜单点击
const handleMenuClick = (path: string, event?: Event) => {
  if (event) { event.preventDefault(); event.stopPropagation() }
  closeMobileMenu()
  emit('menu-click', path)
  if (path) router.push(path)
}

defineExpose({ closeMobileMenu, toggleMobileMenu, isMenuOpen: showMobileMenu })
</script>
<style scoped>
.top-navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 4vh;
  background: transparent;
  z-index: 1003;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: transform 0.3s ease, height 0.3s ease;
}

/* 菜单展开时的样式 */
.top-navbar.expanded {
  height: 6vh;
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
  gap: 1.2rem;
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
  font-size: clamp(0.9rem, 2.2vw, 1.2rem);
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
  width: 28px;
  height: 20px;
  transition: all 0.3s ease;
}

.header-primary-nav-hamburger span {
  display: block;
  height: 2.5px;
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
  padding: 6vh 0 0 0;
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
  padding: 1.6rem 0;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-direction: row;
}

.menu-link-text {
  color: white;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
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
  padding: 0.8rem 0;
  color: white;
  text-decoration: none;
  font-size: clamp(0.9rem, 2.5vw, 1.2rem);
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
  padding: 1.6rem 0;
  color: white;
  text-decoration: none;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .top-navbar {
    height: 5vh;
  }

  .top-navbar.expanded {
    height: 7vh;
  }

  .nav-container {
    padding: 0 3vw;
  }

  .menu-wrapper {
    gap: 1rem;
  }

  .menu-text {
    font-size: clamp(1rem, 2.8vw, 1.4rem);
  }

  .header-primary-nav-hamburger {
    width: 32px;
    height: 24px;
  }

  .header-primary-nav-hamburger span {
    height: 3px;
  }

  .mobile-menu {
    padding: 7vh 0 0 5vw;
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
    padding: 1.5rem 0;
  }

  .menu-link-text {
    font-size: clamp(1.8rem, 5vw, 2.4rem);
  }

  .submenu-link {
    padding: 0.6rem 0;
    font-size: clamp(1rem, 3vw, 1.3rem);
  }

  .menu-link {
    padding: 1.5rem 0;
    font-size: clamp(1.8rem, 5vw, 2.4rem);
    text-align: left;
  }
}

@media (max-width: 480px) {
  .top-navbar {
    height: 6vh;
  }

  .top-navbar.expanded {
    height: 8vh;
  }

  .nav-container {
    padding: 0 2vw;
  }

  .menu-wrapper {
    gap: 0.8rem;
  }

  .menu-text {
    font-size: clamp(1.1rem, 3.5vw, 1.6rem);
  }

  .header-primary-nav-hamburger {
    width: 36px;
    height: 26px;
  }

  .header-primary-nav-hamburger span {
    height: 3.5px;
  }

  .mobile-menu {
    padding: 8vh 0 0 5vw;
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
    padding: 1.3rem 0;
  }

  .menu-link-text {
    font-size: clamp(2rem, 6vw, 2.6rem);
  }

  .submenu-link {
    padding: 0.5rem 0 0.5rem 1rem;
    font-size: clamp(1.1rem, 4vw, 1.4rem);
  }

  .menu-link {
    padding: 1.3rem 0;
    font-size: clamp(2rem, 6vw, 2.6rem);
    text-align: left;
  }
}
</style>
