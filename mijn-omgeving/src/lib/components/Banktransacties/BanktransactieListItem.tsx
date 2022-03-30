import {Box, HStack, Text} from "@chakra-ui/react";
import React from "react";
import {currencyFormat} from "../../utils/numberFormat";
import {Banktransactie} from "../../../generated/graphql";
import PrettyIban from "../PrettyIban";
import {ChevronRightIcon} from "@gemeente-denhaag/icons";
import {NavLink} from "react-router-dom";

const BanktransactieListItem: React.FC<{ transactie: Banktransactie }> = ({transactie}) => {
	return (
		<HStack justify={"space-between"}>
			<Box>
				{transactie.id}
			</Box>
			<Box>
				<Text>{transactie.tegenrekening?.rekeninghouder || (
					<PrettyIban iban={transactie.tegenrekeningIban} />
				)}</Text>
			</Box>
			<Box>
				<HStack>
					<Text color={transactie.bedrag < 0 ? "currentcolor" : "green.500"}>{currencyFormat.format(transactie.bedrag)}</Text>
					<NavLink to={`/banktransacties/${transactie.id}`}><ChevronRightIcon /></NavLink>
				</HStack>
			</Box>
		</HStack>
	);
};

export default BanktransactieListItem;