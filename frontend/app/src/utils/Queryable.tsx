import {LazyQueryResult, QueryResult} from "@apollo/client/react/types/types";
import {Box, Spinner, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";

const Loading = () => (
	<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
		<Spinner />
	</Stack>
);

type QueryableProps = {
	query: QueryResult | LazyQueryResult<any, any>,
	loading?,
	error?,
	options?: {
		hidePreviousResults?: boolean
	},
	children
};

const Queryable: React.FC<QueryableProps> = ({query, loading, error, options = {}, children}) => {
	const {t} = useTranslation();
	const {data: _data, loading: _loading, error: _error, previousData} = query;

	if (_loading) {
		if(!options.hidePreviousResults && previousData){
			return children(previousData);
		}

		return loading || <Loading />;
	}

	if (_error) {
		return error || <Box>{t("messages.genericError.description")}</Box>;
	}

	return children(_data);
};

export default Queryable;