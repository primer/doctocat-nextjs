export const codeTransformer = (sourceCode: string, basePath: string): string => {
  if (!basePath) return sourceCode

  // to skip external URLs and other irrelevant paths
  const shouldTransform = (src: string) => !src.startsWith('http') && !src.startsWith('//') && !src.startsWith(basePath)

  // normalise for absolute (/path) and relative (path) values
  const transformSrc = (src: string) => (src.startsWith('/') ? `${basePath}${src}` : `${basePath}/${src}`)

  const transformElement =
    (imgTag: string) =>
    (match: string, before = '', src: string, after: string) => {
      if (!shouldTransform(src)) return match
      return `<${imgTag} ${before}src="${transformSrc(src)}"${after}`
    }

  return sourceCode
    .replace(/<img\s+([^>]*\s+)?src=["']([^"']+)["']([^>]*>)/g, transformElement('img'))
    .replace(/<Image\s+([^>]*\s+)?src=["']([^"']+)["']([^>]*)/g, transformElement('Image'))
}
