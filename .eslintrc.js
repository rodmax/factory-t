// @ts-check

/**
 * @typedef { import('eslint').Linter.Config } EslintConfig
 * @type { EslintConfig }
 */
module.exports = {
    root: true,
    env: {
        es6: true,
        es2017: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            modules: true,
        },
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'no-console': 'error',
        'no-debugger': 'error',
    },
};
