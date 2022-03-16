import {Box, Stack} from "@chakra-ui/react";
import React from "react";
import {currencyFormat2} from "../utils/numberFormat";
import {Trans} from "react-i18next";
import PrettyIban from "../PrettyIban";
import Divider from "@gemeente-denhaag/divider";

type ToekomstListItemProps = {
    datum?: string,
    bedrag?: string,
    omschrijving?: string,
    rekening?: string
};

const ToekomstListItem: React.FC<ToekomstListItemProps> = ({datum, bedrag, omschrijving, rekening}) => (
	<Stack>
		<Box pt={2} pb={2}>
			<Trans i18nKey={"toekomst.contextMessage"} values={{
				datum,
				bedrag: bedrag && currencyFormat2(true).format(parseInt(bedrag) / 100),
				omschrijving,
			}} components={{
				strong: <strong />,
				PrettyIban: <PrettyIban iban={rekening} />
			}} />
		</Box>
		<Divider />
	</Stack>
)


export default ToekomstListItem;