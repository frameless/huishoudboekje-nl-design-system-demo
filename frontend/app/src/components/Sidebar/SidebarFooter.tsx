
import React from "react";
import {Heading} from "@chakra-ui/core";
import VersionTag from "../VersionTag";

const SidebarFooter = () => (
	<>
		<Heading size={"sm"} color={"gray.700"}>Huishoudboekje</Heading>
		<VersionTag color={"gray.700"} />
	</>
);

export default SidebarFooter;