import {ChevronDownIcon} from "@chakra-ui/icons";
import {IconButton, Menu, MenuButton, MenuItem, MenuList, useToast} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useGetTransactiesQuery, useStartAutomatischBoekenMutation} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";
import {TransactionsContext} from "./context";
import TransactiesList from "./TransactiesList";

const Transactions = () => {
	const {t} = useTranslation();
	const chakraToast = useToast();

	const $transactions = useGetTransactiesQuery({
		fetchPolicy: "no-cache",
	});

	const [$startAutomatischBoeken] = useStartAutomatischBoekenMutation();
	const onClickStartBoekenButton = () => {
		$startAutomatischBoeken()
			.then(() => {
				chakraToast({
					status: "success",
					title: t("messages.automatischBoeken.successMessage"),
					position: "top",
					isClosable: true,
				});
				$transactions.refetch();
			})
			.catch(err => {
				console.error(err);
				chakraToast({
					position: "top",
					status: "error",
					variant: "solid",
					description: t("messages.genericError.description"),
					title: t("messages.genericError.title"),
					isClosable: true,
				});
			});
	};

	return (
		<Queryable query={$transactions} children={(data) => {
			const transacties = data.bankTransactions || [];

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
						<Section>
							<TransactiesList transacties={transacties} />
						</Section>
					</Page>
				</TransactionsContext.Provider>
			);
		}} />
	);
};

export default Transactions;