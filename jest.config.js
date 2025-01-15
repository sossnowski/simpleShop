/** @type {import('ts-jest').JestConfigWithTsJest} **/
require('dotenv').config({ path: '.env.test' });
module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  // rootDir: 'src',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    '^commands/(.*)$': '<rootDir>/src/commands/$1',
    '^config/(.*)$': '<rootDir>/src/config/$1',
    '^middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^models/(.*)$': '<rootDir>/src/models/$1',
    '^queries/(.*)$': '<rootDir>/src/queries/$1',
    '^repository/(.*)$': '<rootDir>/src/repository/$1',
    '^routes/(.*)$': '<rootDir>/src/routes/$1',
    '^routes$': '<rootDir>/src/routes',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^utils$': '<rootDir>/src/utils',
    '^validation/(.*)$': '<rootDir>/src/validation/$1',
  },
};