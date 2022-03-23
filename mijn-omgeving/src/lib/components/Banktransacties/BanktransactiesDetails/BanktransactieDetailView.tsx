import React from "react";
import {Banktransactie} from "../../../../generated/graphql";
import {Link} from "@gemeente-denhaag/link";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {Heading2} from "@gemeente-denhaag/typography";
import {Box, Center, Stack, Text} from "@chakra-ui/react";
import {NavLink} from "react-router-dom";
import d from "../../../utils/dayjs";
import Divider from "@gemeente-denhaag/divider";
import PrettyIban from "../../PrettyIban";
import {currencyFormat} from "../../../utils/numberFormat";

const BanktransactieDetailView: React.FC<{ transactie: Banktransactie }> = ({transactie}) => {
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
		<div>
			<NavLink to={"/banktransacties"}><Link href={"/banktransacties"} icon={<ArrowLeftIcon />} iconAlign={"start"}>terug</Link></NavLink>
			<Heading2>Banktransactie</Heading2>

			<Stack>
				<Center>
					<Box>
						<Text fontSize={"lg"}>{transactie.tegenrekening?.rekeninghouder || (
							<PrettyIban iban={transactie.tegenrekeningIban} />
						)}</Text>
						<Text fontSize={"lg"}>{currencyFormat.format(transactie.bedrag)}</Text>
					</Box>
				</Center>
				<Box>
					<Text color={"gray"} fontSize={"sm"}>Uitvoering</Text>
					<Text>{dateString(d(transactie.transactiedatum, "YYYY-MM-DD").toDate())}</Text>
					<Divider />
				</Box>
				{/*<Box>*/}
				{/*	<Text color={"gray"} fontSize={"sm"}>{transactie.isCredit ? "Van rekening" : "Naar rekening"}</Text>*/}

				{/*</Box>*/}
				<Box>
					<Text color={"gray"} fontSize={"sm"}>Omschrijving</Text>
					<Text>{transactie.informationToAccountOwner}</Text>
					<Divider />
				</Box>
			</Stack>
		</div>
	);
};

export default BanktransactieDetailView;