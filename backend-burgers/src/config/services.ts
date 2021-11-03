import dotenv from "dotenv";
dotenv.config();

const services = {
	burgers: process.env.BURGERSERVICE_URL,
};

export const createServiceUrl = (serviceName: string, endpoint: string) => {
	return services[serviceName] + endpoint;
};

export default services;