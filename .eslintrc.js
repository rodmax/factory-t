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
    plugins: ['@typescript-eslint', 'jest'],
    extends: ['plugin:jest/all'],
    rules: {
        'jest/prefer-expect-assertions': 'off',
        'no-console': 'error',
        'no-debugger': 'error',
    },
};
