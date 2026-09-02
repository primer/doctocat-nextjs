import {readdir, readFile} from 'node:fs/promises'
import {extname, join, posix, relative} from 'node:path'

export async function discoverSourceRoutes(contentDirectory, basePath = '') {
  const files = []

  const walk = async directory => {
    const entries = await readdir(directory, {withFileTypes: true})
    entries.sort((first, second) => (first.name < second.name ? -1 : first.name > second.name ? 1 : 0))

    for (const entry of entries) {
      const entryPath = join(directory, entry.name)
      if (entry.isDirectory()) {
        await walk(entryPath)
      } else if (entry.isFile() && ['.md', '.mdx'].includes(extname(entry.name)) && !entry.name.startsWith('_')) {
        files.push(entryPath)
      }
    }
  }

  try {
    await walk(contentDirectory)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return []
    throw error
  }

  const routes = await Promise.all(
    files.map(async filePath => {
      const source = (await readFile(filePath, 'utf8')).replace(/\r\n/g, '\n')
      const frontmatter = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)?.[1] ?? ''
      const readField = field => {
        const value = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))?.[1]?.trim()
        if (!value) return undefined
        if (value.startsWith('"') && value.endsWith('"')) {
          try {
            return JSON.parse(value)
          } catch {
            return value.slice(1, -1)
          }
        }
        if (value.startsWith("'") && value.endsWith("'")) {
          return value.slice(1, -1)
        }
        return value
      }

      const sourcePath = relative(contentDirectory, filePath).split('\\').join('/')
      const extension = extname(sourcePath)
      const withoutExtension = sourcePath.slice(0, -extension.length)
      const routeSegments = withoutExtension.split('/')
      if (routeSegments.at(-1) === 'index') routeSegments.pop()
      const route = routeSegments.length === 0 ? '/' : `/${routeSegments.map(encodeURIComponent).join('/')}/`
      const publicPath = route === '/' ? `${basePath}/` : `${basePath}${route}`
      const title = readField('title')
      const description = readField('description')

      return {
        path: publicPath,
        source: posix.join('content', sourcePath),
        ...(title ? {title} : {}),
        ...(description ? {description} : {}),
      }
    }),
  )

  return routes.sort((first, second) => (first.path < second.path ? -1 : first.path > second.path ? 1 : 0))
}
