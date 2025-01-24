const base = require('../../.eslintrc.cjs')

module.exports = {
  ...base,
  plugins: ['react-hooks'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
}
