import React from 'react'
import {Card, Grid} from '@primer/react-brand'
import {Folder, MdxFile} from 'nextra'

import styles from './IndexCards.module.css'
import Link from 'next/link'

type IndexCardsProps = {
  route: string
  folderData: DocsItem[]
}

type FolderWithoutChildren = Omit<Folder, 'children'>

type DocsItem = (MdxFile | FolderWithoutChildren) & {
  title: string
  type: string
  children?: DocsItem[]
  firstChildRoute?: string
  withIndexPage?: boolean
  isUnderCurrentDocsTree?: boolean
}

export function IndexCards({route, folderData}: IndexCardsProps) {
  const filteredData = folderData.filter(item => item.kind === 'MdxPage' && item.route.includes(`${route}/`))

  return (
    <Grid className={styles.IndexCards}>
      {filteredData.map((item: DocsItem) => {
        if (item.kind !== 'MdxPage') return null
        return (
          <Grid.Column span={{medium: 6}} key={`cell-${item.route}`}>
            <Link href={item.route} legacyBehavior passHref>
              <Card href="#" hasBorder style={{width: '100%'}}>
                {item.frontMatter && <Card.Heading>{item.frontMatter.title}</Card.Heading>}
                {item.frontMatter && item.frontMatter.description && (
                  <Card.Description>{item.frontMatter.description}</Card.Description>
                )}
              </Card>
            </Link>
          </Grid.Column>
        )
      })}
    </Grid>
  )
}
