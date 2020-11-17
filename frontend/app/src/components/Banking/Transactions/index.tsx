import {useQuery} from "@apollo/client";
import {Box, BoxProps, Heading, Stack, useToast} from "@chakra-ui/core";
import React from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {IBankTransaction} from "../../../models";
import {GetAllTransactionsQuery} from "../../../services/graphql/queries";
import Queryable from "../../../utils/Queryable";
import {FormLeft, FormRight, Label} from "../../Forms/FormLeftRight";

const Transactions: React.FC<BoxProps> = ({...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const toast = useToast();

	const $transactions = useQuery(GetAllTransactionsQuery);

	return (
		<Stack spacing={5} {...props}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack direction={"row"} spacing={5} alignItems={"center"}>
					<Heading size={"lg"}>{t("banking.transactions")}</Heading>
				</Stack>
			</Stack>

			<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
				<Stack direction={isMobile ? "column" : "row"} spacing={5}>
					<FormLeft spacing={3}>
						<Stack spacing={1}>
							<Heading size={"md"}>{t("forms.banking.sections.transactions.title")}</Heading>
							<Label>{t("forms.banking.sections.transactions.detailText")}</Label>
						</Stack>
					</FormLeft>
					<FormRight>

						<Queryable query={$transactions}>{(data: { bankTransactions: IBankTransaction[] }) => (
							data.bankTransactions.map(t => (
								<Box as={"pre"}>{JSON.stringify(t, null, 2)}</Box>
							))
						)}
						</Queryable>

					</FormRight>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Transactions;