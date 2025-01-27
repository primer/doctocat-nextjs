import nextra from 'nextra'
import transpiler from 'next-transpile-modules'

const withNextra = nextra({
  theme: '@primer/doctocat-nextjs',
  staticImage: true,
})

const withTM = transpiler(['@primer/doctocat-nextjs'])

/*
 * Wrapper for next config, that allows us to do some shared configuration
 * Provides a default config, but allows overriding it
 * Uses next-transpile-modules to allow Next.js webpack to transpile the theme
 */
function withDoctocat(config = {}) {
  return withTM({
    ...withNextra(),
    images: {
      unoptimized: true,
    },
    publicRuntimeConfig: {
      siteTitle: config.publicRuntimeConfig.siteTitle || 'Doctocat', // to add a custom site title
    },
    ...config,
  })
}

export default withDoctocat
