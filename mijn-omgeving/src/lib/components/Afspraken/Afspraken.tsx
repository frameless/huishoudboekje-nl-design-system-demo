import React from "react";
import {useGetBurgerQuery} from "../../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {Table, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import {Heading2} from "@gemeente-denhaag/typography";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {currencyFormat2} from "../../utils/numberFormat";
import {Link} from "@gemeente-denhaag/link";


const Afspraken: React.FC<{ bsn: number }> = ({bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<Queryable query={$burger} render={data => {
			const {afspraken = []} = data.burger || {};

			return (
				<div>
					<Link href={"/"} icon={<ArrowLeftIcon />} iconAlign={"start"}>Huishoudboekje</Link>
					<Heading2>Afspraken</Heading2>

					<Text fontSize={"xl"} mt={10}>Inkomsten</Text>
					<Table>
						<Thead>
							<Tr>
								<Th color={"gray.400"}>Tegenpartij</Th>
								<Th color={"gray.400"}>Omschrijving</Th>
								<Th color={"gray.400"} isNumeric>Bedrag</Th>
							</Tr>
						</Thead>
						{afspraken.filter(afspraken => afspraken.credit).map((afspraak, i) => {
							return (
								<Tbody key={i}>
									<Tr key={i}>
										{/*<pre>{JSON.stringify(afspraak, null, 2)}</pre>*/}
										<Td>{afspraak.tegenrekening.rekeninghouder} </Td>
										<Td>{afspraak.omschrijving}</Td>
										<Td isNumeric>{currencyFormat2(true).format((parseInt(afspraak.bedrag) / 100) * (afspraak.credit ? 1 : -1))}</Td>
									</Tr>
								</Tbody>
							)
						})}
					</Table>

					<Text fontSize={"xl"} mt={10}>Uitgaven</Text>
					<Table>
						<Thead>
							<Tr>
								<Th color={"gray.400"}>Tegenpartij</Th>
								<Th color={"gray.400"}>Omschrijving</Th>
								<Th color={"gray.400"} isNumeric>Bedrag</Th>
							</Tr>
						</Thead>
						{afspraken.filter(afspraken => afspraken.credit === false).map((afspraak, i) => {
							return (
								<Tbody key={i}>
									<Tr key={i}>
										<Td>{afspraak.tegenrekening.rekeninghouder}</Td>
										<Td>{afspraak.omschrijving}</Td>
										<Td isNumeric>{currencyFormat2(true).format((parseInt(afspraak.bedrag) / 100) * (afspraak.credit ? 1 : -1))}</Td>
									</Tr>
								</Tbody>
							)
						})}
					</Table>
				</div>
			)
		}} />
	);
};

export default Afspraken;