import {ChevronDownIcon} from "@chakra-ui/icons";
import {HStack, IconButton, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useGetTransactiesQuery, useStartAutomatischBoekenMutation} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import usePagination from "../../../utils/usePagination";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";
import {TransactionsContext} from "./context";
import TransactiesList from "./TransactiesList";

const Transactions = () => {
	const {t} = useTranslation();
	const {offset, pageSize, setTotal, PaginationButtons} = usePagination({
		pageSize: 50,
	});
	const handleMutation = useHandleMutation();

	const $transactions = useGetTransactiesQuery({
		fetchPolicy: "no-cache",
		variables: {
			offset,
			limit: pageSize,
		},
		onCompleted: data => setTotal(data.bankTransactionsPaged?.pageInfo?.count),
	});

	const [startAutomatischBoeken] = useStartAutomatischBoekenMutation();
	const onClickStartBoekenButton = () => {
		handleMutation(startAutomatischBoeken(), t("messages.automatischBoeken.successMessage"), () => {
			$transactions.refetch();
		});
	};

	return (
		<TransactionsContext.Provider value={{refetch: $transactions.refetch}}>
			<Page title={t("forms.banking.sections.transactions.title")} menu={(
				<Menu>
					<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
					<MenuList>
						<MenuItem onClick={onClickStartBoekenButton}>{t("actions.startBoeken")}</MenuItem>
					</MenuList>
				</Menu>
			)}>
				<Section spacing={5}>
					<HStack justify={"center"}>
						<PaginationButtons />
					</HStack>
					<Queryable query={$transactions} children={(data) => {
						const transacties = data.bankTransactionsPaged?.banktransactions || [];

						// return (
						// 	<pre>{JSON.stringify(transacties, null, 2)}</pre>
						// );
						return (
							<TransactiesList transacties={transacties} />
						);
					}} />
				</Section>
			</Page>
		</TransactionsContext.Provider>
	);
};

export default Transactions;