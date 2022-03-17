import {LazyQueryResult, QueryResult} from "@apollo/client/react/types/types";
import React from "react";

const Loading = () => <div>Loading...</div>;

type QueryableProps = {
	query: QueryResult | LazyQueryResult<any, any>;
	loading?: any;
	error?: any;
	options?: {
		hidePreviousResults?: boolean;
	};
	render: any;
};

const Queryable: React.FC<QueryableProps> = ({query, loading, error, options, render}) => {
	const {data: _data, loading: _loading, error: _error, previousData} = query;
	const _options = {...options};

	if (_loading) {
		if (!_options.hidePreviousResults && previousData) {
			return render(previousData);
		}

		return loading || <Loading />;
	}

	if (_error) {
		return error || "An error occurred.";
	}

	return render(_data);
};

export default Queryable;