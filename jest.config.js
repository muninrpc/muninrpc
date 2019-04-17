module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/grpc-server/'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};
