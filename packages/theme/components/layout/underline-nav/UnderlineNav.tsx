import React from 'react'
import {UnderlineNav as PrimerUnderlineNav} from '@primer/react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {MdxFile} from 'nextra'

type UnderlineNavProps = {
  tabData: MdxFile[]
}

export function UnderlineNav({tabData}: UnderlineNavProps) {
  const router = useRouter()
  const currentRoute = router.pathname

  // Reorders tabData so the tab with name === index is always first
  if (tabData.length > 1) {
    const index = tabData.findIndex(item => item.name === 'index')
    if (index > -1) {
      const indexTab = tabData.splice(index, 1)
      tabData.push(indexTab[0])
    }
  }

  return (
    <PrimerUnderlineNav aria-label="Sibling pages">
      {tabData.length > 1 &&
        tabData.reverse().map(item => {
          return (
            <PrimerUnderlineNav.Item
              as={Link}
              key={item.name}
              href={`${item.route}`}
              aria-current={currentRoute === item.route ? 'page' : undefined}
            >
              {(item.frontMatter && item.frontMatter.title) || item.name}
            </PrimerUnderlineNav.Item>
          )
        })}
    </PrimerUnderlineNav>
  )
}
