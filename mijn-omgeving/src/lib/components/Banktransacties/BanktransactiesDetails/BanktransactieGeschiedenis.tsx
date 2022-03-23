import React from "react";
import {Box, HStack, Stack, Text} from "@chakra-ui/react";
import PrettyIban from "../../PrettyIban";
import {Banktransactie} from "../../../../generated/graphql";
import Divider from "@gemeente-denhaag/divider";
import {NavLink} from "react-router-dom";
import {ChevronRightIcon, DownloadIcon} from "@gemeente-denhaag/icons";
import {currencyFormat} from "../../../utils/numberFormat";
import {Heading5} from "@gemeente-denhaag/typography";

const BanktransactieGeschiedenis: React.FC<{ transacties: Banktransactie [] }> = ({transacties}) => {
	return (
		<Stack mt={8}>
			<Heading5>Transactiegeschiedenis</Heading5>
			<HStack justify={"space-between"}>
				<Box>
					<Text color={"gray"} fontSize={"sm"}>Haal mijn transacties op</Text>
					<Text>Klik om mijn transacties te zien</Text>
				</Box>
				<Box>
					<DownloadIcon />
				</Box>
			</HStack>

			{transacties.map((transactie, i) => {
				return (
					<Stack>
						<HStack justify={"space-between"}>
							<Box key={i}>
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
			})}
		</Stack>
	);
};

export default BanktransactieGeschiedenis;