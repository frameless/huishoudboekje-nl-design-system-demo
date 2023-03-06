import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Afspraak, BankTransaction, Rubriek} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import BookingDetailsView from "./BookingDetailsView";
import BookingSection from "./BookingSection";
import TransactieDetailsView from "./TransactieDetailsView";

type TransactieItemViewProps = {
	transactie: BankTransaction,
	afspraken?: Afspraak[],
	rubrieken?: Rubriek[],
};

const TransactieItemView: React.FC<TransactieItemViewProps> = ({transactie, afspraken, rubrieken}) => {
	const {t} = useTranslation();

	return (
		<SectionContainer>
			<Section title={t("pages.transactieDetails.transactie.title", {id: transactie.id})} helperText={t("pages.transactieDetails.transactie.helperText")}>
				<TransactieDetailsView transaction={transactie} />
			</Section>
			{transactie.journaalpost ? (
				<Section title={t("pages.transactieDetails.afspraak.title")} helperText={t("pages.transactieDetails.afspraak.helperText")}>
					<BookingDetailsView transactie={transactie} />
				</Section>
			) : (
				<Section title={t("pages.transactieDetails.afletteren.title")} helperText={t("pages.transactieDetails.afletteren.helperText")}>
					<BookingSection transaction={transactie} rubrieken={rubrieken || []} afspraken={afspraken || []} />
				</Section>
			)}
		</SectionContainer>
	);
};

export default TransactieItemView;
