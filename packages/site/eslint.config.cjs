// eslint-disable-next-line filenames/match-regex
const base = require('../../eslint.config.cjs')

module.exports = {
  ...base,
  extends: [...base.extends, 'next/core-web-vitals'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@next/next/no-img-element': 'off',
    'primer-react/no-system-props': 'off',
  },
}
