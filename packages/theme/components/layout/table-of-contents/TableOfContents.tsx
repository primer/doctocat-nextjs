import React, {useEffect} from 'react'
import {NavList} from '@primer/react'
import {Text} from '@primer/react-brand'
import {Heading as HeadingType} from 'nextra'

import styles from './TableOfContents.module.css'

type TableOfContentsProps = {
  headings: HeadingType[]
}

export function TableOfContents({headings}: TableOfContentsProps) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        let mostVisibleEntry = entries[0]

        for (const entry of entries) {
          if (entry.intersectionRatio > mostVisibleEntry.intersectionRatio) {
            mostVisibleEntry = entry
          }
        }

        const id = mostVisibleEntry.target.getAttribute('id')

        for (const entry of entries) {
          const entryId = entry.target.getAttribute('id')
          const el = document.getElementById(`toc-heading-${entryId}`)
          if (el) el.setAttribute('aria-current', 'false')
        }

        if (mostVisibleEntry.intersectionRatio > 0) {
          const el = document.getElementById(`toc-heading-${id}`)
          if (el) el.setAttribute('aria-current', 'location')
        }
      },
      {
        rootMargin: '0px 0px -50% 0px',
        threshold: [0, 0.5, 1],
      },
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) {
        observer.observe(el)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [headings])

  return (
    <aside className={styles.wrapper}>
      <Text as="p" size="100" variant="muted" weight="normal" className={styles.heading}>
        On this page
      </Text>
      <NavList>
        {headings.map(heading => (
          <NavList.Item
            className={styles.item}
            key={heading.id}
            id={`toc-heading-${heading.id}`}
            href={`#${heading.id}`}
          >
            {heading.value}
          </NavList.Item>
        ))}
      </NavList>
    </aside>
  )
}
