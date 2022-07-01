import {Box, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {Heading2, Heading4} from "@gemeente-denhaag/typography";
import React from "react";
import {Afspraak, useGetBurgerQuery} from "../../../generated/graphql";
import {currencyFormat2} from "../../utils/numberFormat";
import Queryable from "../../utils/Queryable";
import BackButton from "../BackButton";


const AfsprakenView: React.FC<{ bsn: number }> = ({bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<div>
			<BackButton label={"Huishoudboekje"} />
			<Heading2>Afspraken</Heading2>

			<Queryable query={$burger} render={data => {
				const {afspraken = []} = data.burger || {};

				return (
					<Box mt={3}>
						<Heading4>Inkomsten</Heading4>
						<Table mb={10}>
							<Thead>
								<Tr>
									<Th color={"gray.400"}>Tegenpartij</Th>
									<Th color={"gray.400"}>Omschrijving</Th>
									<Th color={"gray.400"} isNumeric>Bedrag</Th>
								</Tr>
							</Thead>
							{afspraken.filter(afspraken => afspraken.credit).map((afspraak: Afspraak, i) => {
								return (
									<Tbody key={i}>
										<Tr key={i}>
											<Td>{afspraak.tegenrekening?.afdelingen?.[0]?.organisatie?.naam || afspraak.tegenrekening?.rekeninghouder} </Td>
											<Td>{afspraak.omschrijving}</Td>
											<Td isNumeric>{afspraak.bedrag && currencyFormat2(true).format((parseInt(afspraak.bedrag) / 100) * (afspraak.credit ? 1 : -1))}</Td>
										</Tr>
									</Tbody>
								);
							})}
						</Table>

						<Heading4>Uitgaven</Heading4>
						<Table>
							<Thead>
								<Tr>
									<Th color={"gray.400"}>Tegenpartij</Th>
									<Th color={"gray.400"}>Omschrijving</Th>
									<Th color={"gray.400"} isNumeric>Bedrag</Th>
								</Tr>
							</Thead>
							{afspraken.filter(afspraken => afspraken.credit === false).map((afspraak: Afspraak, i) => {
								return (
									<Tbody key={i}>
										<Tr key={i}>
											<Td>{afspraak.tegenrekening?.afdelingen?.[0]?.organisatie?.naam || afspraak.tegenrekening?.rekeninghouder} </Td>
											<Td>{afspraak.omschrijving}</Td>
											<Td isNumeric>{afspraak.bedrag && currencyFormat2(true).format((parseInt(afspraak.bedrag) / 100) * (afspraak.credit ? 1 : -1))}</Td>
										</Tr>
									</Tbody>
								);
							})}
						</Table>
					</Box>
				);
			}} />
		</div>
	);
};

export default AfsprakenView;
