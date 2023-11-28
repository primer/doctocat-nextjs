'use client'
import React from 'react'
import {NavList} from '@primer/react'
import {Folder, MdxFile, PageMapItem} from 'nextra'
import {useRouter} from 'next/router'
import {Item} from 'nextra/normalize-pages'

type SidebarProps = {
  pageMap: PageMapItem[]
  activePath: Item[]
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
            <NavList.Item
              key={item.name}
              href={`${basePath}${item.route}`}
              sx={{textTransform: 'capitalize', fontSize: 1}}
              defaultOpen
            >
              {subNavName}
              <NavList.SubNav key={item.name}>
                {item.children.map((child: MdxFile | Folder) => {
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
                    const landingPlaceItem: PageMapItem | undefined = (child as Folder).children.find(
                      innerChild => innerChild.kind === 'MdxPage' && innerChild.name === 'index',
                    )

                    return (
                      <NavList.Item
                        key={(landingPlaceItem as MdxFile).name}
                        href={`${basePath}${(landingPlaceItem as MdxFile).route}`}
                        sx={{textTransform: 'capitalize'}}
                      >
                        {(landingPlaceItem as MdxFile).frontMatter?.title || item.name}
                      </NavList.Item>
                    )
                  }

                  return null
                })}
              </NavList.SubNav>
            </NavList.Item>
          )
        }
        return null
      })}
    </NavList>
  )
}
