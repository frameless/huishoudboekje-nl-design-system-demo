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
	children: (data) => any
};

const Queryable: React.FC<QueryableProps> = ({query, loading, error, options = {}, children}) => {
	const {data: _data, loading: _loading, error: _error, previousData} = query;

	if (_loading) {
		if (!options.hidePreviousResults && previousData) {
			return children(previousData);
		}

		return loading !== false ? (loading || <Loading />) : null;
	}

	if (_error) {
		return error !== false ? (error || <QueryableError error={_error} query={query} />) : null;
	}

	return children(_data);
};

export default Queryable;