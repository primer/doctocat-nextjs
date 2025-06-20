import React, {useCallback, useRef} from 'react'
import {Card, Grid} from '@primer/react-brand'
import {DocsItem} from '../../../types'
import {useColorMode} from '../../context/color-modes/useColorMode'
import type {StaticImageData} from 'next/image'
import Link from 'next/link'
import placeholderDarkOneThumb from './images/dark-1.png'
import placeholderDarkTwoThumb from './images/dark-2.png'
import placeholderDarkThreeThumb from './images/dark-3.png'
import placeholderDarkFourThumb from './images/dark-4.png'
import placeholderDarkFiveThumb from './images/dark-5.png'
import placeholderDarkSixThumb from './images/dark-6.png'
import placeholderLightOneThumb from './images/light-1.png'
import placeholderLightTwoThumb from './images/light-2.png'
import placeholderLightThreeThumb from './images/light-3.png'
import placeholderLightFourThumb from './images/light-4.png'
import placeholderLightFiveThumb from './images/light-5.png'
import placeholderLightSixThumb from './images/light-6.png'

import styles from './IndexCards.module.css'
import {useConfig} from '../../context/useConfig'

type IndexCardsProps = {
  route: string
  folderData: DocsItem[]
}

const darkModePlaceholderThumbs = [
  placeholderDarkOneThumb,
  placeholderDarkTwoThumb,
  placeholderDarkThreeThumb,
  placeholderDarkFourThumb,
  placeholderDarkFiveThumb,
  placeholderDarkSixThumb,
] as unknown as StaticImageData[]

const lightModePlaceholderThumbs = [
  placeholderLightOneThumb,
  placeholderLightTwoThumb,
  placeholderLightThreeThumb,
  placeholderLightFourThumb,
  placeholderLightFiveThumb,
  placeholderLightSixThumb,
] as unknown as StaticImageData[]

export function IndexCards({route, folderData}: IndexCardsProps) {
  const {basePath} = useConfig()
  const lastPlaceholderIndexRef = useRef<number>(-1)
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

  // This is a better approach to straight randomisation, as it ensures that no adjacent placeholder images will be the same.
  const getNextPlaceholderIndex = useCallback((placeholderArray: StaticImageData[]): StaticImageData => {
    if (placeholderArray.length <= 1) {
      return placeholderArray[0]
    }

    const numImagesByIndex = placeholderArray.map((_, index) => index)

    const filteredIndexes = numImagesByIndex.filter(index => index !== lastPlaceholderIndexRef.current)

    const nextIndex = filteredIndexes[Math.floor(Math.random() * filteredIndexes.length)]

    lastPlaceholderIndexRef.current = nextIndex
    return placeholderArray[nextIndex]
  }, [])

  return (
    <Grid className={styles.IndexCards}>
      {filteredData.map((item: DocsItem) => {
        if (item.type !== 'doc' || !item.frontMatter) return null

        const thumbnailUrl =
          colorMode === 'dark'
            ? (item.frontMatter.thumbnail_darkMode
                ? `${basePath || ''}${item.frontMatter.thumbnail_darkMode}`
                : null) || getNextPlaceholderIndex(darkModePlaceholderThumbs).src
            : (item.frontMatter.thumbnail ? `${basePath || ''}${item.frontMatter.thumbnail}` : null) ||
              getNextPlaceholderIndex(lightModePlaceholderThumbs).src

        return (
          <Grid.Column span={{xsmall: 12, small: 12, medium: 12, large: 6, xlarge: 4}} key={item.frontMatter.title}>
            <Link legacyBehavior passHref href={item.route}>
              <Card href="#" hasBorder fullWidth>
                <Card.Image src={thumbnailUrl} alt="" aspectRatio="4:3" />
                <Card.Heading>{item.frontMatter.title}</Card.Heading>
                {item.frontMatter.description && <Card.Description>{item.frontMatter.description}</Card.Description>}
              </Card>
            </Link>
          </Grid.Column>
        )
      })}
    </Grid>
  )
}
