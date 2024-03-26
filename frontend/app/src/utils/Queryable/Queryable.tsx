/* eslint-disable @typescript-eslint/no-explicit-any */
import {LazyQueryResult, QueryResult} from "@apollo/client/react/types/types";
import React from "react";
import Loading from "./Loading";
import QueryableError from "./QueryableError";

export type QueryableProps = {
	query: QueryResult | LazyQueryResult<any, any>,
	loading?: JSX.Element | null | boolean,
	error?: JSX.Element | null | boolean,
	options?: {
		hidePreviousResults?: boolean
	},
	children: (data) => JSX.Element | null
};

const Queryable: React.FC<QueryableProps> = ({query, loading = true, error = true, options = {}, children}) => {
	const {data: _data, loading: _loading, error: _error, previousData} = query;

	if (_loading) {
		if (!options.hidePreviousResults && previousData) {
			return children(previousData);
		}

		if (loading === false) {
			return null;
		}

		return loading === true ? <Loading /> : loading;
	}

	if(_error){
		if(error === false){
			return null;
		}

		return error === true && _error.graphQLErrors.every(error => error.extensions.code != "UNAUTHENTICATED") ? <QueryableError error={_error} query={query} /> : error;
	}

	return children(_data);
};

export default Queryable;
