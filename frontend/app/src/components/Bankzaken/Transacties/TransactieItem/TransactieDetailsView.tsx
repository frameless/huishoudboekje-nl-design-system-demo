import {Badge, Box, Heading, Stack, StackProps, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../../../generated/graphql";
import d from "../../../../utils/dayjs";
import Currency from "../../../Currency";
import Label from "../../../Layouts/Label";
import PrettyIban from "../../../Layouts/PrettyIban";

const TransactieDetailsView: React.FC<StackProps & {transaction: BankTransaction}> = ({transaction: bt, ...props}) => {
	const {t} = useTranslation();

	return (
		<Stack spacing={5} justifyContent={"space-between"} {...props}>
			<Heading size={"sm"}>{t("transaction")}</Heading>

			<Stack direction={"row"} spacing={5}>
				<Box flex={1}>
					<Label>{t("forms.common.fields.date")}</Label>
					<Box>
						<Text>{d(bt.transactieDatum).format("L")}</Text>
					</Box>
				</Box>
				<Box flex={1}>
					<Label>{t("form.common.fields.status")}</Label>
					{bt.journaalpost ? (bt.journaalpost.isAutomatischGeboekt ? (
						<Box>
							<Badge colorScheme={"green"}>{t("forms.agreements.fields.automatischGeboekt")}</Badge>
						</Box>
					) : (
						<Box>
							<Badge colorScheme={"green"}>{t("forms.agreements.fields.handmatigGeboekt")}</Badge>
						</Box>
					)) : (
						<Box>
							<Badge colorScheme={"red"}>{t("forms.agreements.fields.ongeboekt")}</Badge>
						</Box>
					)}
				</Box>
			</Stack>

			<Stack direction={"row"} spacing={5}>
				<Box flex={1}>
					<Label>{t("transactions.beneficiaryAccount")}</Label>
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
					<Label>{t("transactions.amount")}</Label>
					<Box>
						<Currency justifyContent={"flex-start"} value={bt.bedrag} />
					</Box>
				</Box>
			</Stack>

			<Box>
				<Label>{t("transactions.description")}</Label>
				<Box fontSize={"sm"} p={2} bg={"gray.100"} overflowX={"auto"}>
					<Text fontFamily={"monospace"} overflowWrap={"break-word"}>{bt.informationToAccountOwner}</Text>
				</Box>
			</Box>
		</Stack>
	);
};

export default TransactieDetailsView;