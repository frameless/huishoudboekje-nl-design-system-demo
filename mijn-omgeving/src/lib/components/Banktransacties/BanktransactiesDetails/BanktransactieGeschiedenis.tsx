import React from "react";
import {Box, HStack, Stack, Text} from "@chakra-ui/react";
import PrettyIban from "../../PrettyIban";
import {Banktransactie} from "../../../../generated/graphql";
import Divider from "@gemeente-denhaag/divider";
import {NavLink} from "react-router-dom";
import {ChevronRightIcon, DownloadIcon} from "@gemeente-denhaag/icons";
import {currencyFormat} from "../../../utils/numberFormat";
import {Heading5} from "@gemeente-denhaag/typography";
import d from "../../../utils/dayjs";

const BanktransactieGeschiedenis: React.FC<{ transacties: Banktransactie [] }> = ({transacties}) => {
	const dateString = (date: Date): string => {
		const _date = d(date).startOf("day");
		const today = d().startOf("day");

		if (_date.isSame(today)) {
			return "Vandaag";
		}

		if (_date.isSame(today.subtract(1, "day"))) {
			return "Gisteren";
		}

		const format = _date.year() !== d().year() ? "dddd D MMMM YYYY" : "dddd D MMMM";
		return d(date).format(format);
	};

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

			{/*{transacties.length > 0 ? (*/}
			{transacties.map((transactie, i) => {
				return (
					<Stack>
						<HStack justify={"space-between"}>
							<Box key={i}>
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
			})}
			{/*): (*/}
			{/*	<Text>Er zijn geen transacties gevonden.</Text>*/}
			{/*)};*/}
		</Stack>
	);
};

export default BanktransactieGeschiedenis;