import {Box, Stack, StackProps, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Overschrijving} from "../../generated/graphql";
import {Label} from "../Forms/FormLeftRight";
import OverschrijvingItem from "./OverschrijvingItem";

type OverschrijvingenListViewProps = StackProps & { overschrijvingen: Overschrijving[] };
const OverschrijvingenListView: React.FC<OverschrijvingenListViewProps> = ({overschrijvingen, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);

	return (
		<Stack {...props}>
			{!isMobile && (<Stack direction={"row"}>
				<Box flex={1}>
					<Label>{t("forms.common.fields.date")}</Label>
				</Box>
				<Box flex={1} maxWidth={150} width={"100%"}>
					<Label>{t("transactions.amount")}</Label>
				</Box>
			</Stack>)}

			{overschrijvingen.map((ov, i) => (
				<OverschrijvingItem key={i} overschrijving={ov} showStatus={false} />
			))}
		</Stack>
	);
};

export default OverschrijvingenListView;