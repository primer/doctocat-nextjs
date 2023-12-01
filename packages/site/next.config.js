const withNextocat = require('@primer/nextocat/nextocat.config.js')

module.exports = {
  ...withNextocat({
    output: 'export',
    basePath: process.env.GITHUB_ACTIONS === 'true' ? '/nextocat' : '',
    publicRuntimeConfig: {
      siteTitle: 'Primer Nextocat',
      repo: 'https://github.com/primer/nextocat',
      repoSrcPath: 'packages/site', // folder path to your site root. Helpful for monorepos.
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
