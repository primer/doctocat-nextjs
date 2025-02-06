import React from 'react'
import {TableOfContents} from '../table-of-contents/TableOfContents'
import styles from './Article.module.css'
import clsx from 'clsx'

export function Article({children, toc}) {
  const hasToc = toc.length > 0
  return (
    <div className={clsx(styles.Article, hasToc && styles['Article--withToc'])}>
      <div>{children}</div>
      {hasToc && <TableOfContents headings={toc} />}
    </div>
  )
}
