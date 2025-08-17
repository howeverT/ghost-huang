<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { VideoPlay, Headset, LocationFilled } from '@element-plus/icons-vue'

const pageLoaded = ref(false)
const selectedYear = ref("2024/05/24")
const contentVisible = ref(true)

// 时间轴数据
const timelineData = [
  {
    year: "2024/05/24",
    title: '成都站',
    description: "———其实我是因为魔星保护了我的梦才走到这里。我时常在夜里会把我的枕头哭湿。你们为了我一次又一次地承受这些伤害，我不知道我要怎么做，才能让你们更快乐，不委屈。我一直老说，我一定要变强，我才能保护你们，但是我觉得我没有保护好。而是你们一直冲在前面为我遮挡这些伤害。让我安心地做音乐，累不累啊。不可能不累的，累就对了其实，因为我们都在走上坡路。",
    places: "成都东安湖体育公园多功能体育馆",
    links: [
      {
        link_title: "十六机位饭拍 2025.05.24 宇宙无敌号成都站演唱会大电影 全程4K超清饭拍",
        link: "https://www.bilibili.com/video/BV1dUjkzqEUj/?spm_id_from=333.1387.upload.video_card.click&vd_source=47f96c172cbb3b3f428698faafd995bc",
        icon: "video"
      },
      {
        link_title: "[4K/Hifi]黄霄雲成都演唱会全程，画质音质巅峰",
        link: "https://www.bilibili.com/video/BV1JZjrzkEaJ/?spm_id_from=333.1387.upload.video_card.click&vd_source=47f96c172cbb3b3f428698faafd995bc",
        icon: "video"
      },
      {
        link_title: "黄霄雲成都站演唱会幕后与十年前的自己对话，所想的画面未来都已成真！",
        link: "https://www.bilibili.com/video/BV1VwMXz3E2i/?spm_id_from=333.1387.homepage.video_card.click&vd_source=47f96c172cbb3b3f428698faafd995bc",
        icon: "video"
      },
      {
        link_title: "黄霄雲&孙楠《美丽的神话》有官摄了！！！一开口又是多少人的青春？",
        link: "https://www.bilibili.com/video/BV1yk3LzFEvh/?spm_id_from=333.1387.homepage.video_card.click&vd_source=47f96c172cbb3b3f428698faafd995bc",
        icon: "video"
      }
    ],
    image: ["/src/assets/background/background.jpg"]
  },
  {
    year: "2024/11/01",
    title: '北京站 Day1',
    description: "探索宇宙的奥秘，发现更多美好的事物。让我们一起在星辰大海中遨游，寻找属于我们的梦想。",
    places: "北京·华熙LIVE·五棵松·场馆",
    links: [
      {
        link_title: "【8K】黄霄雲 - 宇宙无敌号2024北京演唱会全程（11月1日）",
        link: "https://www.bilibili.com/video/BV1KHDcYLEyX/?spm_id_from=333.1387.upload.video_card.click&vd_source=47f96c172cbb3b3f428698faafd995bc",
        icon: "video"
      },
      {
        link_title: "【面包的vlog第47集】谁懂演唱会之后的戒断反应对黄霄雲的冲击有多大！！！舍不得舍不得～",
        link: "https://www.bilibili.com/video/BV1xYUSY5Ek6/?spm_id_from=333.1387.upload.video_card.click&vd_source=47f96c172cbb3b3f428698faafd995bc",
        icon: "video"
      }
    ],
    image: ["/src/assets/background/background.jpg"]
  },
  {
    year: "2024/11/02",
    title: '北京站 Day2',
    description: "开始追逐梦想，踏上星辰大海的征程。每一个梦想都值得我们去追逐，每一次努力都会让我们更接近目标。",
    places: "北京·华熙LIVE·五棵松·场馆",
    links: [
      {
        link_title: "梦想起【8K】黄霄雲 - 宇宙无敌号2024北京演唱会全程（11月2日）航视频",
        link: "https://www.bilibili.com/video/BV1ZcS6YMEtw/?spm_id_from=333.1387.upload.video_card.click&vd_source=47f96c172cbb3b3f428698faafd995bc",
        icon: "video"
      },
      {
        link_title: "【面包的vlog第47集】谁懂演唱会之后的戒断反应对黄霄雲的冲击有多大！！！舍不得舍不得～",
        link: "https://www.bilibili.com/video/BV1xYUSY5Ek6/?spm_id_from=333.1387.upload.video_card.click&vd_source=47f96c172cbb3b3f428698faafd995bc",
        icon: "video"
      }
    ],
    image: ["/src/assets/background/background.jpg"]
  },
  {
    year: "2021/08/20",
    title: '初心萌动',
    description: "心中种下星辰大海的种子，等待发芽。最初的梦想总是最珍贵的，让我们不忘初心，继续前行。",
    places: "",
    links: [
      {
        link_title: "初心萌动视频",
        link: "https://www.baidu.com",
        icon: "video"
      },
      {
        link_title: "初心萌动音频",
        link: "https://www.baidu.com",
        icon: "audio"
      }
    ],
    image: ["/src/assets/background/background.jpg"]
  }
]

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
  setTimeout(() => {
    pageLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="about" :class="{ 'loaded': pageLoaded }">
    <p class="subtitle">时光荏苒，让我们一起回顾这段美好的旅程</p>

    <div class="timeline-container">
      <!-- 左侧时间轴 -->
      <div class="timeline-left">
        <div class="timeline">
          <div
            v-for="(item, index) in timelineData"
            :key="item.year"
            class="timeline-step"
            :class="{ 'active': selectedYear === item.year }"
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
        <div class="content-display" :class="{ 'visible': contentVisible }">
          <!-- 拍立得展示 -->
          <div class="polaroid-section">
            <div class="polaroid-frame">
              <div class="polaroid-image">
                <img
                  :src="timelineData.find(item => item.year === selectedYear)?.image[0]"
                  :alt="timelineData.find(item => item.year === selectedYear)?.title"
                />
              </div>
              <div class="polaroid-caption">
                {{ timelineData.find(item => item.year === selectedYear)?.year }}
              </div>
            </div>
          </div>

          <!-- 介绍文字 -->
          <div class="description-section">
            <h3>{{ timelineData.find(item => item.year === selectedYear)?.title }}</h3>
            <p class="places-text"><el-icon><LocationFilled /></el-icon>{{ timelineData.find(item => item.year === selectedYear)?.places }}</p>
            <p class="description-text">{{ timelineData.find(item => item.year === selectedYear)?.description }}</p>
            <div class="links-container">
              <a
                v-for="(link, index) in timelineData.find(item => item.year === selectedYear)?.links"
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
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
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
  width: 100%;
  max-width: 1600px;
  gap: 6rem;
  align-items: flex-start;
}

/* 左侧时间轴 */
.timeline-left {
  flex: 0 0 150px;
  display: flex;
  justify-content: flex-start;
  margin-left: 2rem;
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
  margin-bottom: 3rem;
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-number {
  margin-top: 0.5rem;
  font-size: 1rem;
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
  top: 30px;
  width: 2px;
  height: 60px;
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
  gap: 3rem;
  max-width: 1200px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
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
  background: #ffffff;
  padding: 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transform: rotate(-2deg);
  transition: transform 0.3s ease;
}

.polaroid-frame:hover {
  transform: rotate(0deg) scale(1.05);
}

.polaroid-image {
  width: 250px;
  height: 300px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.polaroid-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.polaroid-caption {
  margin-top: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  color: #333;
  text-align: center;
  font-weight: bold;
}

/* 介绍文字样式 */
.description-section {
  flex: 1;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 40vw;
}

.description-section h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #667eea;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.places-text {
  font-size: 0.8rem;
  line-height: 1.6;
  color: #667eea;
  margin-bottom: 1rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.places-text .el-icon {
  color: #667eea;
  font-size: 1rem;
}

.description-text {
  font-size: 0.8rem;
  line-height: 1.6;
  color: rgba(198, 193, 193, 0.6);
  margin-bottom: 1.5rem;
  text-align: left;
}

/* 链接列表样式 */
.links-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.3rem 0;
}

.link-item:hover {
  color: #667eea;
  transform: translateX(5px);
}

.link-item .el-icon {
  font-size: 1.2rem;
  color: #667eea;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.link-text {
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .timeline-container {
    flex-direction: column;
    gap: 2rem;
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
    gap: 2rem;
    position: relative;
  }

  .timeline-step {
    margin-bottom: 0;
    position: relative;
  }

  .step-line {
    width: 60px;
    height: 2px;
    top: 12px;
    left: 30px;
    position: absolute;
    z-index: 1;
    background: rgba(255, 255, 255, 0.2);
  }

  .content-display {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
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
    width: 200px;
    height: 250px;
  }

  .description-section {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .about h1 {
    font-size: 2rem;
  }

  .timeline {
    gap: 1rem;
  }

  .polaroid-image {
    width: 180px;
    height: 220px;
  }

  .description-section {
    padding: 1rem;
  }
}
</style>
