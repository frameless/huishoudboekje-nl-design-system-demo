import {config} from "dotenv";

config();

export type AvailableServices = "huishoudboekje" | "organisaties" | "banktransacties";

const getServiceUrl = (envName: string, defaultUrl: string) => {
	let url = process.env[envName];

	if (!url) {
		console.warn(`${envName} not set. Assuming it is running on ${defaultUrl}.`);
		url = defaultUrl;
	}

	return url;
};

const services: Record<AvailableServices, string> = {
	huishoudboekje: getServiceUrl("HUISHOUDBOEKJESERVICE_URL", "http://localhost:8001"),
	organisaties: getServiceUrl("ORGANISATIESERVICE_URL", "http://localhost:8002"),
	banktransacties: getServiceUrl("BANKTRANSACTIESERVICE_URL", "http://localhost:8003"),
};

export const createServiceUrl = (serviceName: AvailableServices, endpoint: string) => {
	return services[serviceName] + endpoint;
};

export default services;