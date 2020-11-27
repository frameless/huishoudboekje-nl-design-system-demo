import React from "react";
import {Box, Heading} from "@chakra-ui/react";
import VersionTag from "../VersionTag";

const SidebarFooter = () => (
	<Box textAlign={"center"}>
		<Heading size={"sm"} color={"gray.400"}>Huishoudboekje</Heading>
		<VersionTag color={"gray.400"} />
	</Box>
);

export default SidebarFooter;