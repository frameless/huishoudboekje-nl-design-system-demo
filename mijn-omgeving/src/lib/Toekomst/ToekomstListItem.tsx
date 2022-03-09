import {Box, HStack, Stack} from "@chakra-ui/react";
import React from "react";
import {Afspraak} from "../../generated/graphql";


const ToekomstListItem: React.FC<{ afspraak: Afspraak }> = ({afspraak}) => {
	return (
		<Stack>
			<HStack justify={"space-between"}>
				<Box>
					{afspraak.id}
				</Box>
				<Box>
					{afspraak.betaalinstructie?.byMonthDay}
				</Box>
				<Box>
					{afspraak.omschrijving}
				</Box>
				<Box>
					{afspraak.bedrag}
				</Box>
				<Box>
					{afspraak.tegenrekening?.iban}
				</Box>
			</HStack>
		</Stack>
	)

};

export default ToekomstListItem;