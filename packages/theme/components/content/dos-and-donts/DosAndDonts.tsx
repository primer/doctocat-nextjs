import React from 'react'
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
      <div className={styles.header}>
        <span className={styles.headerText}>{title}</span>
      </div>
      <div className={styles.content}>
        {indented ? (
          <blockquote className={styles.indentedContent}>
            {children}
          </blockquote>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
