import baseConfig from '../../eslint.config.js'
import nextPlugin from '@next/eslint-plugin-next'

export default [
  ...baseConfig,

  // Next.js specific rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'off',
    },
  },
]
