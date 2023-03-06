import React from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {Afspraak, BankTransaction, Rubriek, useGetTransactieQuery, useGetTransactieAfgeletterdQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import TransactieItemView from "./TransactieItemView";

const TransactieDetailPage = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();

	const $transactie = () => {
		return useGetTransactieQuery({
			fetchPolicy: "cache-and-network",
			variables: {
				id: parseInt(id),
			},
		});
	}

	return (
		<Queryable query={$transactie()} children={(data => {
			const transactie: BankTransaction = data.bankTransaction;
			const afspraken: Afspraak[] = []
			transactie.suggesties?.forEach(suggestie => {
				const similar = suggestie.similarAfspraken ? suggestie.similarAfspraken : []
				afspraken.push(...similar)
			})

			const rubrieken: Rubriek[] = data.rubrieken;
			if (!transactie?.id) {
				return <PageNotFound />;
			}
			return (
				<Page title={t("transaction")}>
					<TransactieItemView transactie={transactie} afspraken={afspraken} rubrieken={rubrieken} />
				</Page>
			);
		})} />
	);
};

export default TransactieDetailPage;
