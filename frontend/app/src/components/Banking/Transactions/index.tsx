import {useQuery} from "@apollo/client";
import {Box, BoxProps, Divider, Heading, Icon, Stack} from "@chakra-ui/core";
import React from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {IBankTransaction} from "../../../models";
import {GetAllTransactionsQuery} from "../../../services/graphql/queries";
import Queryable from "../../../utils/Queryable";
import {dateFormat, sortBankTransactions} from "../../../utils/things";
import DeadEndPage from "../../DeadEndPage";
import {FormLeft, FormRight, Label} from "../../Forms/FormLeftRight";
import TransactionItem from "./TransactionItem";

const Transactions: React.FC<BoxProps> = ({...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();

	const $transactions = useQuery(GetAllTransactionsQuery, {
		fetchPolicy: "no-cache",
	});

	return (
		<Stack spacing={5} {...props}>
			<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>

				<Queryable query={$transactions}>{(data: { bankTransactions: IBankTransaction[] }) => {

					if (data.bankTransactions.length === 0) {
						return (<DeadEndPage message={t("messages.transactions.addHint")} />);
					}

					const bt = data.bankTransactions.sort((a, b) => a.transactieDatum > b.transactieDatum ? -1 : 1).reduce((result, t) => {
						const trDateAsString = dateFormat.format(new Date(t.transactieDatum));
						return {
							...result,
							[trDateAsString]: [
								...(result[trDateAsString] || []),
								t
							]
						};
					}, {});

					return (<>
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
							<Box ml={isMobile ? 0 : 5}>
								<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} {...props}>
									<Box flex={2} textAlign={"left"}><Label>Tegenrekening</Label></Box>
									{!isMobile && <Box flex={1} textAlign={"left"}><Label>Journaalpost</Label></Box>}
									<Box flex={1} textAlign={"left"}><Label>Bedrag</Label></Box>
									<Box flex={0} pl={3}>
										<Icon name={"question"} visibility={"hidden"} />
									</Box>
									{/* Todo: Later uit te breiden met geboekt op specifieke afspraak als deze bekend is */}
								</Stack>
							</Box>

							{Object.keys(bt).map((transactionDate, i) => {
								return (
									<Stack key={i} spacing={5}>
										<Box>
											<Label>{transactionDate}</Label>
										</Box>
										<Box ml={isMobile ? 0 : 5}>
											{bt[transactionDate].sort(sortBankTransactions).map(t => {
												return <TransactionItem key={t.id} bankTransaction={t} />;
											})}
										</Box>
									</Stack>
								);
							})}
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