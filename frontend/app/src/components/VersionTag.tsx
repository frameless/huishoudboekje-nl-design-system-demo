import React from "react";
import {BoxProps, Stack, Text} from "@chakra-ui/core";
import VERSION from "../version";

const VersionTag: React.FC<BoxProps> = (props) => {
	return (
		<Stack spacing={2} fontSize={"xs"} textAlign={"center"} {...props}>
			<Text>{VERSION}</Text>
			<Text>&copy; VNG Realisatie, {(new Date()).getFullYear()}</Text>
		</Stack>
	);
};

export default VersionTag;