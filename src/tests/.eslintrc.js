module.exports = {
    parserOptions: {
        project: 'src/tests/tsconfig.json',
    },
    plugins: ['jest'],
    settings: {
        jest: {
            version: require('jest/package.json').version,
        },
    },
    extends: ['plugin:jest/all'],
    rules: {
        'jest/prefer-expect-assertions': 'off',
    },
};
