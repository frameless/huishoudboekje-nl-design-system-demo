import {config} from "dotenv";
config();

export const isDev = process.env.NODE_ENV === "development";

export const getServiceUrl = (envName: string, defaultUrl: string) => {
	let url = process.env[envName];

	if (!url) {
		console.warn(`${envName} not set. Assuming it is running on ${defaultUrl}.`);
		url = defaultUrl;
	}

	return url;
};