module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: [
    'standard',
    'plugin:ava/recommended'
  ],
  plugins: [
    'ava'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'ava/no-skip-test': ['warn'],
    'array-bracket-spacing': ['off']
  }
}
