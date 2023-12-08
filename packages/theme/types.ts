export type ThemeConfig = {
  docsRepositoryBase: string
  sidebarLinks: {
    title: string
    href: string
    leadingIcon?: 'repo' | 'org' | 'bookmark' | 'star' | 'img' | 'browser' | 'stack'
  }[]
}
