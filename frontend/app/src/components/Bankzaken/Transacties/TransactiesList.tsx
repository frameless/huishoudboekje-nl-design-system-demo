import {Box, FormLabel, Stack, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import d from "../../../utils/dayjs";
import {sortBankTransactions} from "../../../utils/things";
import TransactieItem from "./TransactieItem";
import { TransactionSimple } from "./TransactieOverzichtObject";

type TransactiesListProps = {
	transacties: TransactionSimple[],
};

const TransactiesList: React.FC<TransactiesListProps> = ({transacties}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);

	/* Group transacties by date */
	const bt = transacties.reduce((result, t) => {
		const trDateAsString = d(t.transactieDatum).format("L");
		return {
			...result,
			[trDateAsString]: [
				...result[trDateAsString] || [],
				t,
			],
		};
	}, {});

	return (
		<Stack direction={"column"} spacing={5}>
			<Stack direction={"row"} align={"center"}>
				<Box flex={2} textAlign={"left"}>
					<FormLabel>{t("transacties.tegenrekening")}</FormLabel>
				</Box>
				{!isMobile && <Box flex={1} textAlign={"left"}>
					<FormLabel>{t("transacties.rubriek")}</FormLabel>
				</Box>}
				<Box flex={0} minWidth={120}>
					<FormLabel>{t("transacties.bedrag")}</FormLabel>
				</Box>
			</Stack>

			{Object.keys(bt).map((transactionDate, i) => (
				<Stack key={i} spacing={1}>
					<Box>
						<FormLabel>{transactionDate}</FormLabel>
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
			))}
		</Stack>
	);
};

export default TransactiesList;
