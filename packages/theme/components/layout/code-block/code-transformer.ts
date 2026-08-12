export const codeTransformer = (sourceCode: string, basePath: string): string => {
  if (!basePath) return sourceCode

  // to skip external URLs and other irrelevant paths
  const shouldTransform = (assetPath: string) => {
    const hasBasePath = assetPath === basePath || assetPath.startsWith(`${basePath}/`)

    return !assetPath.startsWith('http') && !assetPath.startsWith('//') && !hasBasePath
  }

  // normalise for absolute (/path) and relative (path) values
  const transformAssetPath = (assetPath: string) =>
    assetPath.startsWith('/') ? `${basePath}${assetPath}` : `${basePath}/${assetPath}`

  const transformAttribute = (code: string, attributeName: 'src' | 'poster') => {
    const attributePattern = new RegExp(
      `<([a-z]\\w*|[A-Z]\\w*(?:\\.[A-Z]\\w*)?)\\s+([^>]*\\s+)?${attributeName}=["']([^"']+)["']([^>]*)`,
      'g',
    )

    return code.replace(attributePattern, (match, tagName, before = '', assetPath, after) => {
      if (!shouldTransform(assetPath)) return match

      return `<${tagName} ${before}${attributeName}="${transformAssetPath(assetPath)}"${after}`
    })
  }

  // Assumes src and poster attributes point at the Next.js public folder
  return transformAttribute(transformAttribute(sourceCode, 'src'), 'poster')
}
