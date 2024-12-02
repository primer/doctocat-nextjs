import React from 'react'
import type {ComponentProps, ReactElement} from 'react'
import {clsx} from 'clsx'
import type {Components} from 'nextra/mdx'

import {LinkIcon} from '@primer/octicons-react'
import NextLink from 'next/link'

import styles from './mdx-components.module.css'

// Anchor links for Headings
function HeadingLink({
  tag: Tag,
  context,
  children,
  id,
  className,
  ...props
}: ComponentProps<'h2'> & {
  tag: `h${2 | 3 | 4 | 5 | 6}`
  context: {index: number}
}): ReactElement {
  return (
    <Tag {...props} id={id} className={clsx(className)}>
      <NextLink href={`#${id}`} className={styles.Heading__anchor}>
        {children} <LinkIcon className={styles.Heading__anchorIcon} size={16} />
      </NextLink>
    </Tag>
  )
}

export const Link = ({href = '', className, ...props}) => <NextLink href={href} {...props} />
export const getComponents = (): Components => {
  const context = {index: 0}
  return {
    h2: props => <HeadingLink tag="h2" context={context} {...props} />,
    h3: props => <HeadingLink tag="h3" context={context} {...props} />,
    h4: props => <HeadingLink tag="h4" context={context} {...props} />,
    h5: props => <HeadingLink tag="h5" context={context} {...props} />,
    h6: props => <HeadingLink tag="h6" context={context} {...props} />,
    a: Link,
  }
}
