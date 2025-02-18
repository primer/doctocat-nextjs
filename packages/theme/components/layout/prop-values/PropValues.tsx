'use client'
import React from 'react'

type PropTableValuesProps = {
  values: (string | number)[]
  addLineBreaks?: boolean
  commaSeparated?: boolean
  removeApostrophes?: boolean
}

export function PropTableValues({values, addLineBreaks, commaSeparated, removeApostrophes}: PropTableValuesProps) {
  const valuesToRender = values.map(value => {
    if (typeof value === 'string' && !removeApostrophes) {
      return (
        <span key={value}>
          <code>&apos;{value}&apos;</code>
        </span>
      )
    }
    return (
      <span key={value}>
        <code> {value}</code>
      </span>
    )
  })

  if (commaSeparated) {
    return (
      <>
        {valuesToRender.reduce((acc, curr, index) => (
          <React.Fragment key={index}>
            {acc}
            {index > 0 && ', '}
            {curr}
          </React.Fragment>
        ))}
        {addLineBreaks && <br />}
      </>
    )
  }

  return (
    <>
      {valuesToRender.map(value => {
        return (
          <React.Fragment key={value.key}>
            {value}
            {addLineBreaks && <br />}
          </React.Fragment>
        )
      })}
    </>
  )
}
