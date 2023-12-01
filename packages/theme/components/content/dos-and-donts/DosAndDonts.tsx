import React from 'react'
import {Box, Text} from '@primer/react'

type DoDontContainerProps = {
  stacked?: boolean
}

export function DoDontContainer({stacked = false, children}: React.PropsWithChildren<DoDontContainerProps>) {
  return (
    <Box sx={{display: 'grid', gridTemplateColumns: ['1fr', null, stacked ? '1fr' : '1fr 1fr'], gridGap: 4, mb: 6}}>
      {children}
    </Box>
  )
}

type DoDontProps = {
  indented?: boolean
}

export function Do({children, ...rest}: React.PropsWithChildren<DoDontProps>) {
  return (
    <DoDontBase title="Do" bg="success.fg" borderColor="success.muted" {...rest}>
      {children}
    </DoDontBase>
  )
}

export function Dont({children, ...rest}: React.PropsWithChildren<DoDontProps>) {
  return (
    <DoDontBase title="Don’t" bg="danger.fg" borderColor="danger.muted" {...rest}>
      {children}
    </DoDontBase>
  )
}

type DoDontBaseProps = {
  title: string
  bg: string
  borderColor: string
  indented?: boolean
}

export function DoDontBase({children, title, bg, borderColor, indented}: React.PropsWithChildren<DoDontBaseProps>) {
  return (
    <Box className="exclude-from-prose" sx={{display: 'flex', flexDirection: 'column'}}>
      <Box
        sx={{
          display: 'flex',
          alignSelf: 'start',
          flexDirection: 'row',
          alignItems: 'center',
          mb: '2',
          backgroundColor: bg,
          borderRadius: '2',
          color: 'fg.onEmphasis',
          paddingX: '2',
        }}
      >
        <Text sx={{fontWeight: 'bold', fontSize: '1', color: 'fg.onEmphasis'}}>{title}</Text>
      </Box>
      <Box
        sx={{
          '& *:last-child': {mb: 0},
          ' img': {maxWidth: '100%', marginBlockEnd: 0},
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {indented ? (
          <Box
            as="blockquote"
            sx={{
              margin: '0',
              borderLeftWidth: '4px',
              borderLeftStyle: 'solid',
              borderLeftColor: borderColor,
              paddingLeft: '3',
            }}
          >
            {children}
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  )
}
