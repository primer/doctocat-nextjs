/** @type {import('next').NextConfig} */
import withDoctocat from '@primer/doctocat-nextjs/doctocat.config.js'

export default {
  ...withDoctocat({
    output: 'export',
    basePath: process.env.GITHUB_ACTIONS === 'true' && process.env.IS_PROD ? '/doctocat-nextjs' : '',
    publicRuntimeConfig: {
      siteTitle: 'Doctocat',
      repo: 'https://github.com/primer/doctocat-nextjs',
      repoSrcPath: 'packages/site',
      sidebarLinks: [
        {
          title: 'GitHub',
          href: 'https://github.com/primer/doctocat-nextjs',
        },
        {
          title: 'Primer',
          href: 'https://primer.style',
        },
      ],
    },
  }),
}
