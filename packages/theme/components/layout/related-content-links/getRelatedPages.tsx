import {DocsItem, FrontMatter} from '../../../types'
import {RelatedContentLink} from './RelatedContentLinks'
import React from 'react'

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
      matches.push({
        ...page,
        title: titleToString(page.title), // Convert ReactNode to string
      })
    }
  }

  // 2. Check related property for internal and external links
  for (const link of relatedLinks) {
    if (!link.title || !link.href || link.href === route) continue
    if (link.href.startsWith('/')) {
      const page = flatDocsDirectories.find(localPage => localPage.route === link.href)

      if (page) {
        const entry = {
          ...page,
          title: link.title || titleToString(page.title),
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

function titleToString(title: React.ReactNode): string {
  const children = React.Children.toArray(title)

  return children
    .map(child => {
      if (typeof child === 'string' || typeof child === 'number') {
        return child.toString()
      }
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<{children?: React.ReactNode}>
        if (element.props.children) {
          return titleToString(element.props.children)
        }
      }
      return ''
    })
    .join('')
}
