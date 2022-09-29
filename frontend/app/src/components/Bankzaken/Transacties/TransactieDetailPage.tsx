import React from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {BankTransaction, useGetTransactieQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import TransactieItemView from "./TransactieItem/TransactieItemView";

const TransactieDetailPage = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();

	const $transactie = useGetTransactieQuery({
		variables: {
			id: parseInt(id),
		},
	});

	return (
		<Page title={t("transaction")}>

			<Queryable query={$transactie} children={(data => {
				const transactie: BankTransaction = data.bankTransaction;

				if (!transactie?.id) {
					return <PageNotFound />;
				}

				return (
					<TransactieItemView id={transactie.id} />
				);
			})} />

		</Page>
	);

};

export default TransactieDetailPage;
