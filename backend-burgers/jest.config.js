/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		"\\.(ts|js)$": ["ts-jest"],
	},
	collectCoverageFrom: [
		"src/**/*.{ts,js}",
	],
	reporters: [
		"default",
		"jest-junit",
	],
	"coverageReporters": [
		"text",
		"cobertura",
	],
};