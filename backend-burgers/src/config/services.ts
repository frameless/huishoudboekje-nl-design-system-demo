import {config} from "dotenv";
config();

const getHuishoudboekjeserviceUrl = () => {
	const defaultUrl = "http://localhost:8000";
	let url = process.env.HUISHOUDBOEKJESERVICE_URL;
	if (!url) {
		console.warn(`HUISHOUDBOEKJESERVICE_URL not set. Assuming Huishoudboekjeservice it is running on ${defaultUrl}.`);
		url = defaultUrl;
	}

	return url;
};

const services = {
	burgers: getHuishoudboekjeserviceUrl(),
};

export const createServiceUrl = (serviceName: string, endpoint: string) => {
	return services[serviceName] + endpoint;
};

export default services;