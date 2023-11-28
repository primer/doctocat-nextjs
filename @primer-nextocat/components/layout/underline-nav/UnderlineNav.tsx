import {MdxFile} from 'nextra'
import {UnderlineNav as PrimerUnderlineNav} from '@primer/react'
import {useRouter} from 'next/router'
import Link from 'next/link'

type UnderlineNavProps = {
  tabData: MdxFile[]
}

export function UnderlineNav({tabData}: UnderlineNavProps) {
  const router = useRouter()
  const basePath = router.basePath
  const currentRoute = router.pathname

  // Reorders tabData so the tab with name === index is always first
  if (tabData && tabData.length > 1) {
    const index = tabData.findIndex(item => item.name === 'index')
    if (index > -1) {
      const indexTab = tabData.splice(index, 1)
      tabData.push(indexTab[0])
    }
  }

  return (
    <PrimerUnderlineNav aria-label="Sibling pages">
      {tabData &&
        tabData.length > 1 &&
        tabData.reverse().map(item => {
          if (item.kind === 'MdxPage') {
            return (
              <PrimerUnderlineNav.Item
                as={Link}
                key={item.name}
                href={`${basePath}${item.route}`}
                aria-current={currentRoute === item.route ? 'page' : undefined}
              >
                {item.frontMatter.title || item.name}
              </PrimerUnderlineNav.Item>
            )
          }
          return null
        })}
    </PrimerUnderlineNav>
  )
}
