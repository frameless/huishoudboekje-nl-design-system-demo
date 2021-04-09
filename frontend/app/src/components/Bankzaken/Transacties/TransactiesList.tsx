import {Box, Stack, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import {sortBankTransactions} from "../../../utils/things";
import DeadEndPage from "../../DeadEndPage";
import Label from "../../Layouts/Label";
import TransactieItem from "./TransactieItem";

type TransactiesListProps = {transacties: BankTransaction[]};

const TransactiesList: React.FC<TransactiesListProps> = ({transacties}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);

	/* If no transacties were found */
	if (transacties.length === 0) {
		return (<DeadEndPage message={t("messages.transactions.addHint")} />);
	}

	/* Group transacties by date */
	const bt = transacties.reduce((result, t) => {
		const trDateAsString = d(new Date(t.transactieDatum)).format("L");
		return {
			...result,
			[trDateAsString]: [
				...(result[trDateAsString] || []),
				t,
			],
		};
	}, {});

	return (
		<Stack direction={"column"} spacing={5}>
			<Stack direction={"row"} align={"center"}>
				<Box flex={2} textAlign={"left"}>
					<Label>{t("transacties.tegenrekening")}</Label>
				</Box>
				{!isMobile && <Box flex={1} textAlign={"left"}>
					<Label>{t("transacties.rubriek")}</Label>
				</Box>}
				<Box flex={0} minWidth={120}>
					<Label>{t("transacties.bedrag")}</Label>
				</Box>
			</Stack>

			{Object.keys(bt).map((transactionDate, i) => {
				return (
					<Stack key={i} spacing={1}>
						<Box>
							<Label>{transactionDate}</Label>
						</Box>
						<Box>
							{bt[transactionDate].sort(sortBankTransactions).filter(t => t.isCredit).map(t => (
								<TransactieItem key={t.id} transactie={t} />
							))}
							{bt[transactionDate].sort(sortBankTransactions).filter(t => !t.isCredit).reverse().map(t => (
								<TransactieItem key={t.id} transactie={t} />
							))}
						</Box>
					</Stack>
				);
			})}
		</Stack>
	);
};

export default TransactiesList;