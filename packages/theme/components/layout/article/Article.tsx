import React, {PropsWithChildren} from 'react'
import {TableOfContents} from '../table-of-contents/TableOfContents'
import styles from './Article.module.css'
import bodyStyles from '../../../css/prose.module.css'
import {Heading as HeadingType} from 'nextra'

import clsx from 'clsx'

type Props = {
  toc: HeadingType[]
  metadata: {
    layout?: string
  }
}

export function Article({children, toc, metadata}: PropsWithChildren<Props>) {
  const hasToc = toc.length > 0
  return (
    <div className={clsx(styles.Article, hasToc && styles['Article--withToc'])}>
      <div className={clsx(metadata.layout !== 'custom' && bodyStyles.Prose)}>{children}</div>
      {hasToc && <TableOfContents headings={toc} />}
    </div>
  )
}
