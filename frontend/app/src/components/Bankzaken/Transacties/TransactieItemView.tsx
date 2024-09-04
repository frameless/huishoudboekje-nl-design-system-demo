import React from "react";
import {useTranslation} from "react-i18next";
import {Afspraak, BankTransaction, Rubriek} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import BookingDetailsView from "./BookingDetailsView";
import TransactieDetailsView from "./TransactieDetailsView";
import BookingSection from "./BookingSection/BookingSection";
import {Button} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
type TransactieItemViewProps = {
	transactie: BankTransaction,
	afspraken?: Afspraak[],
	rubrieken?: Rubriek[],
};

const TransactieItemView: React.FC<TransactieItemViewProps> = ({transactie}) => {
	const {t} = useTranslation();
	const navigate = useNavigate();

	return (
		<SectionContainer>
			<Section title={t("pages.transactieDetails.transactie.title", {id: transactie.id})}>
				<TransactieDetailsView transaction={transactie} />
			</Section>
			{transactie.journaalpost ? (
				<Section title={transactie.journaalpost?.afspraak ? t("pages.transactieDetails.afspraak.title") : t("pages.transactieDetails.rubriek.title")}>
					<BookingDetailsView transactie={transactie} />
					<Button float={"right"} colorScheme={"primary"} onClick={() => navigate(AppRoutes.Transacties)}>{t("pages.transactieDetails.afspraak.next")}</Button>
				</Section>
			) : (
				<Section title={t("pages.transactieDetails.afletteren.title")} helperText={t("pages.transactieDetails.afletteren.helperText")}>
					<BookingSection transaction={transactie} />
				</Section>
			)
			}
		</SectionContainer >
	);
};

export default TransactieItemView;
