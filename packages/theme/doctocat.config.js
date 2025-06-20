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
  const finalConfig = {
    ...withNextra(),
    images: {
      unoptimized: true,
    },

    ...config,
  }

  // Enables basePath in next.config.js to be used inside Doctocat
  if (finalConfig.basePath) {
    process.env.NEXT_PUBLIC_DOCTOCAT_BASE_PATH = finalConfig.basePath
  }

  return finalConfig
}

export default withDoctocat
