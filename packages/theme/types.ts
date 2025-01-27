import {Folder, MdxFile} from 'nextra'

export type ThemeConfig = {
  docsRepositoryBase: string
  sidebarLinks?: {
    title: string
    href: string
  }[]
}

export type FolderWithoutChildren = Omit<Folder, 'children'>

export type DocsItem = MdxFile & {
  title: string
  type: string
  children?: DocsItem[]
  firstChildRoute?: string
  withIndexPage?: boolean
  isUnderCurrentDocsTree?: boolean
}
