import {Box, HStack, Stack} from "@chakra-ui/react";
import React from "react";
import {Afspraak} from "../../generated/graphql";
import useScheduleHelper from "../../utils/useScheduleHelper";
import {Trans, useTranslation} from "react-i18next";

const ToekomstListItem: React.FC<{ afspraak: Afspraak }> = ({afspraak}) => {
	const scheduleHelper = useScheduleHelper(afspraak.betaalinstructie);
	const {t} = useTranslation();

	console.log(afspraak.bedrag)

	return (
		<Stack>
			<HStack justify={"space-between"}>
				<Box>
					<Trans i18nKey={"toekomst.contextMessage"} values={{
						datum: scheduleHelper.toString(),
						// bedrag: currencyFormat2(true).format(parseFloat(afspraak.bedrag)),
						omschrijving: (afspraak.omschrijving),
						rekening: (afspraak.tegenrekening?.iban)
					}}
					/>
				</Box>
			</HStack>
		</Stack>
	)

};

export default ToekomstListItem;