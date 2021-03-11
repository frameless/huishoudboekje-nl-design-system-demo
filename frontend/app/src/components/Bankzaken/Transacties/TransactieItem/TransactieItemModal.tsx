import {Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useGetTransactionItemFormDataQuery} from "../../../../generated/graphql";
import Queryable from "../../../../utils/Queryable";
import BookingDetailsView from "./BookingDetailsView";
import BookingSection from "./BookingSection";
import TransactieDetailsView from "./TransactieDetailsView";

const TransactieItemModal = ({transactie, disclosure}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {isOpen, onClose} = disclosure;

	const $transactionItemFormData = useGetTransactionItemFormDataQuery({
		fetchPolicy: "no-cache",
	});

	return (
		<Modal isOpen={!isMobile && isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={"100%"} maxWidth={1000}>
				<ModalHeader>{t("forms.banking.sections.journal.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
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
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default TransactieItemModal;