
import React from "react";
import {Heading, Stack} from "@chakra-ui/core";

const PageNotFound = () => {
	return (
		<Stack>
			<Heading size={"lg"}>Oeps!</Heading>
			<Heading size={"sm"}>Deze pagina is niet gevonden.</Heading>
		</Stack>
	);
};

export default PageNotFound;