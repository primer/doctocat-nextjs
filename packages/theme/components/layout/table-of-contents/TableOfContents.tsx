'use client'
import React, {useEffect, useMemo} from 'react'
import {NavList} from '@primer/react'
import {Text} from '@primer/react-brand'
import {Heading as HeadingType} from 'nextra'
import clsx from 'clsx'

import styles from './TableOfContents.module.css'

type TableOfContentsProps = {
  headings: HeadingType[]
}

export function TableOfContents({headings}: TableOfContentsProps) {
  const depth2Headings = useMemo(() => headings.filter(heading => heading.depth === 2), [headings])

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

    for (const heading of depth2Headings) {
      const el = document.getElementById(heading.id)
      if (el) {
        observer.observe(el)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [depth2Headings])

  if (!depth2Headings.length) return null

  return (
    <aside className={clsx(styles.wrapper, 'exclude-from-prose', 'custom-component')}>
      <p className={styles.heading}>
        On this page
      </p>
      <NavList aria-label="Table of contents" className="custom-component">
        {depth2Headings.map(heading => (
          <NavList.Item
            className={clsx(styles.item, 'custom-component')}
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
