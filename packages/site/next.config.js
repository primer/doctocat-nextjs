const withNextocat = require('@primer/nextocat/nextocat.config.js')

module.exports = {
  ...withNextocat({
    output: 'export',
    basePath: process.env.GITHUB_ACTIONS === 'true' ? '/nextocat' : '',
    publicRuntimeConfig: {
      siteTitle: 'Primer Nextocat',
      docsRepositoryBase: 'https://github.com/primer/nextocat',
      sidebarLinks: [
        {
          title: 'GitHub',
          href: 'https://github.com/primer/nextocat',
          leadingIcon: 'repo',
        },
        {
          title: 'Primer',
          href: 'https://primer.style',
          leadingIcon: 'org',
        },
      ],
    },
  }),
}
