import {AddIcon, ChevronDownIcon} from "@chakra-ui/icons";
import {Button, Checkbox, FormLabel, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Routes from "../../../config/routes";
import {useGetTransactiesQuery, useStartAutomatischBoekenMutation} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import usePagination from "../../../utils/usePagination";
import DeadEndPage from "../../DeadEndPage";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";
import {TransactionsContext} from "./context";
import TransactiesList from "./TransactiesList";

const Transactions = () => {
	const {t} = useTranslation();
	const {offset, pageSize, total, setTotal, goFirst, PaginationButtons} = usePagination({
		pageSize: 100,
	});
	const [filters, setFilters] = useState<Record<string, boolean | string>>({});
	const handleMutation = useHandleMutation();

	const $transactions = useGetTransactiesQuery({
		fetchPolicy: "no-cache",
		variables: {
			offset,
			limit: pageSize,
			filters: {
				isGeboekt: filters.onlyUnbooked ? false : undefined,
			},
		},
		onCompleted: data => {
			if (total !== data.bankTransactionsPaged?.pageInfo?.count) {
				setTotal(data.bankTransactionsPaged?.pageInfo?.count);
				goFirst();
			}
		},
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
				<Section>
					<Stack>
						<FormLabel>{t("actions.filter")}</FormLabel>
						<Checkbox onChange={e => setFilters(f => ({...f, onlyUnbooked: e.target.checked}))}>{t("filters.transactions.onlyUnbooked")}</Checkbox>
					</Stack>
				</Section>

				<Section spacing={5}>
					<HStack justify={"center"}>
						<PaginationButtons />
					</HStack>
					<Queryable query={$transactions} children={(data) => {
						const transacties = data.bankTransactionsPaged?.banktransactions || [];

						/* If no transacties were found */
						if (transacties.length === 0) {
							return (
								<DeadEndPage message={t("messages.transactions.addHint")}>
									<Button size={"sm"} colorScheme={"primary"} variant={"solid"} leftIcon={<AddIcon />}
										as={NavLink} to={Routes.Bankafschriften}>{t("actions.add")}</Button>
								</DeadEndPage>
							);
						}

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