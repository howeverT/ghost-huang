<template>
  <div class="dom-monitor-wrapper">
    <!-- 主控制区 -->
    <div class="p-4 mb-4 bg-white rounded-lg shadow-md">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">DOM元素增强监控</h3>
      <div class="flex gap-2 mb-2">
        <input
          v-model="className"
          type="text"
          placeholder="输入类名（无需加.）"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="startMonitoring"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          开始监控
        </button>
        <button
          @click="stopMonitoring"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
        >
          停止
        </button>
      </div>
      <div class="flex gap-2">
        <button
          @click="highlightElement"
          :disabled="!elementInfo"
          class="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md transition-colors"
        >
          着色高亮
        </button>
        <button
          @click="removeHighlight"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          清除着色
        </button>
        <select
          v-model="highlightColor"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="#ff6b6b">红色</option>
          <option value="#4ecdc4">青色</option>
          <option value="#45b7d1">蓝色</option>
          <option value="#96ceb4">绿色</option>
          <option value="#ffeaa7">黄色</option>
          <option value="#dda0dd">紫色</option>
        </select>
      </div>
      <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      <p v-if="isMonitoring" class="text-green-500 text-sm mt-2">
        <i class="fa fa-refresh fa-spin mr-1"></i>正在监控: .{{ className }}
      </p>
    </div>

    <!-- 悬浮监控面板 -->
    <teleport to="body">
      <div
        v-if="isMonitoring && elementInfo"
        class="floating-panel bg-gray-900/95 text-white p-3 rounded-lg shadow-lg text-sm z-50 overflow-y-auto backdrop-blur-sm"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">.{{ className }} 调试信息</span>
          <div class="flex gap-2">
            <button @click="copyDebugInfo" class="text-gray-300 hover:text-white" title="复制调试信息">
              <i class="fa fa-copy"></i>
            </button>
            <button @click="stopMonitoring" class="text-gray-300 hover:text-white">
              <i class="fa fa-times"></i>
            </button>
          </div>
        </div>

        <!-- 分组面板 -->
        <div class="divide-y divide-gray-700 max-h-[500px] overflow-auto">
          <!-- 元素基本信息 -->
          <div class="py-2">
            <button class="w-full text-left flex justify-between items-center" @click="togglePanel('element')">
              <span class="text-blue-300 font-medium">元素信息</span>
              <span>{{ panelOpen.element ? '▼' : '▶' }}</span>
            </button>
            <div v-if="panelOpen.element" class="pl-2 mt-2 space-y-1">
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div><span class="text-gray-400">标签:</span> {{ elementInfo.tag }}</div>
                <div><span class="text-gray-400">ID:</span> {{ elementInfo.id || '无' }}</div>
                <div><span class="text-gray-400">类名:</span> {{ elementInfo.classes }}</div>
                <div><span class="text-gray-400">层级:</span> {{ elementInfo.zIndex }}</div>
              </div>
            </div>
          </div>

          <!-- 尺寸信息 -->
          <div class="py-2">
            <button class="w-full text-left flex justify-between items-center" @click="togglePanel('dimensions')">
              <span class="text-green-300 font-medium">尺寸信息</span>
              <span>{{ panelOpen.dimensions ? '▼' : '▶' }}</span>
            </button>
            <div v-if="panelOpen.dimensions" class="pl-2 mt-2 space-y-1">
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div><span class="text-gray-400">宽度:</span> {{ elementInfo.width }}px</div>
                <div><span class="text-gray-400">高度:</span> {{ elementInfo.height }}px</div>
                <div><span class="text-gray-400">内容宽:</span> {{ elementInfo.scrollWidth }}px</div>
                <div><span class="text-gray-400">内容高:</span> {{ elementInfo.scrollHeight }}px</div>
                <div><span class="text-gray-400">客户端宽:</span> {{ elementInfo.clientWidth }}px</div>
                <div><span class="text-gray-400">客户端高:</span> {{ elementInfo.clientHeight }}px</div>
                <div><span class="text-gray-400">偏移宽:</span> {{ elementInfo.offsetWidth }}px</div>
                <div><span class="text-gray-400">偏移高:</span> {{ elementInfo.offsetHeight }}px</div>
              </div>
            </div>
          </div>

          <!-- 定位信息 -->
          <div class="py-2">
            <button class="w-full text-left flex justify-between items-center" @click="togglePanel('position')">
              <span class="text-yellow-300 font-medium">定位信息</span>
              <span>{{ panelOpen.position ? '▼' : '▶' }}</span>
            </button>
            <div v-if="panelOpen.position" class="pl-2 mt-2 space-y-2">
              <div class="text-xs">
                <div class="mb-1"><span class="text-orange-300">定位方式:</span> {{ elementInfo.position }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div><span class="text-gray-400">left:</span> {{ elementInfo.left }}</div>
                  <div><span class="text-gray-400">top:</span> {{ elementInfo.top }}</div>
                  <div><span class="text-gray-400">right:</span> {{ elementInfo.right }}</div>
                  <div><span class="text-gray-400">bottom:</span> {{ elementInfo.bottom }}</div>
                </div>
              </div>
              <div class="text-xs">
                <div class="mb-1"><span class="text-orange-300">相对页面:</span></div>
                <div class="grid grid-cols-2 gap-2">
                  <div><span class="text-gray-400">X:</span> {{ elementInfo.pageX }}px</div>
                  <div><span class="text-gray-400">Y:</span> {{ elementInfo.pageY }}px</div>
                </div>
              </div>
              <div class="text-xs">
                <div class="mb-1"><span class="text-orange-300">相对视口:</span></div>
                <div class="grid grid-cols-2 gap-2">
                  <div><span class="text-gray-400">X:</span> {{ elementInfo.viewportX }}px</div>
                  <div><span class="text-gray-400">Y:</span> {{ elementInfo.viewportY }}px</div>
                </div>
              </div>
              <div class="text-xs" v-if="elementInfo.offsetParent">
                <div class="mb-1"><span class="text-orange-300">相对定位父元素:</span></div>
                <div class="grid grid-cols-2 gap-2">
                  <div><span class="text-gray-400">offsetLeft:</span> {{ elementInfo.offsetLeft }}px</div>
                  <div><span class="text-gray-400">offsetTop:</span> {{ elementInfo.offsetTop }}px</div>
                </div>
                <div><span class="text-gray-400">父元素:</span> {{ elementInfo.offsetParent }}</div>
              </div>
            </div>
          </div>

          <!-- 样式信息 -->
          <div class="py-2">
            <button class="w-full text-left flex justify-between items-center" @click="togglePanel('styles')">
              <span class="text-purple-300 font-medium">样式信息</span>
              <span>{{ panelOpen.styles ? '▼' : '▶' }}</span>
            </button>
            <div v-if="panelOpen.styles" class="pl-2 mt-2 space-y-1">
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div><span class="text-gray-400">显示:</span> {{ elementInfo.display }}</div>
                <div><span class="text-gray-400">可见性:</span> {{ elementInfo.visibility }}</div>
                <div><span class="text-gray-400">透明度:</span> {{ elementInfo.opacity }}</div>
                <div><span class="text-gray-400">溢出:</span> {{ elementInfo.overflow }}</div>
                <div><span class="text-gray-400">背景色:</span>
                  <span class="inline-block w-3 h-3 rounded ml-1 border border-gray-500"
                        :style="{ backgroundColor: elementInfo.backgroundColor }"></span>
                  {{ elementInfo.backgroundColor }}
                </div>
                <div><span class="text-gray-400">字体大小:</span> {{ elementInfo.fontSize }}</div>
                <div><span class="text-gray-400">字体颜色:</span>
                  <span class="inline-block w-3 h-3 rounded ml-1 border border-gray-500"
                        :style="{ backgroundColor: elementInfo.color }"></span>
                  {{ elementInfo.color }}
                </div>
                <div><span class="text-gray-400">边框:</span> {{ elementInfo.border }}</div>
              </div>
            </div>
          </div>

          <!-- 盒模型信息 -->
          <div class="py-2">
            <button class="w-full text-left flex justify-between items-center" @click="togglePanel('boxModel')">
              <span class="text-cyan-300 font-medium">盒模型</span>
              <span>{{ panelOpen.boxModel ? '▼' : '▶' }}</span>
            </button>
            <div v-if="panelOpen.boxModel" class="pl-2 mt-2 space-y-2">
              <div class="text-xs">
                <div class="mb-1"><span class="text-cyan-300">外边距 (margin):</span></div>
                <div class="grid grid-cols-2 gap-2">
                  <div><span class="text-gray-400">上:</span> {{ elementInfo.marginTop }}</div>
                  <div><span class="text-gray-400">右:</span> {{ elementInfo.marginRight }}</div>
                  <div><span class="text-gray-400">下:</span> {{ elementInfo.marginBottom }}</div>
                  <div><span class="text-gray-400">左:</span> {{ elementInfo.marginLeft }}</div>
                </div>
              </div>
              <div class="text-xs">
                <div class="mb-1"><span class="text-cyan-300">内边距 (padding):</span></div>
                <div class="grid grid-cols-2 gap-2">
                  <div><span class="text-gray-400">上:</span> {{ elementInfo.paddingTop }}</div>
                  <div><span class="text-gray-400">右:</span> {{ elementInfo.paddingRight }}</div>
                  <div><span class="text-gray-400">下:</span> {{ elementInfo.paddingBottom }}</div>
                  <div><span class="text-gray-400">左:</span> {{ elementInfo.paddingLeft }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 视口信息 -->
          <div class="py-2">
            <button class="w-full text-left flex justify-between items-center" @click="togglePanel('viewport')">
              <span class="text-indigo-300 font-medium">视口信息</span>
              <span>{{ panelOpen.viewport ? '▼' : '▶' }}</span>
            </button>
            <div v-if="panelOpen.viewport" class="pl-2 mt-2 space-y-1">
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div><span class="text-gray-400">窗口宽度:</span> {{ viewport.width }}px</div>
                <div><span class="text-gray-400">窗口高度:</span> {{ viewport.height }}px</div>
                <div><span class="text-gray-400">滚动 X:</span> {{ viewport.scrollX }}px</div>
                <div><span class="text-gray-400">滚动 Y:</span> {{ viewport.scrollY }}px</div>
                <div><span class="text-gray-400">屏幕宽度:</span> {{ viewport.screenWidth }}px</div>
                <div><span class="text-gray-400">屏幕高度:</span> {{ viewport.screenHeight }}px</div>
                <div><span class="text-gray-400">设备像素比:</span> {{ viewport.devicePixelRatio }}</div>
                <div><span class="text-gray-400">可用宽度:</span> {{ viewport.availWidth }}px</div>
                <div><span class="text-gray-400">可用高度:</span> {{ viewport.availHeight }}px</div>
              </div>
            </div>
          </div>

          <!-- 浏览器信息 -->
          <div class="py-2">
            <button class="w-full text-left flex justify-between items-center" @click="togglePanel('browser')">
              <span class="text-pink-300 font-medium">浏览器信息</span>
              <span>{{ panelOpen.browser ? '▼' : '▶' }}</span>
            </button>
            <div v-if="panelOpen.browser" class="pl-2 mt-2 space-y-1">
              <div class="text-xs break-all">
                <div class="mb-1"><span class="text-gray-400">User Agent:</span></div>
                <div class="bg-gray-800 p-2 rounded text-gray-300">{{ navigatorInfo.userAgent }}</div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div><span class="text-gray-400">平台:</span> {{ navigatorInfo.platform }}</div>
                <div><span class="text-gray-400">语言:</span> {{ navigatorInfo.language }}</div>
                <div><span class="text-gray-400">Cookie启用:</span> {{ navigatorInfo.cookieEnabled ? '是' : '否' }}</div>
                <div><span class="text-gray-400">在线状态:</span> {{ navigatorInfo.onLine ? '在线' : '离线' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';

const className = ref('');
const errorMessage = ref('');
const isMonitoring = ref(false);
const highlightColor = ref('#ff6b6b');

interface ElementInfo {
  tag: string;
  id: string;
  classes: string;
  width: number;
  height: number;
  left: string;
  top: string;
  right: string;
  bottom: string;
  pageX: number;
  pageY: number;
  viewportX: number;
  viewportY: number;
  offsetLeft: number;
  offsetTop: number;
  offsetParent: string;
  clientWidth: number;
  clientHeight: number;
  offsetWidth: number;
  offsetHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  position: string;
  display: string;
  backgroundColor: string;
  color: string;
  fontSize: string;
  visibility: string;
  opacity: string;
  overflow: string;
  border: string;
  zIndex: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
}

interface ViewportInfo {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  availWidth: number;
  availHeight: number;
}

interface NavigatorInfo {
  userAgent: string;
  platform: string;
  language: string;
  cookieEnabled: boolean;
  onLine: boolean;
}

const elementInfo = ref<ElementInfo | null>(null);
const viewport = ref<ViewportInfo>({
  width: window.innerWidth,
  height: window.innerHeight,
  scrollX: window.scrollX,
  scrollY: window.scrollY,
  screenWidth: window.screen.width,
  screenHeight: window.screen.height,
  devicePixelRatio: window.devicePixelRatio,
  availWidth: window.screen.availWidth,
  availHeight: window.screen.availHeight
});
const navigatorInfo = ref<NavigatorInfo>({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  cookieEnabled: navigator.cookieEnabled,
  onLine: navigator.onLine
});

let monitorTimer: ReturnType<typeof setTimeout> | null = null;
let highlightedElements = new Set<HTMLElement>();

// 多级面板展开状态
const panelOpen = ref({
  element: true,
  dimensions: true,
  position: true,
  styles: false,
  boxModel: false,
  viewport: false,
  browser: false
});

const togglePanel = (key: keyof typeof panelOpen.value) => {
  panelOpen.value[key] = !panelOpen.value[key];
};

const updateElementInfo = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);

  elementInfo.value = {
    tag: el.tagName.toLowerCase(),
    id: el.id,
    classes: el.className,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    left: style.left,
    top: style.top,
    right: style.right,
    bottom: style.bottom,
    pageX: Math.round(rect.left + window.scrollX),
    pageY: Math.round(rect.top + window.scrollY),
    viewportX: Math.round(rect.left),
    viewportY: Math.round(rect.top),
    offsetLeft: el.offsetLeft,
    offsetTop: el.offsetTop,
    offsetParent: el.offsetParent ? `${el.offsetParent.tagName.toLowerCase()}${el.offsetParent.id ? '#' + el.offsetParent.id : ''}${el.offsetParent.className ? '.' + el.offsetParent.className.split(' ').join('.') : ''}` : '无',
    clientWidth: el.clientWidth,
    clientHeight: el.clientHeight,
    offsetWidth: el.offsetWidth,
    offsetHeight: el.offsetHeight,
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
    position: style.position,
    display: style.display,
    backgroundColor: style.backgroundColor || 'transparent',
    color: style.color,
    fontSize: style.fontSize,
    visibility: style.visibility,
    opacity: style.opacity,
    overflow: style.overflow,
    border: style.border || 'none',
    zIndex: style.zIndex,
    marginTop: style.marginTop,
    marginRight: style.marginRight,
    marginBottom: style.marginBottom,
    marginLeft: style.marginLeft,
    paddingTop: style.paddingTop,
    paddingRight: style.paddingRight,
    paddingBottom: style.paddingBottom,
    paddingLeft: style.paddingLeft
  };

  viewport.value = {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    devicePixelRatio: window.devicePixelRatio,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight
  };

  navigatorInfo.value = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  };
};

const startMonitoring = () => {
  stopMonitoring();

  if (!className.value.trim()) {
    errorMessage.value = '请输入类名';
    return;
  }

  errorMessage.value = '';
  const elements = document.getElementsByClassName(className.value);
  if (elements.length === 0) {
    errorMessage.value = `未找到类名为 "${className.value}" 的元素`;
    return;
  }

  isMonitoring.value = true;
  updateElementInfo(elements[0] as HTMLElement);

  monitorTimer = setInterval(() => {
    const currentElements = document.getElementsByClassName(className.value);
    if (currentElements.length > 0) {
      updateElementInfo(currentElements[0] as HTMLElement);
    } else {
      errorMessage.value = `类名为 "${className.value}" 的元素已不存在`;
      stopMonitoring();
    }
  }, 100);
};

const stopMonitoring = () => {
  if (monitorTimer) {
    clearInterval(monitorTimer);
    monitorTimer = null;
  }
  isMonitoring.value = false;
  elementInfo.value = null;
};

const highlightElement = () => {
  if (!className.value) return;

  const elements = document.getElementsByClassName(className.value);
  Array.from(elements).forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.outline = `3px solid ${highlightColor.value}`;
    htmlEl.style.outlineOffset = '2px';
    htmlEl.style.boxShadow = `0 0 0 6px ${highlightColor.value}40`;
    htmlEl.style.transition = 'all 0.3s ease';
    highlightedElements.add(htmlEl);
  });
};

const removeHighlight = () => {
  highlightedElements.forEach((el) => {
    el.style.outline = '';
    el.style.outlineOffset = '';
    el.style.boxShadow = '';
    el.style.transition = '';
  });
  highlightedElements.clear();

  // 清除所有可能的高亮样式
  const allElements = document.querySelectorAll('*');
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.style.outline && htmlEl.style.outline.includes('solid')) {
      htmlEl.style.outline = '';
      htmlEl.style.outlineOffset = '';
      htmlEl.style.boxShadow = '';
      htmlEl.style.transition = '';
    }
  });
};

const copyDebugInfo = async () => {
  if (!elementInfo.value) return;

  const debugInfo = {
    className: className.value,
    timestamp: new Date().toISOString(),
    element: elementInfo.value,
    viewport: viewport.value,
    navigator: navigatorInfo.value
  };

  try {
    await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    // 简单的提示，可以用更好的UI库替换
    const originalText = document.querySelector('.fa-copy')?.parentElement?.title;
    if (document.querySelector('.fa-copy')?.parentElement) {
      document.querySelector('.fa-copy')!.parentElement!.title = '已复制!';
      setTimeout(() => {
        if (document.querySelector('.fa-copy')?.parentElement) {
          document.querySelector('.fa-copy')!.parentElement!.title = originalText || '复制调试信息';
        }
      }, 2000);
    }
  } catch (err) {
    console.error('复制失败:', err);
  }
};

onBeforeUnmount(() => {
  stopMonitoring();
  removeHighlight();
});
</script>

<style scoped>
.dom-monitor-wrapper {
  position: relative;
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
}

.floating-panel {
  width: 420px;
  max-height: 650px;
  overflow-y: auto;
  transition: all 0.1s ease;
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace;
  font-size: 13px;
  line-height: 1.4;
  background: #1f2937 !important;
  border: 1px solid #374151;
}

.floating-panel * {
  color: #f9fafb !important;
}

.floating-panel .text-gray-400 {
  color: #9ca3af !important;
  font-weight: 500;
}

.floating-panel .text-blue-300,
.floating-panel .text-green-300,
.floating-panel .text-yellow-300,
.floating-panel .text-purple-300,
.floating-panel .text-cyan-300,
.floating-panel .text-indigo-300,
.floating-panel .text-pink-300,
.floating-panel .text-orange-300 {
  color: #154270 !important;
  font-weight: 600;
}

.floating-panel .text-gray-300 {
  background-color: rgba(55, 65, 81, 0.7) !important;
}

.floating-panel .bg-gray-800 {
  background-color: #111827 !important;
  border: 1px solid #374151;
}

.floating-panel .divide-gray-700 > * + * {
  border-top: 1px solid #4b5563 !important;
}

.floating-panel::-webkit-scrollbar {
  width: 8px;
}

.floating-panel::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 4px;
}

.floating-panel::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

.floating-panel::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 数据值样式 */
.floating-panel .grid > div {
  padding: 2px 0;
  min-height: 20px;
  display: flex;
  align-items: center;
}

.floating-panel .grid > div:nth-child(odd) {
  background-color: rgba(55, 65, 81, 0.3);
  border-radius: 3px;
  padding-left: 4px;
}

/* 按钮样式 */
.floating-panel button {
  transition: all 0.2s ease;
  font-weight: 500;
}

.floating-panel button:hover {
  background-color: rgba(55, 65, 81, 0.7) !important;
  border-radius: 4px;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-2 {
  gap: 0.5rem;
}

.space-y-1 > * + * {
  margin-top: 0.25rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.break-all {
  word-break: break-all;
}

.inline-block {
  display: inline-block;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 主控制区样式优化 */
.dom-monitor-wrapper input {
  font-size: 14px;
}

.dom-monitor-wrapper button {
  font-size: 14px;
  font-weight: 500;
}

.dom-monitor-wrapper select {
  font-size: 14px;
}

/* 色块样式 */
.floating-panel .inline-block[style*="background"] {
  border: 1px solid #9ca3af !important;
  margin: 0 4px;
}
</style>
