import {Box, HStack, Text} from "@chakra-ui/react";
import React from "react";
import {currencyFormat} from "../utils/numberFormat";
import {Banktransactie} from "./generated/graphql";
import PrettyIban from "./PrettyIban";

const BanktransactieListItem: React.FC<{transactie: Banktransactie}> = ({transactie}) => {
	return (
		<HStack justify={"space-between"}>
			<Box>
				<Text>{transactie.tegenrekening?.rekeninghouder || (
					<PrettyIban iban={transactie.tegenrekeningIban} />
				)}</Text>
			</Box>
			<Box>
				<Text color={transactie.bedrag < 0 ? "currentcolor" : "green.500"}>{currencyFormat.format(transactie.bedrag)}</Text>
			</Box>
		</HStack>
	);
};

export default BanktransactieListItem;