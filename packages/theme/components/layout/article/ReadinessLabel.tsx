'use client'
import React from 'react'
import {Token} from '@primer/react'
import {CheckIcon} from '@primer/octicons-react'

import styles from './ReadinessLabel.module.css'

export function ReadinessLabel() {
  return (
    <Token
      as="span"
      size="large"
      className={styles.label}
      leadingVisual={() => <CheckIcon className={styles.icon} aria-hidden="true" />}
      text="Ready to use"
    />
  )
}
