import {Badge, Box, Stack, StackProps, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Afspraak, Grootboekrekening} from "../../generated/graphql";
import {formatBurgerName, XInterval} from "../../utils/things";
import {Label} from "../Forms/FormLeftRight";

export const GrootboekrekeningDetailView: React.FC<StackProps & { grootboekrekening: Grootboekrekening }> = ({grootboekrekening: g, ...props}) => {
	const {t} = useTranslation();

	return (
		<Stack direction={"row"} spacing={5} justifyContent={"space-between"} width={"100%"} maxWidth={500} {...props}>
			<Box>
				<Label>{t("transactions.rubric")}</Label>
				<Text>{g.rubriek?.naam}</Text>
			</Box>
			<Box>
				<Label>{t("forms.agreements.fields.description")}</Label>
				<Text>{g.omschrijving}</Text>
			</Box>
		</Stack>
	);
}

export const AfspraakDetailView: React.FC<StackProps & { afspraak: Afspraak }> = ({afspraak: a, ...props}) => {
	const {t} = useTranslation();

	const intervalString = (): string => {
		/* t("interval.every-day", { count }) t("interval.every-week", { count }) t("interval.every-month", { count }) t("interval.every-year", { count }) */
		const parsedInterval = XInterval.parse(a.interval);

		if (!parsedInterval) {
			return t("interval.once");
		}

		const {intervalType: type, count} = parsedInterval;
		return t(`interval.every-${type}`, {count});
	};

	return (
		<Stack direction={"row"} spacing={5} justifyContent={"space-between"} width={"100%"} maxWidth={500} {...props}>
			<Box>
				<Label>{t("burgers.burger")}</Label>
				<Text>{a.gebruiker ? formatBurgerName(a.gebruiker) : t("unknown")}</Text>
			</Box>
			<Box>
				<Label>{t("forms.agreements.fields.description")}</Label>
				<Text>{a.beschrijving}</Text>
			</Box>
			<Box>
				<Stack alignItems={"flex-start"}>
					{a.rubriek && <Badge>{a.rubriek.naam}</Badge>}
					<Badge>{intervalString()}</Badge>
				</Stack>
			</Box>
		</Stack>
	);
}