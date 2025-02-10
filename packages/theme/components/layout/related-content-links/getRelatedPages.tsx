import {DocsItem, FrontMatter} from '../../../types'
import {RelatedContentLink} from './RelatedContentLinks'

type GetRelatedPages = (
  route: string,
  activeMetadata?: FrontMatter,
  flatDocsDirectories?: DocsItem[],
) => RelatedContentLink[]

/**
 * Uses a frontmatter 'keywords' value (as an array)
 * to find adjacent pages that share the same values.
 * @returns {RelatedContentLink[]}
 */
export const getRelatedPages: GetRelatedPages = (route, activeMetadata, flatDocsDirectories) => {
  if (!activeMetadata || !flatDocsDirectories) return []
  const currentPageKeywords = activeMetadata.keywords || []

  const relatedLinks = activeMetadata['related'] || []
  const matches: RelatedContentLink[] = []

  if (!relatedLinks.length || !flatDocsDirectories.length) return []
  // 1. Check keywords property and find local matches
  for (const page of flatDocsDirectories) {
    if (page.route === route) continue

    const pageKeywords = activeMetadata.keywords || []
    const intersection = pageKeywords.filter(keyword => currentPageKeywords.includes(keyword))

    if (intersection.length) {
      matches.push(page)
    }
  }

  // 2. Check related property for internal and external links
  for (const link of relatedLinks) {
    if (!link.title || !link.href || link.href === route) continue
    if (link.href.startsWith('/')) {
      const page = flatDocsDirectories.find(localPage => localPage.route === link.href) as
        | RelatedContentLink
        | undefined

      if (page) {
        const entry = {
          ...page,
          title: link.title || page.title,
          route: link.href || page.route,
        }
        matches.push(entry)
      }
    } else {
      matches.push({...link, route: link.href, name: link.title})
    }
  }

  return matches
}
