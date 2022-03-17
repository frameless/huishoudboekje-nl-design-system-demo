import React from "react";
import {currencyFormat2} from "../../utils/numberFormat";
import PrettyIban from "../PrettyIban";
import {Td, Text, Tr} from "@chakra-ui/react";

type ToekomstListItemProps = {
    datum?: string,
    bedrag?: string,
    omschrijving?: string,
    rekening?: string
};

const ToekomstListItem: React.FC<ToekomstListItemProps> = ({datum, bedrag, omschrijving, rekening}) => (
	<Tr>
		<Td>
			<Text>
                U ontvangt op {datum} <strong>{bedrag && currencyFormat2(true).format(parseInt(bedrag) / 100)}</strong> {omschrijving} op uw bankrekening <PrettyIban iban={rekening} />.
			</Text>
		</Td>
	</Tr>
)


export default ToekomstListItem;