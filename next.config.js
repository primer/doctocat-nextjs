const withNextra = require('nextra')({
  theme: './@primer-nextocat', // eventually change this to the published theme package
  themeConfig: './theme.config.tsx',
  output: 'export',
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
};
