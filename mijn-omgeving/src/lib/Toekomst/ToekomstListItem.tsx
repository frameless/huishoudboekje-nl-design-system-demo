import {Box, HStack} from "@chakra-ui/react";
import React from "react";
import {Rekening} from "../../generated/graphql";


const ToekomstListItem: React.FC<{ rekening: Rekening }> = ({rekening}) => {
	return (
		<HStack justify={"space-between"}>
			<Box>
				{rekening.rekeninghouder}
			</Box>
			<Box>
				{rekening.id}
			</Box>
			<Box>
				{rekening.iban}
			</Box>
		</HStack>
	);
};

export default ToekomstListItem;