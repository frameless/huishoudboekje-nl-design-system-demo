/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	clearMocks: true,
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