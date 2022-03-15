import {Box} from "@chakra-ui/react";
import React from "react";
import {currencyFormat2} from "../utils/numberFormat";
import {Trans} from "react-i18next";
import PrettyIban from "../PrettyIban";

type ToekomstListItemProps = {
    datum?: string,
    bedrag?: string,
    omschrijving?: string,
    rekening?: string
};

const ToekomstListItem: React.FC<ToekomstListItemProps> = ({datum, bedrag, omschrijving, rekening}) => (
	<Box>
		<Trans i18nKey={"toekomst.contextMessage"} values={{
			datum,
			bedrag: bedrag && currencyFormat2(true).format(parseInt(bedrag) / 100),
			omschrijving,
		}} components={{
			strong: <strong />,
			PrettyIban: <PrettyIban iban={rekening} />
		}} />
	</Box>
);

export default ToekomstListItem;