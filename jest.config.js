module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^factory-t$': '<rootDir>/src/index',
    },
    globals: {
        'ts-jest': {
            tsconfig: './src/tests/tsconfig.json',
        },
    },
    collectCoverageFrom: ['./src/*.ts', './src/**/*.ts'],
};
