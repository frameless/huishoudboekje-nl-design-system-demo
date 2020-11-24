import { useQuery } from "@apollo/client";
import { Box, BoxProps, Divider, Heading, Stack } from "@chakra-ui/core";
import React from "react";
import { useIsMobile } from "react-grapple";
import { useTranslation } from "react-i18next";
import { IBankTransaction } from "../../../models";
import { GetAllTransactionsQuery } from "../../../services/graphql/queries";
import Queryable from "../../../utils/Queryable";
import DeadEndPage from "../../DeadEndPage";
import { FormLeft, FormRight, Label } from "../../Forms/FormLeftRight";
import TransactionItem from "./TransactionItem";

const Transactions: React.FC<BoxProps> = ({ ...props }) => {
	const isMobile = useIsMobile();
	const { t } = useTranslation();

	const $transactions = useQuery(GetAllTransactionsQuery, {
		fetchPolicy: "no-cache",
	});

	return (
		<Stack spacing={5} {...props}>
			<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
				<Queryable query={$transactions}>{(data: { bankTransactions: IBankTransaction[] }) => {
					return data.bankTransactions.length === 0 ? (
						<DeadEndPage message={t("messages.transactions.addHint")} />
					) : (<>
						<Stack direction={isMobile ? "column" : "row"} spacing={5}>
							<FormLeft spacing={3}>
								<Stack spacing={1}>
									<Heading size={"md"}>{t("forms.banking.sections.transactions.title")}</Heading>
									<Label>{t("forms.banking.sections.transactions.detailText")}</Label>
								</Stack>
							</FormLeft>
							<FormRight />
						</Stack>

						<Divider />

						<Stack direction={"column"} spacing={5}>
							{data.bankTransactions.map(t => (
								<TransactionItem key={t.id} bankTransaction={t} />
							))}
						</Stack>
					</>

					);

				}}
				</Queryable>

			</Stack>
		</Stack>
	);
};

export default Transactions;