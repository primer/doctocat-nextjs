import React from 'react'

export type HighlightSearchTermProps = {
  children: React.ReactNode
  searchTerm: string
}

export const HighlightSearchTerm = ({children, searchTerm}: HighlightSearchTermProps) => {
  if (!children || !searchTerm) {
    return <>{children}</>
  }

  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\<>]/g, '\\$&')

  const parts = children.toString().split(new RegExp(`(${escapedSearchTerm})`, 'gi'))

  return (
    <>
      {parts.map((part, i) => (part.toLowerCase() === searchTerm.toLowerCase() ? <mark key={i}>{part}</mark> : part))}
    </>
  )
}
