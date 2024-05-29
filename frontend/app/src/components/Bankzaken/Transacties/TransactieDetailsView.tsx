import {Badge, Box, FormLabel, Stack, StackProps, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import {currencyFormat2} from "../../../utils/things";
import PrettyIban from "../../shared/PrettyIban";

const TransactieDetailsView: React.FC<StackProps & {transaction: BankTransaction}> = ({transaction: bt, ...props}) => {
	const {t} = useTranslation();

	const getIsBookedAndHow = () => {
		if (bt.journaalpost) {
			return bt.journaalpost.isAutomatischGeboekt ? "automatisch" : "handmatig";
		}

		return false;
	};

	return (
		<Stack spacing={5} justifyContent={"space-between"} {...props}>
			<Stack direction={"row"} spacing={5}>
				<Box flex={1}>
					<FormLabel>{t("global.date")}</FormLabel>
					<Box>
						<Text data-test="transaction.date">{d(bt.transactieDatum).format("L")}</Text>
					</Box>
				</Box>
				<Box flex={1}>
					<FormLabel>{t("form.common.fields.status")}</FormLabel>
					{getIsBookedAndHow() === "automatisch" && (
						<Box>
							<Badge colorScheme={"green"}>{t("forms.afspraken.fields.automatischGeboekt")}</Badge>
						</Box>
					)}
					{getIsBookedAndHow() === "handmatig" && (
						<Box>
							<Badge colorScheme={"green"}>{t("forms.afspraken.fields.handmatigGeboekt")}</Badge>
						</Box>
					)}
					{!getIsBookedAndHow() && (
						<Box>
							<Badge colorScheme={"red"}>{t("forms.afspraken.fields.ongeboekt")}</Badge>
						</Box>
					)}
				</Box>
			</Stack>

			<Stack direction={"row"} spacing={5}>
				<Box flex={1}>
					<FormLabel>{t("transactions.beneficiaryAccount")}</FormLabel>
					<Box>{bt.tegenRekening ? (
						<Stack spacing={0}>
							<Text>{bt.tegenRekening.rekeninghouder}</Text>
							<Text size={"sm"}><PrettyIban iban={bt.tegenRekening.iban} fallback={t("unknownIban")} /></Text>
						</Stack>
					) : (
						<Text size={"sm"}><PrettyIban iban={bt.tegenRekeningIban} fallback={t("unknownIban")} /></Text>
					)}
					</Box>
				</Box>

				<Box flex={1}>
					<FormLabel>{t("transactions.amount")}</FormLabel>
					<Box>
						<Text data-test="transaction.amount">{currencyFormat2().format(bt.bedrag)}</Text>
					</Box>
				</Box>
			</Stack>

			<Box>
				<FormLabel>{t("transactions.description")}</FormLabel>
				<Box fontSize={"sm"} p={2} bg={"gray.100"} overflowX={"auto"}>
					<Text fontFamily={"monospace"} overflowWrap={"break-word"}>{bt.informationToAccountOwner}</Text>
				</Box>
			</Box>
		</Stack>
	);
};

export default TransactieDetailsView;
