import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {BankTransaction, useGetTransactieQuery} from "../../../generated/graphql";
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
				uuid: id,
			},
		});
	}

	return (
		<Queryable query={$transactie()} children={(data => {
			const transactie: BankTransaction = data.bankTransaction;
			if (!transactie?.uuid) {
				return <PageNotFound />;
			}
			return (
				<Page title={t("transaction")}>
					<TransactieItemView transactie={transactie}/>
				</Page>
			);
		})} />
	);
};

export default TransactieDetailPage;
