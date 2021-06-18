import {ApolloError} from "@apollo/client/core";

export const handleErrors = (err: ApolloError) => {
	console.log("Error(s): ", err.networkError?.["result"].flatMap(errs => errs.errors.map(e => e.message)) || err.graphQLErrors.flatMap(errs => errs.message));
};