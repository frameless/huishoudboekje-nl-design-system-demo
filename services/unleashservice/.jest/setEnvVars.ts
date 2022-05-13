process.env.UNLEASH_URL = "https://gitlab.com/api/v4/feature_flags/unleash/20352213";
process.env.UNLEASH_INSTANCEID = "JbZyPux6M7xwejsESy9L";
process.env.UNLEASH_APPNAME = "huishoudboekje";
process.env.UNLEASH_OTAP = "development";

/* Disable console messages */
console = {
	...console,
	table: jest.fn(),
	info: jest.fn(),
};