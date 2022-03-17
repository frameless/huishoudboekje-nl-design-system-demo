import React from "react";
import Queryable from "../Queryable";
import {useGetBurgerQuery} from "../../generated/graphql";
import "@gemeente-denhaag/design-tokens-components";
import {Heading4} from "@gemeente-denhaag/components-react";
import {Stack, Table, Tbody, Td, Tr} from "@chakra-ui/react";
import {Heading2} from "@gemeente-denhaag/typography";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import PrettyIban from "../PrettyIban";
import {Link} from "@gemeente-denhaag/link";


const DetailBurgerView: React.FC<{ bsn: number }> = ({bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<Queryable query={$burger} render={data => {
			const {rekeningen = []} = data.burger || {};

			return (
				<div>
					<Link href={"/"} icon={<ArrowLeftIcon />} iconAlign={"start"}>Mijn gegevens</Link>
					<Heading2>Mijn gegevens</Heading2>
					{rekeningen.map((rekening, i) => {
						return (
							<Stack>
								<Heading4>Rekening</Heading4>
								<Table variant={"simple"} key={i}>
									<Tbody>
										<Tr>
											<Td fontWeight={"bold"}>Rekeninghouder</Td>
											<Td>{rekening.rekeninghouder}</Td>
										</Tr>
										<Tr>
											<Td fontWeight={"bold"}>Iban</Td>
											<Td> <PrettyIban iban={rekening.iban} /></Td>
										</Tr>
									</Tbody>
								</Table>
							</Stack>
						)
					})}
				</div>
			)
		}} />
	)
};

export default DetailBurgerView;