import {config} from "dotenv";
import * as Unleash from "unleash-client";

config();

const unleashClient = Unleash.initialize({
	url: process.env.UNLEASH_URL || "",
	instanceId: process.env.UNLEASH_INSTANCEID || "",
	appName: process.env.UNLEASH_APPNAME || "",
});

export default unleashClient;