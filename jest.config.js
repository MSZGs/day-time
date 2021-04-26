export default {
  collectCoverage: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.ts"],
  resolver: "jest-ts-webcompat-resolver",
};
