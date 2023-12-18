import React, {HTMLAttributes, PropsWithChildren} from 'react'
import styles from './SkipToMainContent.module.css'

type SkipToMainContentProps = {
  href: string
} & HTMLAttributes<HTMLAnchorElement>

export function SkipToMainContent({children, href, ...rest}: PropsWithChildren<SkipToMainContentProps>) {
  return (
    <a href={href} className={styles.SkipToMainContent} {...rest}>
      {children}
    </a>
  )
}
