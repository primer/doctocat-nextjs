'use client'
import React, {PropsWithChildren} from 'react'
import {TableOfContents} from '../table-of-contents/TableOfContents'
import styles from './Article.module.css'
import bodyStyles from '../../../css/prose.module.css'
import {Heading as HeadingType} from 'nextra'

import clsx from 'clsx'
import {AccessibilityLabel} from './AccessibilityLabel'
import {Box, Stack} from '@primer/react-brand'
import {ReadinessLabel} from './ReadinessLabel'
import {SourceLink} from './SourceLink'

type Props = {
  toc: HeadingType[]
  metadata: {
    layout?: string
    [key: string]: unknown
    figma?: string
    source?: string
    storybook?: string
  }
}

export function Article({children, toc, metadata}: PropsWithChildren<Props>) {
  const hasToc = toc.length > 0

  const hasMetadata = Boolean(
    metadata.ready || metadata.a11yReviewed || metadata.source || metadata.figma || metadata.storybook,
  )

  return (
    <>
      <div className={clsx(styles.Article, hasToc && styles['Article--withToc'])}>
        <div className={styles.main}>
          {hasMetadata ? (
            <Box marginBlockEnd={48}>
              <Stack padding="none" direction="horizontal" justifyContent="space-between">
                {metadata.ready || metadata.a11yReviewed ? (
                  <Stack direction="horizontal" gap={8} padding="none">
                    {metadata.ready === true && <ReadinessLabel />}
                    {typeof metadata.a11yReviewed === 'boolean' && metadata.a11yReviewed && <AccessibilityLabel />}
                  </Stack>
                ) : null}
                <Stack direction="horizontal" gap={16} padding="none">
                  {metadata.source ? <SourceLink type="github" href={metadata.source} /> : null}
                  {metadata.figma ? <SourceLink type="figma" href={metadata.figma} /> : null}
                  {metadata.storybook ? <SourceLink type="storybook" href={metadata.storybook} /> : null}
                </Stack>
              </Stack>
            </Box>
          ) : null}
          <div className={clsx(metadata.layout !== 'custom' && bodyStyles.Prose)}>{children}</div>
        </div>
        {hasToc && (
          <div className={styles.aside}>
            <TableOfContents headings={toc} />
          </div>
        )}
      </div>
    </>
  )
}
