const merge = require('@nikifilini/codestyle/tools')

module.exports = merge(require('@nikifilini/codestyle/configs/eslint/node'), {
  // plugins: ['node'],
  // settings: {
  //   'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  //   'import/parsers': {
  //     '@typescript-eslint/parser': ['.ts', '.tsx'],
  //   },
  //   'import/resolver': {
  //     node: {
  //       extensions: ['.js', '.jsx', '.ts', '.tsx'],
  //     },
  //   },
  // },
  // rules: {
  //   'node/file-extension-in-import': [
  //     'error',
  //     'ignorePackages',
  //     {
  //       js: 'never',
  //       jsx: 'never',
  //       ts: 'never',
  //       tsx: 'never',
  //     },
  //   ],
  // },
})
