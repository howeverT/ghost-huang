<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { VideoPlay, Headset, LocationFilled } from '@element-plus/icons-vue'

const pageLoaded = ref(false)
const selectedYear = ref('2024/11/01')
const contentVisible = ref(true)

// 定义时间轴数据类型
interface TimelineItem {
  year: string
  title: string
  description: string
  places: string
  links: {
    link_title: string
    link: string
    icon: string
  }[]
  image: string[]
}

// 时间轴数据 - 从JSON文件读取
const timelineData = ref<TimelineItem[]>([])

// 从JSON文件加载数据
const loadTimelineData = async () => {
  try {
    const response = await fetch('/src/assets/page_data/concert/concert.json')
    const data = await response.json()
    timelineData.value = data
  } catch (error) {
    console.error('加载时间轴数据失败:', error)
    // 如果加载失败，使用默认数据
    timelineData.value = []
  }
}

const selectYear = (year: string) => {
  if (selectedYear.value === year) return

  // 先渐隐当前内容
  contentVisible.value = false

  setTimeout(() => {
    // 更新选中年份
    selectedYear.value = year
    // 渐显新内容
    setTimeout(() => {
      contentVisible.value = true
    }, 100)
  }, 300)
}

onMounted(() => {
  // 加载时间轴数据
  loadTimelineData()

  setTimeout(() => {
    pageLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="about" :class="{ loaded: pageLoaded }">
    <p class="subtitle">时光荏苒，让我们一起回顾这段美好的旅程</p>

    <div class="timeline-container">
      <!-- 左侧时间轴 -->
      <div class="timeline-left">
        <div class="timeline">
          <div
            v-for="(item, index) in timelineData"
            :key="item.year"
            class="timeline-step"
            :class="{ active: selectedYear === item.year }"
            @click="selectYear(item.year)"
          >
            <div class="step-icon">
              <div class="step-circle"></div>
              <div class="step-number">{{ item.year }}</div>
            </div>
            <div class="step-line" v-if="index < timelineData.length - 1"></div>
          </div>
        </div>
      </div>

      <!-- 右侧内容展示 -->
      <div class="timeline-right">
        <div class="content-display" :class="{ visible: contentVisible }">
          <!-- 拍立得展示 -->
          <div class="polaroid-section">
            <div class="polaroid-frame">
              <div class="polaroid-image">
                <img
                  :src="timelineData.find((item) => item.year === selectedYear)?.image[0]"
                  :alt="timelineData.find((item) => item.year === selectedYear)?.title"
                />
              </div>
              <div class="polaroid-caption">
                {{ timelineData.find((item) => item.year === selectedYear)?.year }}
              </div>
            </div>
          </div>

          <!-- 介绍文字 -->
          <div class="description-section">
            <h3>{{ timelineData.find((item) => item.year === selectedYear)?.title }}</h3>
            <p class="places-text">
              <el-icon><LocationFilled /></el-icon
              >{{ timelineData.find((item) => item.year === selectedYear)?.places }}
            </p>
            <p class="description-text">
              {{ timelineData.find((item) => item.year === selectedYear)?.description }}
            </p>
            <div class="links-container">
              <a
                v-for="(link, index) in timelineData.find((item) => item.year === selectedYear)
                  ?.links"
                :key="index"
                :href="link.link"
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                <el-icon v-if="link.icon === 'video'">
                  <VideoPlay />
                </el-icon>
                <el-icon v-else-if="link.icon === 'audio'">
                  <Headset />
                </el-icon>
                <el-icon v-else-if="link.icon === 'picture'">
                  <Camera />
                </el-icon>
                <span class="link-text">{{ link.link_title }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
  padding: 2rem 0;
}

.about.loaded {
  opacity: 1;
  transform: translateY(0);
}

.about h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about .subtitle {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 时间轴容器 */
.timeline-container {
  display: flex;
  width: 85vw;
  gap: 4vw;
  align-items: flex-start;
  justify-content: center;
  margin: 0 auto;
  box-sizing: border-box;
}

/* 左侧时间轴 */
.timeline-left {
  flex: 0 0 10vw;
  display: flex;
  justify-content: flex-start;
  margin-left: 0;
}

.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-bottom: 4rem;
  transition: all 0.3s ease;
}

.timeline-step:hover {
  transform: scale(1.05);
}

.step-icon {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 4px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-number {
  margin-top: 0.8rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;
}

/* 激活状态 */
.timeline-step.active .step-circle {
  background: #667eea;
  border-color: #667eea;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.6);
}

.timeline-step.active .step-number {
  color: #667eea;
  font-weight: bold;
}

/* 连接线 */
.step-line {
  position: absolute;
  top: 40px;
  width: 3px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 1;
  pointer-events: none;
}

/* 调试：确保连接线可见 */
.timeline-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-bottom: 3rem;
  transition: all 0.3s ease;
}

/* 右侧内容展示 */
.timeline-right {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.content-display {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 3vw;
  max-width: 100%;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease-in-out,
    transform 0.6s ease-in-out;
}

.content-display.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 拍立得样式 */
.polaroid-section {
  flex: 0 0 auto;
}

.polaroid-frame {
  background: rgba(255, 255, 255, 0.65);
  padding: 1.5vw;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transform: rotate(-2deg);
  transition: transform 0.3s ease;
}

.polaroid-frame:hover {
  transform: rotate(0deg) scale(1.05);
}

.polaroid-image {
  width: 19vw;
  height: 25.25vw;
  overflow: hidden;
  border: 1px solid #ddd;
}

.polaroid-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.polaroid-caption {
  margin-top: 1.5rem;
  font-family: 'Courier New', monospace;
  font-size: 1.4rem;
  color: #333;
  text-align: center;
  font-weight: bold;
}

/* 介绍文字样式 */
.description-section {
  flex: 1;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  padding: 2.5vw;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-height: 45vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 35vw;
  max-width: 40vw;
}

.description-section h3 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: #667eea;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.places-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #667eea;
  margin-bottom: 1.5rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.places-text .el-icon {
  color: #667eea;
  font-size: 1.3rem;
}

.description-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(198, 193, 193, 0.8);
  margin-bottom: 2rem;
  text-align: left;
}

/* 链接列表样式 */
.links-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
}

.link-item:hover {
  color: #667eea;
  transform: translateX(5px);
}

.link-item .el-icon {
  font-size: 1.5rem;
  color: #667eea;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.link-text {
  font-size: 1.2rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 50px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .timeline-container {
    flex-direction: column;
    gap: 3rem;
    max-width: 100%;
  }

  .timeline-left {
    flex: none;
    width: 100%;
    margin-left: 0;
    justify-content: center;
  }

  .timeline {
    flex-direction: row;
    justify-content: center;
    gap: 3rem;
    position: relative;
  }

  .timeline-step {
    margin-bottom: 0;
    position: relative;
  }

  .step-line {
    width: 80px;
    height: 3px;
    top: 16px;
    left: 40px;
    position: absolute;
    z-index: 1;
    background: rgba(255, 255, 255, 0.2);
  }

  .content-display {
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    max-width: 100%;
  }

  .description-section {
    text-align: center;
    min-height: auto;
    min-width: 100%;
  }

  .places-text {
    text-align: center;
    justify-content: center;
  }

  .description-text {
    text-align: center;
    max-height: none;
    -webkit-line-clamp: unset;
  }

  .link-text {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .about h1 {
    font-size: 2.5rem;
  }

  .about .subtitle {
    font-size: 1rem;
  }

  .timeline-container {
    padding: 0 1rem;
  }

  .polaroid-image {
    width: 350px;
    height: 440px;
  }

  .description-section {
    padding: 2rem;
    min-height: 400px;
  }
}

@media (max-width: 480px) {
  .about h1 {
    font-size: 2rem;
  }

  .timeline {
    gap: 1.5rem;
  }

  .polaroid-image {
    width: 300px;
    height: 375px;
  }

  .description-section {
    padding: 1.5rem;
    min-height: 350px;
  }
}
</style>
