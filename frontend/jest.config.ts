import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^uuid$": "<rootDir>/test/mocks/uuid.js",
  },
};

export default config;
