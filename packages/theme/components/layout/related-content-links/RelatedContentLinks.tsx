import React from 'react'
import {NavList} from '@primer/react'
import {Text} from '@primer/react-brand'
import {MdxFile} from 'nextra'

import styles from './RelatedContentLinks.module.css'
import Link from 'next/link'
import {LinkExternalIcon} from '@primer/octicons-react'

export type RelatedContentLink = MdxFile & {
  title: string
}

export type RelatedContentLinksProps = {
  links: RelatedContentLink[]
}

export function RelatedContentLinks({links}: RelatedContentLinksProps) {
  if (!links.length) return null

  return (
    <aside className={styles.wrapper}>
      <Text as="p" size="100" variant="muted" weight="normal" className={styles.heading}>
        Related content
      </Text>
      <NavList>
        {links.map(page => (
          <NavItem
            className={styles.item}
            key={page.title}
            id={`toc-page-${page.route.replace(/\//g, '-')}`}
            href={page.route}
          >
            {page.title}
          </NavItem>
        ))}
      </NavList>
    </aside>
  )
}

function NavItem({href, children, ...rest}) {
  return (
    <Link href={href} legacyBehavior passHref {...rest}>
      <NavList.Item>
        {children}{' '}
        {href.startsWith('http') ? (
          <NavList.TrailingVisual>
            <LinkExternalIcon />
          </NavList.TrailingVisual>
        ) : null}
      </NavList.Item>
    </Link>
  )
}
