import React from "react";
import {Box, HStack, Stack, Text} from "@chakra-ui/react";
import PrettyIban from "../../PrettyIban";
import {Banktransactie} from "../../../../generated/graphql";
import Divider from "@gemeente-denhaag/divider";
import {NavLink} from "react-router-dom";
import {ChevronRightIcon} from "@gemeente-denhaag/icons";
import {currencyFormat} from "../../../utils/numberFormat";
import d from "../../../utils/dayjs";
import {dateString} from "../../../utils/dateFormat";

const BanktransactieGeschiedenis: React.FC<{ transacties: Banktransactie [] }> = ({transacties}) => {
	return (
		<Stack>
			{transacties.length > 0 ? (
				transacties.map((transactie, i) => {
					return (
						<Stack key={i}>
							<HStack justify={"space-between"}>
								<Box>
									<Text color={"gray"} fontSize={"sm"}>{dateString(d(transactie.transactiedatum, "YYYY-MM-DD").toDate())}</Text>
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
							<Divider />
						</Stack>
					)
				})
			) : (
				<Text>Er zijn geen transacties gevonden.</Text>
			)};
		</Stack>
	);
};

export default BanktransactieGeschiedenis;