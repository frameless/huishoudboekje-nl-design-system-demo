import d from "../dayjs";
import {QueryableProps} from "./Queryable";

export const generateErrorReport = (error: Error, query?: QueryableProps["query"], user?: any) => {
	return {
		graphqlQuery: {
			variables: query?.variables ?? null,
			previousData: query?.previousData ?? null,
			data: query?.data ?? null,
			error: {
				message: error.message,
				raw: error,
				stack: error.stack?.split("\n"),
			},
		},
		client: {
			time: {
				readable: d().format("LLLL"),
				raw: d().toJSON(),
			},
			location: window.location.toString(),
			userAgent: navigator.userAgent,
			display: [window.innerWidth, window.innerHeight].join("x"),
			user,
		},
	};
};