const withNextra = require('nextra')({
  theme: '@primer/nextocat',
  staticImage: true,
})

const withTM = require('next-transpile-modules')(['@primer/nextocat'])

/*
 * Wrapper for next config, that allows us to do some shared configuration
 * Provides a default config, but allows overriding it
 * Uses next-transpile-modules to allow Next.js webpack to transpile the theme
 */
function withNextocat(config = {}) {
  return withTM({
    ...withNextra(),
    images: {
      unoptimized: true,
    },
    publicRuntimeConfig: {
      siteTitle: config.publicRuntimeConfig.siteTitle || 'Primer Nextocat', // to add a custom site title
    },
    ...config,
  })
}

module.exports = withNextocat
