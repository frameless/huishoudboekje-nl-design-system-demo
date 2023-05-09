import log, { LogLevelDesc } from "loglevel";
import app from "./src/app";

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
app.listen(port, () => {
	log.info(`Addresses service running on port ${port}.`);
});
