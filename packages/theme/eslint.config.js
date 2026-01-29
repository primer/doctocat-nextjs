import baseConfig from '../../eslint.config.js'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default [
  ...baseConfig,

  // React Hooks rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
