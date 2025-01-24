const base = require('../../eslint.config.cjs')

module.exports = {
  ...base,
  plugins: ['react-hooks'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
}
