/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFiles: ["<rootDir>/.jest/setEnvVars.ts"],
	setupFilesAfterEnv: ["<rootDir>/.jest/mockUnleashClient.ts"],
	collectCoverageFrom: [
		"src/**/*.{ts,js}",
	],
	reporters: [
		"default",
		"jest-junit",
	],
	coverageReporters: [
		"text",
		"cobertura",
	],
};