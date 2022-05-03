import {Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction, useGetTransactieQuery, useGetTransactionItemFormDataQuery} from "../../../../generated/graphql";
import Queryable from "../../../../utils/Queryable";
import Modal from "../../../shared/Modal";
import BookingDetailsView from "./BookingDetailsView";
import BookingSection from "./BookingSection";
import TransactieDetailsView from "./TransactieDetailsView";

type TransactieItemModalProps = {
	id: NonNullable<BankTransaction["id"]>;
	onClose: VoidFunction,
	refetch: VoidFunction,
};

const TransactieItemModal: React.FC<TransactieItemModalProps> = ({id, onClose, refetch}) => {
	const {t} = useTranslation();
	const $transactie = useGetTransactieQuery({
		variables: {id},
	});

	const $transactionItemFormData = useGetTransactionItemFormDataQuery();

	return (
		<Modal title={t("forms.bankzaken.sections.journal.title")} onClose={onClose} size={"4xl"}>
			<Queryable query={$transactie} children={data => {
				const transactie = data.bankTransaction;

				return (
					<Stack spacing={10}>
						<TransactieDetailsView transaction={transactie} />

						{transactie.journaalpost ? (
							<BookingDetailsView transactie={transactie} refetch={refetch} />
						) : (
							<Queryable query={$transactionItemFormData} children={(data) => (
								<BookingSection transaction={transactie} rubrieken={data.rubrieken || []} afspraken={data.afspraken || []} refetch={refetch} />
							)} />
						)}
					</Stack>
				);

			}} />
		</Modal>
	);
};

export default TransactieItemModal;