import React from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction, useGetTransactieQuery, useGetTransactionItemFormDataQuery} from "../../../../generated/graphql";
import Queryable from "../../../../utils/Queryable";
import Section from "../../../shared/Section";
import SectionContainer from "../../../shared/SectionContainer";
import BookingDetailsView from "./BookingDetailsView";
import BookingSection from "./BookingSection";
import TransactieDetailsView from "./TransactieDetailsView";

type TransactieItemViewProps = {
	id: NonNullable<BankTransaction["id"]>;
};

const TransactieItemView: React.FC<TransactieItemViewProps> = ({id}) => {
	const {t} = useTranslation();
	const $transactie = useGetTransactieQuery({
		variables: {id},
	});

	const $transactionItemFormData = useGetTransactionItemFormDataQuery();

	return (
		<Queryable query={$transactie} children={data => {
			const transactie = data.bankTransaction;

			return (
				<SectionContainer>
					<Section title={t("pages.transactieDetails.transactie.title", {id})} helperText={t("pages.transactieDetails.transactie.helperText")}>
						<TransactieDetailsView transaction={transactie} />
					</Section>

					{transactie.journaalpost ? (
						<Section title={t("pages.transactieDetails.afspraak.title")} helperText={t("pages.transactieDetails.afspraak.helperText")}>
							<BookingDetailsView transactie={transactie} />
						</Section>
					) : (
						<Section title={t("pages.transactieDetails.afletteren.title")} helperText={t("pages.transactieDetails.afletteren.helperText")}>
							<Queryable query={$transactionItemFormData} children={(data) => (
								<BookingSection transaction={transactie} rubrieken={data.rubrieken || []} afspraken={data.afspraken || []} />
							)} />
						</Section>
					)}
				</SectionContainer>
			);

		}} />
	);
};

export default TransactieItemView;
