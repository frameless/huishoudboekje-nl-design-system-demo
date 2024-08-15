import {Box, FormLabel, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import d from "../../../utils/dayjs";
import {sortBankTransactions} from "../../../utils/things";
import TransactieItem from "./TransactieItem";
import { TransactionSimple } from "./TransactieOverzichtObject";

type TransactiesListProps = {
	transacties: TransactionSimple[]
};

const TransactiesList: React.FC<TransactiesListProps> = ({transacties}) => {
	const {t} = useTranslation();
	const transactions_by_date = transacties.reduce((result, current_transaction) => {
		const transaction_date_string = d(current_transaction.transactieDatum).format("L");

		return {
			...result,
			[transaction_date_string]: [
				...result[transaction_date_string] || [],
				current_transaction,
			],
		};
	}, {});

	return (
		<Stack
			direction={"column"}
			spacing={5}
		>
			<Stack
				direction={"row"}
				align={"center"}
			>
				<Box
					paddingLeft={9}
					flex={2}
					textAlign={"left"}
				>
					<FormLabel>{t("transacties.tegenrekening")}</FormLabel>
				</Box>

				<Box
					flex={0}
					minWidth={250}
					data-test=""
				>
					<FormLabel>{t("transacties.rubriek")}</FormLabel>
				</Box>

				<Box
					flex={0}
						minWidth={120}
				>
					<FormLabel>{t("transacties.bedrag")}</FormLabel>
				</Box>
			</Stack>

			{Object.keys(transactions_by_date)
				.map((transaction_date_string, key) => (
					<Stack
						key={key}
						spacing={1}
					>
						<Box paddingLeft={9}>
							<FormLabel>
								{transaction_date_string}
							</FormLabel>
						</Box>

						<Box>
							{transactions_by_date[transaction_date_string]
								.sort(sortBankTransactions)
								.filter((current_transaction: any) => current_transaction.isCredit)
								.map((current_transaction: any) => (
									<TransactieItem
										key={current_transaction.id}
										transactie={current_transaction}
									/>
								))
							}

							{transactions_by_date[transaction_date_string]
								.sort(sortBankTransactions)
								.filter((current_transaction: any) => !current_transaction.isCredit)
								.reverse()
								.map((current_transaction: any) => (
									<TransactieItem
										key={current_transaction.id}
										transactie={current_transaction}
									/>
								))
							}
						</Box>
					</Stack>
				))
			}
		</Stack>
	);
};

export default TransactiesList;
