import React from 'react'
import {Box} from '@primer/react'
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
    <DoDontBase title="Do" bg="success.fg" borderColor="success.muted" {...rest}>
      {children}
    </DoDontBase>
  )
}

export function Dont({children, ...rest}: React.PropsWithChildren<DoDontProps>) {
  return (
    <DoDontBase title="Don’t" bg="danger.fg" borderColor="danger.muted" {...rest}>
      {children}
    </DoDontBase>
  )
}

type DoDontBaseProps = {
  title: string
  bg: string
  borderColor: string
  indented?: boolean
}

export function DoDontBase({children, title, bg, borderColor, indented}: React.PropsWithChildren<DoDontBaseProps>) {
  return (
    <div className={`exclude-from-prose ${styles.doDontBase}`}>
      <Box
        className={styles.header}
        sx={{
          backgroundColor: bg,
          color: 'var(--fgColor-onEmphasis, var(--color-fg-on-emphasis))',
        }}
      >
        <span className={styles.headerText}>{title}</span>
      </Box>
      <div className={styles.content}>
        {indented ? (
          <blockquote className={styles.indentedContent} style={{borderLeftColor: borderColor}}>
            {children}
          </blockquote>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
