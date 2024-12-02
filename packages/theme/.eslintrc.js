const base = require('../../.eslintrc')

module.exports = {
  ...base,
  plugins: ['react-hooks'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
}
