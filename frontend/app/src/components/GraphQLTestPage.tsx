import React from "react";
import {Box, BoxProps, Heading, Spinner, Stack} from "@chakra-ui/core";
import {useQuery} from "@apollo/client";
import {print} from "graphql";
import {GetAllGebruikersQuery} from "../services/graphql/queries";

const GetGebruikers: React.FC<BoxProps> = (props) => {
	const {data, loading, error} = useQuery(GetAllGebruikersQuery);

	return (
		<Stack spacing={5} p={10} bg={"white"} {...props}>
			<Heading size="md">Query getGebruikers</Heading>
			<Box as="pre" p={2} bg={"gray.800"} color={"gray.300"}>{print(GetAllGebruikersQuery)}</Box>

			<Heading size="md">Result</Heading>
			{loading && <Spinner />}
			{!loading && data && (
				<Box as="pre" p={2} bg={"gray.800"} color={"gray.300"}>{JSON.stringify(data, null, 2)}</Box>
			)}
			{!loading && error && (
				<Box overflowX={"hidden"}>
					<pre className="result">{JSON.stringify(error, null, 2)}</pre>
				</Box>
			)}
		</Stack>
	)
}

const GraphQlTestPage = () => {
	return (
		<Stack spacing={5} maxW={1200}>
			<Heading size="md">GraphQL Testpagina</Heading>

			<GetGebruikers />
			<GetGebruikers />
		</Stack>
	);
};

export default GraphQlTestPage;