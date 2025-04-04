import React, {PropsWithChildren} from 'react'

import styles from './Note.module.css'

type NoteProps = {
  variant?: 'info' | 'warning'
} & PropsWithChildren

export function Note({children, variant = 'info'}: NoteProps) {
  return <div className={`${styles.Note} ${styles[`Note--${variant}`]}`}>{children}</div>
}
