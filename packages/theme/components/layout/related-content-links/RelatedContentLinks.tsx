import React from 'react'
import {Heading, UnorderedList, InlineLink} from '@primer/react-brand'
import {MdxFile} from 'nextra'

import styles from './RelatedContentLinks.module.css'
import {LinkExternalIcon} from '@primer/octicons-react'

export type RelatedContentLink = MdxFile & {
  title: string
}

export type RelatedContentLinksProps = {
  links?: RelatedContentLink[] | []
}

export function RelatedContentLinks({links}: RelatedContentLinksProps) {
  if (!links?.length) return null
  return (
    <div className="custom-component">
      <Heading as="h2" size="subhead-large">
        Related content
      </Heading>
      <UnorderedList className={styles.list}>
        {links.map(page => (
          <UnorderedList.Item key={page.route}>
            <InlineLink href={page.route}>{page.title}</InlineLink>{' '}
            {page && page.route.startsWith('http') ? <LinkExternalIcon /> : null}
          </UnorderedList.Item>
        ))}
      </UnorderedList>
    </div>
  )
}
