import {getPageMap} from 'nextra/page-map'
import type {PageMapItem, MdxFile} from 'nextra'
import {hasChildren} from './helpers/hasChildren'

function isMdxFile(item: PageMapItem): item is MdxFile {
  return 'route' in item && 'name' in item && !('children' in item) && !('data' in item)
}

function getTitle(item: MdxFile): string {
  const title = (item.frontMatter?.title as string) || item.name
  const tabLabel = item.frontMatter?.['tab-label'] as string | undefined
  return tabLabel ? `${title} - ${tabLabel}` : title
}

function getDescription(item: MdxFile): string | undefined {
  return item.frontMatter?.description as string | undefined
}

function getKeywords(item: MdxFile): string[] | undefined {
  const keywords = item.frontMatter?.keywords
  return Array.isArray(keywords) && keywords.length > 0 ? keywords : undefined
}

function getPages(items: PageMapItem[]): MdxFile[] {
  const pages: MdxFile[] = []
  for (const item of items) {
    if (isMdxFile(item)) {
      pages.push(item)
    } else if (hasChildren(item)) {
      pages.push(...getPages(item.children))
    }
  }
  return pages
}

export async function generateLLMsTxt(): Promise<string> {
  const pageMap = await getPageMap()
  const pages = getPages(pageMap)
  const basePath = process.env.NEXT_PUBLIC_DOCTOCAT_BASE_PATH || ''

  // use homepage to auto-infer site title and descriptions. most users should have filled these out.
  const homepage = pages.find(page => page.route === '/')
  const title = (homepage?.frontMatter?.title as string) || process.env.NEXT_PUBLIC_SITE_TITLE || 'Documentation'
  const description = (homepage?.frontMatter?.description as string) || undefined

  const lines: string[] = [`# ${title}`, '']

  if (description) {
    lines.push(`> ${description}`, '')
  }

  lines.push('## Pages', '')

  // start adding all sub pages
  for (const page of pages) {
    const pageTitle = getTitle(page)
    const pageDesc = getDescription(page)
    const keywords = getKeywords(page)
    const route = `${basePath}${page.route || '/'}`

    let entry = `- [${pageTitle}](${route})`
    if (pageDesc) entry += `: ${pageDesc}`
    if (keywords) entry += ` (${keywords.join(', ')})`

    lines.push(entry)
  }

  lines.push('')
  return lines.join('\n')
}
