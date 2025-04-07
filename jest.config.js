module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^factory-t$': '<rootDir>/src/index',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                babel: true,
                tsconfig: './src/tests/tsconfig.json',
            },
        ],
    },
    collectCoverageFrom: ['./src/*.ts', './src/**/*.ts'],
};
