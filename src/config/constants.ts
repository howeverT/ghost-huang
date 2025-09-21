// 环境配置常量
export const BASE_URL = import.meta.env.BASE_URL || '/'

// 根据环境设置不同的base路径
export const getBaseUrl = () => {
  // 开发环境
  if (import.meta.env.DEV) {
    return '/'
  }

  // 生产环境 - GitHub Pages
  return '/ghost-huang/'
}

// 路由base路径
export const ROUTER_BASE = getBaseUrl()
