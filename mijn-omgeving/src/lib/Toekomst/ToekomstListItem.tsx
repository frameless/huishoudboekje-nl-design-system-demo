import {Box, HStack, Stack} from "@chakra-ui/react";
import React from "react";
import {Afspraak} from "../../generated/graphql";


const ToekomstListItem: React.FC<{ afspraak: Afspraak }> = ({afspraak}) => {
	return (
		<Stack>
			<HStack justify={"space-between"}>
				{/*<Box>*/}
				{/*	{afspraak.id}*/}
				{/*</Box>*/}
				<Box>
					{afspraak.betaalinstructie?.byDay}
				</Box>
				<Box>
					{afspraak.betaalinstructie?.byMonth} // 1,4,7,10
				</Box>
				<Box>
					{afspraak.betaalinstructie?.byMonthDay}
				</Box>
				{/*<Box>*/}
				{/*	{afspraak.omschrijving}*/}
				{/*</Box>*/}
				{/*<Box>*/}
				{/*	{afspraak.bedrag}*/}
				{/*</Box>*/}
				{/*<Box>*/}
				{/*	{afspraak.tegenrekening?.iban}*/}
				{/*</Box>*/}
				{/*<Box>*/}
				{/*	{afspraak.tegenrekening?.id}*/}
				{/*</Box>*/}
			</HStack>
		</Stack>
	)

};

export default ToekomstListItem;