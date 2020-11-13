import React from "react";
import {Box, Spinner, Stack} from "@chakra-ui/core";

const Loading = () => (
	<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
		<Spinner />
	</Stack>
);

const Queryable: React.FC<{ query, loading?, error?, children }> = ({query, loading, error, children}) => {
	const {data: _data, loading: _loading, error: _error} = query;

	if (_loading) {
		return loading || <Loading />;
	}

	if (_error) {
		return error || <Box>Oops. Error.</Box>;
	}

	return children(_data);
}

export default Queryable;