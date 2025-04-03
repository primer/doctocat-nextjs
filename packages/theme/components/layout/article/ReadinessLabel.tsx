'use client'
import React from 'react'
import {Label} from '@primer/react'
import {CheckIcon} from '@primer/octicons-react'

import styles from './ReadinessLabel.module.css'

export function ReadinessLabel() {
  return (
    <Label size="large" className={styles.label}>
      <CheckIcon className={styles.icon} />
      Ready to use
    </Label>
  )
}
