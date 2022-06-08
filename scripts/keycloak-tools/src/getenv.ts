import dotenv from "dotenv";
dotenv.config();

const getEnv = (): NodeJS.ProcessEnv => {
	return process.env;
}

export default getEnv;