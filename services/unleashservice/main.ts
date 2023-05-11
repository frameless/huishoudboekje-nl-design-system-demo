import log, { LogLevelDesc } from "loglevel";
import app from "./src/app";
import unleashClient from "./src/unleash";

const port = process.env.PORT || 8080;
const LOG_LEVEL = process.env.LOG_LEVEL;

try {
	if (LOG_LEVEL != undefined){
		const logAsNumber = Number(LOG_LEVEL)
		if(!Number.isNaN(logAsNumber)){
			log.setDefaultLevel(logAsNumber as LogLevelDesc)
		} else {
			log.setDefaultLevel(LOG_LEVEL.toUpperCase() as LogLevelDesc)
		}
	}
} catch{
	log.setDefaultLevel("warn")
	log.warn("Using default log level (warn)")
}

unleashClient.on("synchronized", () => {

	app().listen(port, () => {
		log.info(`Unleash server running on port ${port}. OTAP-setting is ${process.env.UNLEASH_OTAP || "not set"}.`);
	});

});