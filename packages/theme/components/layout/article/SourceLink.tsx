import {InlineLink, Stack, Text} from '@primer/react-brand'
import {BookIcon, MarkGithubIcon} from '@primer/octicons-react'
import React from 'react'

import styles from './SourceLink.module.css'

type SourceLinkProps = {
  type: 'github' | 'storybook' | 'figma'
  href: string
}

export function SourceLink({href, type}: SourceLinkProps) {
  return (
    <div className="custom-component">
      <Stack padding="none" direction="horizontal" alignItems="center" gap={4}>
        {type === 'github' ? <MarkGithubIcon className={styles.icon} /> : null}
        {type === 'storybook' ? <BookIcon className={styles.icon} /> : null}
        {type === 'figma' ? <FigmaLogo className={styles.icon} /> : null}

        {type === 'github' ? (
          <Text size="100">
            <InlineLink href={href} className={styles.link} target="_blank">
              GitHub
            </InlineLink>
          </Text>
        ) : null}
        {type === 'storybook' ? (
          <Text size="100">
            <InlineLink href={href} className={styles.link} target="_blank">
              Storybook
            </InlineLink>
          </Text>
        ) : null}
        {type === 'figma' ? (
          <Text size="100">
            <InlineLink href={href} className={styles.link} target="_blank">
              Figma
            </InlineLink>
          </Text>
        ) : null}
      </Stack>
    </div>
  )
}

function FigmaLogo({className}: {className?: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      aria-hidden="true"
      width={16}
      height={16}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.417 0A3.167 3.167 0 0 0 3.37 5.583 3.16 3.16 0 0 0 2.25 8a3.16 3.16 0 0 0 1.12 2.417 3.167 3.167 0 1 0 5.213 2.417V10.687a3.165 3.165 0 0 0 3.87-4.964A3.167 3.167 0 0 0 10.582 0H5.417Zm4.727 6.333h.21a1.665 1.665 0 1 1-.21 0Zm.25-1.5h.19a1.667 1.667 0 1 0 0-3.333H5.416a1.667 1.667 0 1 0 0 3.333h4.687a3.226 3.226 0 0 1 .29 0ZM3.75 8c0-.92.746-1.667 1.667-1.667h1.666v3.334H5.417C4.497 9.667 3.75 8.92 3.75 8Zm1.667 3.167a1.667 1.667 0 1 0 1.666 1.667v-1.667H5.417Z"
      />
    </svg>
  )
}
