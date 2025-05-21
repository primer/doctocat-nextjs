import React from 'react'
import {Card, Grid} from '@primer/react-brand'
import {DocsItem} from '../../../types'
import {useColorMode} from '../../context/color-modes/useColorMode'

import styles from './IndexCards.module.css'

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

  const {colorMode} = useColorMode()

  return (
    <Grid className={styles.IndexCards}>
      {filteredData.map((item: DocsItem) => {
        if (item.type !== 'doc' || !item.frontMatter) return null

        const thumbnailUrl =
          colorMode === 'dark' && item.frontMatter.thumbnail_darkMode
            ? item.frontMatter.thumbnail_darkMode
            : item.frontMatter.thumbnail

        return (
          <Grid.Column span={{xsmall: 12, small: 12, medium: 12, large: 6, xlarge: 4}} key={item.frontMatter.title}>
            <Card href={item.route} hasBorder>
              <Card.Image src={thumbnailUrl} alt="" aspectRatio="4:3" />
              <Card.Heading>{item.frontMatter.title}</Card.Heading>
              {item.frontMatter.description && <Card.Description>{item.frontMatter.description}</Card.Description>}
            </Card>
          </Grid.Column>
        )
      })}
    </Grid>
  )
}
