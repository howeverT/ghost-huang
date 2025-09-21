// 获取正确的资源路径，考虑GitHub Pages的base路径
export function getAssetPath(path: string): string {
  // 在开发环境中，直接返回原路径
  if (import.meta.env.DEV) {
    return path
  }

  // 在生产环境中，添加base路径
  const base = import.meta.env.BASE_URL
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`
}

// 获取页面数据路径
export function getPageDataPath(path: string): string {
  return getAssetPath(`src/assets/page_data/${path}`)
}
