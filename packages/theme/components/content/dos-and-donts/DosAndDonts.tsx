import React from 'react'
import {Box} from '@primer/react'
import clsx from 'clsx'
import styles from './DosAndDonts.module.css'

type DoDontContainerProps = {
  stacked?: boolean
}

export function DoDontContainer({stacked = false, children}: React.PropsWithChildren<DoDontContainerProps>) {
  return <div className={`${styles.container} ${stacked ? styles.stacked : ''}`}>{children}</div>
}
type DoDontProps = {
  indented?: boolean
}

export function Do({children, ...rest}: React.PropsWithChildren<DoDontProps>) {
  return (
    <DoDontBase title="Do" className={styles.doLabel} {...rest}>
      {children}
    </DoDontBase>
  )
}

export function Dont({children, ...rest}: React.PropsWithChildren<DoDontProps>) {
  return (
    <DoDontBase title="Don’t" className={styles.dontLabel} {...rest}>
      {children}
    </DoDontBase>
  )
}

type DoDontBaseProps = {
  title: string
  className?: string
  indented?: boolean
}

export function DoDontBase({children, title, indented, className, ...rest}: React.PropsWithChildren<DoDontBaseProps>) {
  return (
    <div className={clsx(`exclude-from-prose`, styles.doDontBase, className)} {...rest}>
      <Box
        className={styles.header}
        sx={{
          color: 'var(--fgColor-onEmphasis, var(--color-fg-on-emphasis))',
        }}
      >
        <span className={styles.headerText}>{title}</span>
      </Box>
      <div className={styles.content}>
        {indented ? (
          <blockquote className={styles.indentedContent} style={{borderLeftColor: 'var(--brand-color-border-default)'}}>
            {children}
          </blockquote>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
