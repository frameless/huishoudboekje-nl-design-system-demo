import {Box, Divider, Heading, Stack, useBreakpointValue} from "@chakra-ui/react";
import React, {createContext} from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction, useGetAllTransactionsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {dateFormat, sortBankTransactions} from "../../../utils/things";
import DeadEndPage from "../../DeadEndPage";
import Label from "../../Layouts/Label";
import Section from "../../Layouts/Section";
import TransactieItem from "./TransactieItem";

export const TransactionsContext = createContext<{ refetch: VoidFunction }>({
	refetch: () => undefined
});

const Transactions = () => {
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {t} = useTranslation();

	const $transactions = useGetAllTransactionsQuery({
		fetchPolicy: "no-cache",
	});

	return (
		<Stack spacing={5}>
			<Section>

				<Queryable query={$transactions}>{({bankTransactions}: { bankTransactions: BankTransaction[] }) => {
					if (!bankTransactions || bankTransactions.length === 0) {
						return (<DeadEndPage message={t("messages.transactions.addHint")} />);
					}

					const bt = bankTransactions.sort((a, b) => a.transactieDatum > b.transactieDatum ? -1 : 1).reduce((result, t) => {
						const trDateAsString = dateFormat.format(new Date(t.transactieDatum));
						return {
							...result,
							[trDateAsString]: [
								...(result[trDateAsString] || []),
								t
							]
						};
					}, {});

					return (
						<TransactionsContext.Provider value={{refetch: $transactions.refetch}}>
							<Stack direction={["column", "row"]} spacing={5}>
								<Heading size={"md"}>{t("forms.banking.sections.transactions.title")}</Heading>
							</Stack>

							<Divider />

							<Stack direction={"column"} spacing={5}>
								<Box>
									<Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
										<Box flex={2} textAlign={"left"}>
											<Label>{t("transactions.beneficiaryAccount")}</Label>
										</Box>
										{!isMobile && <Box flex={1} textAlign={"left"}>
											<Label>{t("transactions.rubric")}</Label>
										</Box>}
										<Box flex={0} minWidth={120}>
											<Label>{t("transactions.amount")}</Label>
										</Box>
									</Stack>
								</Box>

								{Object.keys(bt).map((transactionDate, i) => {
									return (
										<Stack key={i} spacing={5}>
											<Box>
												<Label>{transactionDate}</Label>
											</Box>
											<Box>
												{bt[transactionDate].sort(sortBankTransactions).filter(t => t.isCredit).map(t => (
													<TransactieItem key={t.id} bankTransaction={t} />
												))}
												{bt[transactionDate].sort(sortBankTransactions).filter(t => !t.isCredit).reverse().map(t => (
													<TransactieItem key={t.id} bankTransaction={t} />
												))}
											</Box>
										</Stack>
									);
								})}
							</Stack>
						</TransactionsContext.Provider>
					);
				}}
				</Queryable>

			</Section>
		</Stack>
	);
};

export default Transactions;