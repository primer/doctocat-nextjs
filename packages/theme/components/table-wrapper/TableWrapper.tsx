import React, {PropsWithChildren} from 'react'
import styles from './TableWrapper.module.css'

export function TableWrapper({children}: PropsWithChildren<HTMLTableElement>) {
  return <div className={styles.wrapper}>{children}</div>
}
