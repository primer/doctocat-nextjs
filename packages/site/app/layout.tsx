import type {Metadata} from 'next'
import Theme, {getPageMap} from '@primer/doctocat-nextjs'

import type {FC, ReactNode} from 'react'
import '@primer/doctocat-nextjs/css/global.css'

const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'Example Site'

export const metadata: Metadata = {
  title: {
    absolute: '',
    template: `%s - ${siteTitle}`,
  },
}

type ThemeProps = Parameters<typeof Theme>[0]

const headerLinks: ThemeProps['headerLinks'] = [
  {
    href: 'https://github.com/primer/doctocat-nextjs',
    title: 'Doctocat',
    isActive: true,
  },
  {
    href: 'https://primer.style',
    title: 'Primer',
    isExternal: true,
  },
  {
    href: 'https://primer.style/octicons',
    title: 'Octicons',
    isExternal: true,
  },
]

const sidebarLinks: ThemeProps['sidebarLinks'] = []

const RootLayout: FC<{children: ReactNode}> = async ({children}) => {
  const pageMap = await getPageMap()
  return (
    <html
      lang="en"
      dir="ltr"
      // Hacks to suppress hydration errors. TODO: Remove this once we have a better solution.
      className="js-focus-visible"
      data-js-focus-visible=""
    >
      <body>
        <Theme pageMap={pageMap} headerLinks={headerLinks} sidebarLinks={sidebarLinks}>
          {children}
        </Theme>
      </body>
    </html>
  )
}

export default RootLayout
