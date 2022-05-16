/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	clearMocks: true,
	setupFilesAfterEnv: ["<rootDir>/.jest/mockClient.ts"],
	collectCoverageFrom: [
		"src/**/*.{ts,js}",
		"prisma/**/*.{ts,js}",
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