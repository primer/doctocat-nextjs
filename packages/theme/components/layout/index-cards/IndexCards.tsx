import React from 'react'
import {Heading, Stack, Text} from '@primer/react-brand'
import {Folder, MdxFile} from 'nextra'

import Link from 'next/link'
import styles from './IndexCards.module.css'

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
    <Stack direction="vertical" padding="none" gap="spacious">
      {filteredData.map((item: DocsItem) => {
        if (item.kind !== 'MdxPage' || !item.frontMatter) return null

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
