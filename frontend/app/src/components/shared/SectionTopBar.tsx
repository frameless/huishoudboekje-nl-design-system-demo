import {Box, HStack} from "@chakra-ui/react";
import React from "react";

type SectionTopBarProps = {
	right?: JSX.Element | string | null,
	menu?: JSX.Element | string | null,
};

const SectionTopBar: React.FC<SectionTopBarProps> = ({right, menu}) => (
	<HStack justify={"flex-end"}>
		{right && <Box>{right}</Box>}
		{menu}
	</HStack>
);

export default SectionTopBar;
