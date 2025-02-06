import nextra from 'nextra'

const withNextra = nextra({
  staticImage: true,
})

/*
 * Wrapper for next config, that allows us to do some shared configuration
 * Provides a default config, but allows overriding it
 * Relies on `transpilePackages: ['@primer/doctocat-nextjs'],` being set in the next.config
 */
function withDoctocat(config = {}) {
  return {
    ...withNextra(),
    images: {
      unoptimized: true,
    },

    ...config,
  }
}

export default withDoctocat
