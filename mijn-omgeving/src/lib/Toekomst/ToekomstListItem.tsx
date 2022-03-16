import React from "react";
import {currencyFormat2} from "../utils/numberFormat";
import {Trans} from "react-i18next";
import PrettyIban from "../PrettyIban";
import {Td, Tr} from "@chakra-ui/react";

type ToekomstListItemProps = {
    datum?: string,
    bedrag?: string,
    omschrijving?: string,
    rekening?: string
};

const ToekomstListItem: React.FC<ToekomstListItemProps> = ({datum, bedrag, omschrijving, rekening}) => (
	<Tr>
		<Td>
			<Trans i18nKey={"toekomst.contextMessage"} values={{
				datum,
				bedrag: bedrag && currencyFormat2(true).format(parseInt(bedrag) / 100),
				omschrijving,
			}} components={{
				strong: <strong />,
				PrettyIban: <PrettyIban iban={rekening} />
			}} />
		</Td>
	</Tr>
)


export default ToekomstListItem;