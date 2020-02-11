module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
      indent: ['error', 4]
  },
  plugins: [
      'mocha'
  ]
}
