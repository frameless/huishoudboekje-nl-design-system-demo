import app from "src/app";
import unleashClient from "./src/unleash";

const port = process.env.PORT || 8080;

unleashClient.on("synchronized", () => {

	app.listen(port, () => {
		console.log(`Unleash server running on port ${port}. OTAP-setting is ${process.env.UNLEASH_OTAP || "not set"}.`);
	});

});