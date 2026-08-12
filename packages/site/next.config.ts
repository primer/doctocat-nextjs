/** @type {import('next').NextConfig} */
import withDoctocat from '@primer/doctocat-nextjs/doctocat.config.js'

const basePath =
  process.env.NEXT_PUBLIC_DOCTOCAT_BASE_PATH ??
  (process.env.GITHUB_ACTIONS === 'true' && process.env.IS_PROD ? '/doctocat-nextjs' : '')

export default {
  ...withDoctocat({
    transpilePackages: ['@primer/doctocat-nextjs'],
    output: 'export',
    basePath,
  }),
}
