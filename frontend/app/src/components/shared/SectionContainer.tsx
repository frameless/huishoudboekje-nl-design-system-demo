import {chakra, Divider, Stack, StackProps} from "@chakra-ui/react";
import React from "react";

const BaseSectionContainer = chakra(Stack, {
	baseStyle: {
		maxWidth: "100%",
		bg: "white",
		p: 5,
		borderRadius: 10,
	},
});

const SectionContainer: React.FC<StackProps> = (props) => (
	<BaseSectionContainer className="do-not-print" spacing={5} divider={<Divider />} {...props} />
)

export default SectionContainer;