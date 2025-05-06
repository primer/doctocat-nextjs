import React from 'react'
import {Heading, Stack, Text} from '@primer/react-brand'

import Link from 'next/link'
import styles from './IndexCards.module.css'
import {DocsItem} from '../../../types'

type IndexCardsProps = {
  route: string
  folderData: DocsItem[]
}

export function IndexCards({route, folderData}: IndexCardsProps) {
  // We don't want to show children of these pages. E.g. tabbed pages
  const onlyDirectChildren = folderData.filter(item => {
    // Normalize paths regardless of trailing slash enablement
    const normalizedRoute = route.endsWith('/') ? route : `${route}/`
    const normalizedItemRoute = item.route.endsWith('/') ? item.route : `${item.route}/`

    const isChild = normalizedItemRoute.startsWith(normalizedRoute)
    if (!isChild) return false

    const routeSegments = normalizedRoute.split('/').filter(Boolean).length
    const itemSegments = normalizedItemRoute.split('/').filter(Boolean).length

    return itemSegments === routeSegments + 1
  })

  const filteredData = onlyDirectChildren.filter(item => item.type === 'doc')
  return (
    <Stack direction="vertical" padding="none" gap="spacious">
      {filteredData.map((item: DocsItem) => {
        if (item.type !== 'doc' || !item.frontMatter) return null

        return (
          <Stack direction="vertical" padding="none" gap="condensed" key={item.frontMatter.title}>
            <Heading as="h2" size="6" className={styles.heading}>
              <Link href={item.route} legacyBehavior passHref>
                {item.frontMatter.title}
              </Link>
            </Heading>

            {item.frontMatter.description && <Text as="p">{item.frontMatter.description}</Text>}
          </Stack>
        )
      })}
    </Stack>
  )
}
