import {InfoIcon} from "@chakra-ui/icons";
import {
	Box,
	PopoverProps,
	Icon,
	Text,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	PopoverArrow,
	useDisclosure,
	Portal,
	Link,
} from '@chakra-ui/react'
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {formatIBAN} from "../../../../utils/things";
import {BankTransaction} from "../../../../generated/graphql";
import {useNavigate} from "react-router-dom";

type TransactieOverzichtPopover = PopoverProps & {
	bank_transaction: BankTransaction
	content: any
};

const TransactieOverzichtPopover: React.FC<TransactieOverzichtPopover> = ({bank_transaction: bank_transaction, content: content, ...props}) => {
	const {t} = useTranslation();
	const {isOpen, onOpen, onClose} = useDisclosure();
	const navigate = useNavigate()


	function goToTransaction() {
		navigate(`/bankzaken/transacties/${bank_transaction.id}`)
	}


	return (
		<Popover
			isOpen={isOpen}
			placement='bottom-end'
		>
			<PopoverTrigger>
				<Link onClick={goToTransaction} onMouseEnter={onOpen}
					onMouseLeave={onClose}>{content}</Link>
			</PopoverTrigger>
			<Portal>
				<PopoverContent
					color='white'
					bg='blue.800'
					borderColor='blue.800'
					maxWidth='400'
				>
					<PopoverArrow bg='blue.800' />
					<PopoverBody>
						<Box
							flex="2">
							<Box marginBottom={3}>
								<h4>
									<strong>{t("transactions.description")}:</strong>
								</h4>
								<Text wordBreak={"break-word"}>{bank_transaction.informationToAccountOwner?.replace(/\s+/g, ' ')}
								</Text>

							</Box>
							<Box marginBottom={2}>
								<h4>
									<strong>{t("forms.rekeningen.fields.accountHolder")}:</strong>
								</h4>
								<p>
									{bank_transaction.tegenRekening?.rekeninghouder || t("unknown")}
								</p>
								<h4>
									<strong>{t("forms.rekeningen.fields.iban")}:</strong>
								</h4>
								<p>
									{formatIBAN(bank_transaction.tegenRekeningIban) || t("unknown")}
								</p>
							</Box>
						</Box>
					</PopoverBody>
				</PopoverContent>
			</Portal>
		</Popover>
	);
};

export default TransactieOverzichtPopover;
