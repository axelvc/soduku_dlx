module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    semi: ['error', 'never'],
    'no-param-reassign': 'off',
    'operator-linebreak': 'off',
    'no-console': 'off',
    'generator-star-spacing': 'off',
  },
}
