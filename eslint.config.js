const eslint = require('@eslint/js');
const jestPlugin = require('eslint-plugin-jest');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    {
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            'no-console': 'error',
            'no-debugger': 'error',
        },
    },
    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
        },
    },
    {
        files: ['**/*.test.ts'],
        ...jestPlugin.configs['flat/all'],
        rules: {
            ...jestPlugin.configs['flat/all'].rules,
            'jest/prefer-expect-assertions': 'off',
            'jest/padding-around-all': 'off',
            'jest/padding-around-expect-groups': 'off',
            'jest/padding-around-test-blocks': 'off',
        },
    },
);
