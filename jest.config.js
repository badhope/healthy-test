export default {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js'],
    transform: {},
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'js/**/*.js',
        '!js/data/**',
        '!js/modules/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    }
};
