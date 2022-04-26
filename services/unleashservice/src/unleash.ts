import * as Unleash from "unleash-client";

const {UNLEASH_URL, UNLEASH_INSTANCEID, UNLEASH_APPNAME} = process.env;

if (!UNLEASH_URL) {
	throw new Error("Missing required environment variable: UNLEASH_URL");
}
if (!UNLEASH_INSTANCEID) {
	throw new Error("Missing required environment variable: UNLEASH_INSTANCEID");
}
if (!UNLEASH_APPNAME) {
	throw new Error("Missing required environment variable: UNLEASH_APPNAME");
}

const unleashClient = Unleash.initialize({
	url: process.env.UNLEASH_URL || "",
	instanceId: process.env.UNLEASH_INSTANCEID || "",
	appName: process.env.UNLEASH_APPNAME || "",
});

export default unleashClient;