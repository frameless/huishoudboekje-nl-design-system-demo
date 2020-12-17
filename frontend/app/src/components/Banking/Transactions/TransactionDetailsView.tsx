import { CheckIcon } from "@chakra-ui/icons";
import {Box, Stack, StackProps, Text, HStack} from "@chakra-ui/react";
import {friendlyFormatIBAN} from "ibantools";
import React from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../../generated/graphql";
import {dateFormat} from "../../../utils/things";
import Currency from "../../Currency";
import {Label} from "../../Forms/FormLeftRight";
import PrettyIban from "../../Layouts/PrettyIban";

const TransactionDetailsView: React.FC<StackProps & { transaction: BankTransaction }> = ({transaction: bt, ...props}) => {
	const {t} = useTranslation();

	return (
		<Stack spacing={5} justifyContent={"space-between"} {...props}>
			<Box>
				<Label>{t("forms.common.fields.date")}</Label>
				<Box>
					<Text>{dateFormat.format(new Date(bt.transactieDatum))}</Text>
				</Box>
			</Box>

			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} maxWidth={500}>
				<Box>
					<Label>{t("transactions.beneficiaryAccount")}</Label>
					<Box flex={2}>{bt.tegenRekening ? (
						<Stack spacing={0}>
							<Text>{bt.tegenRekening.rekeninghouder}</Text>
							<PrettyIban iban={bt.tegenRekening.iban} />
						</Stack>
					) : (
						<PrettyIban iban={bt.tegenRekeningIban} />
					)}
					</Box>
				</Box>

				<Box>
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

export default TransactionDetailsView;