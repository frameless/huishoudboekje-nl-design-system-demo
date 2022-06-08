import KcAdminClient from "@keycloak/keycloak-admin-client";
import getEnv from "./src/getenv";

// Check if all the required environment variables are set
const env = getEnv();
const {REALM_NAME, KEYCLOAK_BASE_URL} = env;

if (!REALM_NAME) {
	throw new Error("Environment variable REALM_NAME is missing.");
}
if (!KEYCLOAK_BASE_URL) {
	throw new Error("Environment variable KEYCLOAK_BASE_URL is missing.");
}

const getClient = async () => {
	// Initialize the Keycloak Admin Client
	const kc = new KcAdminClient({
		baseUrl: KEYCLOAK_BASE_URL,
		realmName: "master",
	});

	// Wait for Keycloak to be online
	while (true) {
		console.log("Waiting for Keycloak to startup...", KEYCLOAK_BASE_URL);

		const isKeycloakOnline = await new Promise(async resolve => {
			try {
				// Authorize as admin
				await kc.auth({
					username: "admin", // Todo: make this an envvar
					password: "CcEyf8Zut9kHyFRp_B9k@Fx3F_d6W4Ut", // Todo: make this an envvar
					grantType: "password",
					clientId: "admin-cli",
				});

				console.log("Keycloak is online!");
				resolve(true);
			}
			catch (err) {
				console.error(err);
				setTimeout(() => resolve(false), 2000);
			}
		});

		if (isKeycloakOnline) {
			break;
		}
	}

	return kc;
};

export default getClient;