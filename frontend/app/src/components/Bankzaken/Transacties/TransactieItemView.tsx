import React from "react";
import {useTranslation} from "react-i18next";
import {Afspraak, BankTransaction, Rubriek} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import BookingDetailsView from "./BookingDetailsView";
import TransactieDetailsView from "./TransactieDetailsView";
import BookingSection from "./BookingSection/BookingSection";

type TransactieItemViewProps = {
	transactie: BankTransaction,
	afspraken?: Afspraak[],
	rubrieken?: Rubriek[],
};

const TransactieItemView: React.FC<TransactieItemViewProps> = ({transactie}) => {
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
					<BookingSection transaction={transactie}/>
				</Section>
			)}
		</SectionContainer>
	);
};

export default TransactieItemView;
