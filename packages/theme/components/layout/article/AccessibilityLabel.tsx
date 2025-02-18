'use client'
import {Label} from '@primer/react'
import {AccessibilityInsetIcon} from '@primer/octicons-react'
import React from 'react'

import styles from './AccessibilityLabel.module.css'

type AccessibilityLabelProps = {
  short?: boolean
}

export function AccessibilityLabel({short}: AccessibilityLabelProps) {
  return (
    <Label size="large" className={styles.reviewedLabel}>
      <AccessibilityInsetIcon className={styles.icon} />
      {short ? 'Reviewed' : 'Reviewed for accessibility'}
    </Label>
  )
}
