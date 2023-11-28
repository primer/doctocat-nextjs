'use client'
import React from 'react'
import {NavList} from '@primer/react'
import {Folder, MdxFile, PageMapItem} from 'nextra'
import {useRouter} from 'next/router'
import {Item} from 'nextra/normalize-pages'

type SidebarProps = {
  pageMap: DocsItem[]
  activePath: Item[]
}

type FolderWithoutChildren = Omit<Folder, 'children'>

type DocsItem = (MdxFile | FolderWithoutChildren) & {
  title: string
  type: string
  children?: DocsItem[]
  firstChildRoute?: string
  withIndexPage?: boolean
  isUnderCurrentDocsTree?: boolean
}

export function Sidebar({pageMap, activePath}: SidebarProps) {
  const router = useRouter()
  const basePath = router.basePath
  const currentRoute = router.pathname

  return (
    <NavList>
      {pageMap.map(item => {
        if (item.kind === 'MdxPage' && item.route === '/') return null

        if (item.kind === 'MdxPage') {
          return (
            <NavList.Item
              key={item.name}
              href={`${basePath}${item.route}`}
              sx={{textTransform: 'capitalize'}}
              aria-current={currentRoute === item.route ? 'page' : undefined}
            >
              {item.frontMatter.title || item.name}
            </NavList.Item>
          )
        }
        if (item.kind === 'Folder') {
          const indexPage = item.children.find(child => child.kind === 'MdxPage' && child.name === 'index') as MdxFile
          const subNavName = indexPage.frontMatter.title

          return (
            <NavList.Group title={subNavName} key={item.name}>
              {item.children
                .sort((a, b) => (a.name === 'index' ? -1 : b.name === 'index' ? 1 : 0)) // puts index page first
                .map((child: DocsItem) => {
                  if ((child as MdxFile).kind === 'MdxPage') {
                    return (
                      <NavList.Item
                        key={child.name}
                        href={`${basePath}${child.route}`}
                        sx={{textTransform: 'capitalize'}}
                      >
                        {(child as MdxFile).frontMatter?.title || item.name}
                      </NavList.Item>
                    )
                  }

                  if ((child as Folder).kind === 'Folder') {
                    const landingPageItem: PageMapItem | undefined = (child as Folder).children.find(
                      innerChild => innerChild.kind === 'MdxPage' && innerChild.name === 'index',
                    )

                    return (
                      <NavList.Item
                        key={(landingPageItem as MdxFile).name}
                        href={`${basePath}${(landingPageItem as MdxFile).route}`}
                        sx={{textTransform: 'capitalize'}}
                      >
                        {(landingPageItem as MdxFile).frontMatter?.title || item.name}
                      </NavList.Item>
                    )
                  }

                  return null
                })}
            </NavList.Group>
          )
        }
        return null
      })}
    </NavList>
  )
}
