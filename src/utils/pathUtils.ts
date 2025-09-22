// 获取正确的资源路径，开发环境和生产环境都使用相同的base路径
export function getAssetPath(path: string): string {
  const base = '/'
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`
}

// 获取页面数据路径
export function getPageDataPath(path: string): string {
  return getAssetPath(`src/assets/page_data/${path}`)
}

// 获取图片路径
export function getImagePath(path: string): string {
  // 如果路径已经是完整的URL，直接返回
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path
  }

  // 如果路径以 /src/assets 开头，使用getAssetPath处理
  if (path.startsWith('/src/assets/')) {
    return getAssetPath(path)
  }

  // 如果路径以 /assets 开头，直接添加base路径
  if (path.startsWith('/assets/')) {
    return getAssetPath(path)
  }

  // 其他情况，假设是相对路径，添加base路径
  return getAssetPath(`src/assets/${path}`)
}
