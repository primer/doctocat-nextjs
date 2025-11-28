'use client'
import {Token} from '@primer/react'
import {AccessibilityInsetIcon} from '@primer/octicons-react'
import React from 'react'

import styles from './AccessibilityLabel.module.css'

type AccessibilityLabelProps = {
  short?: boolean
}

export function AccessibilityLabel({short}: AccessibilityLabelProps) {
  return (
    <Token
      as="span"
      size="large"
      className={styles.reviewedLabel}
      leadingVisual={() => <AccessibilityInsetIcon className={styles.icon} aria-hidden="true" />}
      text={short ? 'Reviewed' : 'Reviewed for accessibility'}
    />
  )
}
