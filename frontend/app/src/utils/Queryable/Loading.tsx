import {Spinner, Stack} from "@chakra-ui/react";
import React from "react";

const Loading = () => (
	<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
		<Spinner />
	</Stack>
);

export default Loading;