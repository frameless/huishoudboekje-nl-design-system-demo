import log from "loglevel";

export const getConfig = () => {
	const {
		NODE_ENV,
		JWT_SECRET,
		JWT_ISSUER,
		JWT_AUDIENCE,
		JWT_EXPIRES_IN = "14d",
		APP_PORT = 8080,

		OIDC_BASE_URL,
		OIDC_CLIENT_ID,
		OIDC_CLIENT_SECRET,
		OIDC_ISSUER_URL,
	} = process.env;

	let missingEnvvarsError = false;
	if (!process.env.JWT_SECRET) {
		missingEnvvarsError = true;
		log.error("ERROR: Missing environment variable JWT_SECRET");
	}
	if (!process.env.JWT_AUDIENCE) {
		missingEnvvarsError = true;
		log.error("ERROR: Missing environment variable JWT_AUDIENCE");
	}
	if (!process.env.JWT_ISSUER) {
		missingEnvvarsError = true;
		log.error("ERROR: Missing environment variable JWT_ISSUER");
	}
	if (!process.env.OIDC_BASE_URL) {
		missingEnvvarsError = true;
		log.error("ERROR: Missing environment variable OIDC_BASE_URL");
	}
	if (!process.env.OIDC_CLIENT_ID) {
		missingEnvvarsError = true;
		log.error("ERROR: Missing environment variable OIDC_CLIENT_ID");
	}
	if (!process.env.OIDC_CLIENT_SECRET) {
		missingEnvvarsError = true;
		log.error("ERROR: Missing environment variable OIDC_CLIENT_SECRET");
	}
	if (!process.env.OIDC_ISSUER_URL) {
		missingEnvvarsError = true;
		log.error("ERROR: Missing environment variable OIDC_ISSUER_URL");
	}

	if (missingEnvvarsError) {
		throw new Error("Failed to start service: missing configuration.");
	}

	return {
		secret: JWT_SECRET,
		issuer: JWT_ISSUER,
		audience: JWT_AUDIENCE,
		expiresIn: JWT_EXPIRES_IN,
		port: APP_PORT,
		debug: NODE_ENV !== "production",
	};
};
