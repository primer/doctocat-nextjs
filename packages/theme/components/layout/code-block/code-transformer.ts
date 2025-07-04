export const codeTransformer = (sourceCode: string, basePath: string): string => {
  if (!basePath) return sourceCode

  // to skip external URLs and other irrelevant paths
  const shouldTransform = (src: string) => !src.startsWith('http') && !src.startsWith('//') && !src.startsWith(basePath)

  // normalise for absolute (/path) and relative (path) values
  const transformSrc = (src: string) => (src.startsWith('/') ? `${basePath}${src}` : `${basePath}/${src}`)

  // Assumes all elements with a src attribute are trying to point at Next.js public folder
  return sourceCode.replace(
    /<([a-z]\w*|[A-Z]\w*(?:\.[A-Z]\w*)?)\s+([^>]*\s+)?src=["']([^"']+)["']([^>]*)/g,
    (match, tagName, before = '', src, after) => {
      if (!shouldTransform(src)) return match

      return `<${tagName} ${before}src="${transformSrc(src)}"${after}`
    },
  )
}
