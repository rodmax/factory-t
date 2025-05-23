module.exports = {
    printWidth: 100,
    tabWidth: 4,
    singleQuote: true,
    quoteProps: 'as-needed',
    trailingComma: 'all',
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'always',
    overrides: [
        {
            files: ['package*json', '*.yaml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
