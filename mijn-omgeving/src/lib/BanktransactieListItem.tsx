import React from "react";
import {Banktransactie} from "./generated/graphql";
import {Box, Flex, Spacer, Text} from "@chakra-ui/react";

const nf = new Intl.NumberFormat("nl-NL", {style: "currency", currency: "EUR"});

const BanktransactieListItem: React.FC<{ transactie: Banktransactie }> = ({transactie}) => {
	const bedrag = transactie.bedrag * (transactie.isCredit ? 1 : -1);

	return (
		<Flex>
			<Box>
				<Text>{transactie.tegenrekening?.rekeninghouder}</Text>
			</Box>
			<Spacer />
			<Box>
				<Text>{nf.format(bedrag)}</Text>
			</Box>
		</Flex>
	);
};

export default BanktransactieListItem;