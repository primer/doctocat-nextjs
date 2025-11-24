import React, {PropsWithChildren} from 'react'
import styles from './Caption.module.css'

export function Caption(props: PropsWithChildren) {
  const {children, ...rest} = props
  return (
    <span className={styles.Caption} {...rest}>
      {children}
    </span>
  )
}
