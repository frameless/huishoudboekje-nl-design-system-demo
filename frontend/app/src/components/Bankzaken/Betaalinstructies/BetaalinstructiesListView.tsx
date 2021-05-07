import {Box, FormLabel, Stack, StackProps, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Overschrijving} from "../../../generated/graphql";
import BetaalinstructieItem from "./BetaalinstructieItem";

type OverschrijvingenListViewProps = StackProps & {overschrijvingen: Overschrijving[]};
const BetaalinstructiesListView: React.FC<OverschrijvingenListViewProps> = ({overschrijvingen, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);

	return (
		<Stack {...props}>
			{!isMobile && (<Stack direction={"row"}>
				<Box flex={1}>
					<FormLabel>{t("forms.common.fields.date")}</FormLabel>
				</Box>
				<Box flex={1} maxWidth={150} width={"100%"}>
					<FormLabel>{t("transactions.amount")}</FormLabel>
				</Box>
			</Stack>)}

			{overschrijvingen.map((ov, i) => (
				<BetaalinstructieItem key={i} overschrijving={ov} showStatus={false} />
			))}
		</Stack>
	);
};

export default BetaalinstructiesListView;