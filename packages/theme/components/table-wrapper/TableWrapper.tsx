import React, {PropsWithChildren} from 'react'
import styles from './TableWrapper.module.css'

export function TableWrapper({children}: PropsWithChildren) {
  return <div className={styles.wrapper}>{children}</div>
}
