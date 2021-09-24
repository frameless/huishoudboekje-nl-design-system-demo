import {Badge, Box, FormLabel, Heading, Stack, StackProps, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../../../generated/graphql";
import d from "../../../../utils/dayjs";
import Currency from "../../../Layouts/Currency";
import PrettyIban from "../../../Layouts/PrettyIban";

const TransactieDetailsView: React.FC<StackProps & {transaction: BankTransaction}> = ({transaction: bt, ...props}) => {
	const {t} = useTranslation();

	return (
		<Stack spacing={5} justifyContent={"space-between"} {...props}>
			<Heading size={"sm"}>{t("transaction")} #{bt.id}</Heading>

			<Stack direction={"row"} spacing={5}>
				<Box flex={1}>
					<FormLabel>{t("global.date")}</FormLabel>
					<Box>
						<Text>{d(bt.transactieDatum).format("L")}</Text>
					</Box>
				</Box>
				<Box flex={1}>
					<FormLabel>{t("form.common.fields.status")}</FormLabel>
					{bt.journaalpost ? (bt.journaalpost.isAutomatischGeboekt ? (
						<Box>
							<Badge colorScheme={"green"}>{t("forms.afspraken.fields.automatischGeboekt")}</Badge>
						</Box>
					) : (
						<Box>
							<Badge colorScheme={"green"}>{t("forms.afspraken.fields.handmatigGeboekt")}</Badge>
						</Box>
					)) : (
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
							<Text size={"sm"}><PrettyIban iban={bt.tegenRekening.iban} /></Text>
						</Stack>
					) : (
						<Text size={"sm"}><PrettyIban iban={bt.tegenRekeningIban} /></Text>
					)}
					</Box>
				</Box>

				<Box flex={1}>
					<FormLabel>{t("transactions.amount")}</FormLabel>
					<Box>
						<Currency justifyContent={"flex-start"} value={bt.bedrag} />
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