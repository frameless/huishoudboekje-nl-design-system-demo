import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction, useGetTransactieQuery, useGetTransactionItemFormDataQuery} from "../../../../generated/graphql";
import Queryable from "../../../../utils/Queryable";
import BookingDetailsView from "./BookingDetailsView";
import BookingSection from "./BookingSection";
import TransactieDetailsView from "./TransactieDetailsView";

type TransactieItemModalProps = {
	id: NonNullable<BankTransaction["id"]>;
	onClose: VoidFunction,
};

const TransactieItemModal: React.FC<TransactieItemModalProps> = ({id, onClose}) => {
	const {t} = useTranslation();
	const $transactie = useGetTransactieQuery({
		variables: {id},
	});

	const $transactionItemFormData = useGetTransactionItemFormDataQuery();

	return (
		<Modal isOpen={true} onClose={onClose} size={"4xl"}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("forms.bankzaken.sections.journal.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Queryable query={$transactie} children={data => {
						const transactie = data.bankTransaction;

						return (
							<Stack spacing={10}>
								<TransactieDetailsView transaction={transactie} />

								{transactie.journaalpost ? (
									<BookingDetailsView transactie={transactie} />
								) : (
									<Queryable query={$transactionItemFormData} children={(data) => (
										<BookingSection transaction={transactie} rubrieken={data.rubrieken || []} afspraken={data.afspraken || []} />
									)} />
								)}
							</Stack>
						);
					}} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default TransactieItemModal;