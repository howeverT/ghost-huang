<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pageTransitioning = ref(false)
const pageVisible = ref(true)

// 二级菜单状态
const showHistorySubmenu = ref(false)
const showYearSubmenu = ref(false)
const selectedYear = ref('2024')
const selectedType = ref('all')

// 年份和类型数据
const years = ['2024', '2023', '2022']
const types = [
  { key: 'video', label: '视频' },
  { key: 'variety', label: '综艺' },
  { key: 'festival', label: '音乐节/演出' },
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

// 处理年份选择
const handleYearSelect = (year: string) => {
  selectedYear.value = year
  showYearSubmenu.value = false
  // 触发全局事件，通知HistoryView更新年份
  window.dispatchEvent(
    new CustomEvent('history-filter-changed', {
      detail: { year, type: selectedType.value },
    }),
  )
}

// 处理类型选择
const handleTypeSelect = (type: string) => {
  selectedType.value = type
  showYearSubmenu.value = false
  showHistorySubmenu.value = false
  // 触发全局事件，通知HistoryView更新筛选
  window.dispatchEvent(
    new CustomEvent('history-filter-changed', {
      detail: { year: selectedYear.value, type },
    }),
  )
}

// 关闭所有菜单
const closeAllMenus = () => {
  setTimeout(() => {
    showHistorySubmenu.value = false
    showYearSubmenu.value = false
  }, 200)
}
</script>

<template>
  <!-- <BackgroundSlideshow /> -->

  <header class="top-navbar">
    <div class="nav-container">
      <nav>
        <RouterLink to="/">主页</RouterLink>
        <RouterLink to="/about">宇宙无敌号</RouterLink>
        <!-- 考古区带二级菜单 -->
        <div
          class="nav-item-with-submenu"
          @mouseenter="showHistorySubmenu = true"
          @mouseleave="closeAllMenus"
        >
          <RouterLink to="/history" class="nav-link">考古区</RouterLink>

          <!-- 二级菜单：年份 -->
          <div
            v-if="showHistorySubmenu"
            class="submenu year-submenu"
            @mouseenter="showYearSubmenu = true"
            @mouseleave="showYearSubmenu = false"
          >
            <div
              v-for="year in years"
              :key="year"
              class="submenu-item year-item"
              :class="{ active: selectedYear === year }"
              @click="handleYearSelect(year)"
            >
              {{ year }}

              <!-- 三级菜单：类型 -->
              <div v-if="showYearSubmenu && selectedYear === year" class="submenu type-submenu">
                <div
                  v-for="type in types"
                  :key="type.key"
                  class="submenu-item type-item"
                  :class="{ active: selectedType === type.key }"
                  @click="handleTypeSelect(type.key)"
                >
                  {{ type.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <main class="main-content">
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 6vh;
  background: transparent;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5vw;
}

nav {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

nav a {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4vw;
  color: white;
  text-decoration: none;
  font-size: clamp(0.7rem, 2.5vw, 1.1rem);
  font-weight: 500;
  transition: all 0.3s ease;
  height: 100%;
  min-width: 15vw;
}

nav a:last-child {
  border-right: none;
}

nav a:hover {
  color: #667eea;
}

nav a.router-link-exact-active {
  color: #667eea;
  font-weight: bold;
}

/* 二级菜单样式 */
.nav-item-with-submenu {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-item-with-submenu .nav-link {
  padding: 0 4vw;
  color: white;
  text-decoration: none;
  font-size: clamp(0.7rem, 2.5vw, 1.1rem);
  font-weight: 500;
  transition: all 0.3s ease;
  height: 100%;
  min-width: 15vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-item-with-submenu .nav-link:hover {
  color: #667eea;
}

.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  background: transparent;
  border: none;
  padding: 0.5rem 0;
  min-width: 120px;
  z-index: 1001;
}

.year-submenu {
  left: 50%;
  transform: translateX(-50%);
}

.year-item {
  position: relative;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.year-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #667eea;
}

.year-item.active {
  background: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

/* 三级菜单样式 */
.type-submenu {
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 5px;
  background: transparent;
  border: none;
  padding: 0.5rem 0;
  min-width: 100px;
}

.type-item {
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.9rem;
}

.type-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #667eea;
}

.type-item.active {
  background: rgba(102, 126, 234, 0.3);
  color: #667eea;
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
    height: 10vh;
  }

  .nav-container {
    padding: 0 3vw;
  }

  nav a {
    padding: 0 3vw;
    min-width: 20vw;
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
    height: 12vh;
  }

  .nav-container {
    padding: 0 2vw;
  }

  nav a {
    padding: 0 2vw;
    min-width: 25vw;
    font-size: clamp(0.9rem, 3vw, 1.2rem);
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
</style>
