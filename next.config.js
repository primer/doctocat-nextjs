const withNextra = require('nextra')({
  theme: './@primer-nextocat', // eventually change this to the published theme package
  themeConfig: './theme.config.tsx',
  staticImage: true,
  images: {
    unoptimized: true,
  },
})

module.exports = {
  ...withNextra(),
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS === 'true' ? '/nextocat' : '',
}
