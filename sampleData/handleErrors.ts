import {ApolloError} from "@apollo/client/core";

const displayErrors = process.env.NODE_ENV === "development" || process.env.DISPLAY_ERRORS === "1"

export const handleErrors = (err: ApolloError) => {
	const networkErrors = err?.networkError?.["result"]?.flatMap(errs => errs.errors.map(e => e.message));
	const graphQlErrors = err?.graphQLErrors?.flatMap(errs => errs.message);

	if (networkErrors) {
		console.error("Network error(s): ", networkErrors);
	}
	else if (graphQlErrors && graphQlErrors.length > 0) {
		console.error("GraphQL error(s): ", graphQlErrors);
	}
	else {
		console.error("Error: ", displayErrors ? err : err.message);
	}
};