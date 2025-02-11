'use client'
import React from 'react'
import type {ComponentProps, ReactElement} from 'react'
import {LinkIcon} from '@primer/octicons-react'
import styles from './HeadingLink.module.css'
import NextLink from 'next/link'
import {Heading, type HeadingProps} from '@primer/react-brand'

const headingSizeMap: Record<string, HeadingProps['size']> = {
  h1: '4',
  h2: '5',
  h3: '6',
  h4: 'subhead-large',
  h5: 'subhead-medium',
}

export function HeadingLink({
  tag,
  children,
  ...props
}: ComponentProps<'h2'> & {
  tag: `h${2 | 3 | 4 | 5 | 6}`
}): ReactElement {
  return (
    <Heading as={tag} size={headingSizeMap[tag]} {...props}>
      <NextLink href={`#${props.id}`} className={styles.Heading__anchor}>
        {children} <LinkIcon className={styles.Heading__anchorIcon} size={14} />
      </NextLink>
    </Heading>
  )
}
