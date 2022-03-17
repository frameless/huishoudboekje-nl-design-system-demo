import {Stack, Table, Tbody, Td, Tr} from "@chakra-ui/react";
import {Heading4} from "@gemeente-denhaag/components-react";
import "@gemeente-denhaag/design-tokens-components";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {Link} from "@gemeente-denhaag/link";
import {Heading2} from "@gemeente-denhaag/typography";
import React from "react";
import {useGetBurgerQuery} from "../../../generated/graphql";
import PrettyIban from "../PrettyIban";
import Queryable from "../../utils/Queryable";


const DetailBurgerView: React.FC<{bsn: number}> = ({bsn}) => {
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
							<Stack key={i}>
								<Heading4>Rekening</Heading4>
								<Table variant={"simple"}>
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
						);
					})}
				</div>
			);
		}} />
	);
};

export default DetailBurgerView;