import { InfoIcon } from "@chakra-ui/icons";
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
} from '@chakra-ui/react'
import React from "react";
import {useTranslation} from "react-i18next";
import { formatIBAN } from "../../../utils/things";
import { BankTransaction } from "../../../generated/graphql";

type TransactiePopoverProps = PopoverProps & {
	bank_transaction: BankTransaction
};

const TransactiePopover: React.FC<TransactiePopoverProps> = ({bank_transaction: bank_transaction, ...props}) => {
	const {t} = useTranslation();
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Popover
			isOpen={isOpen}
			placement='bottom-end'
		>
			<PopoverTrigger>
				<Text>
					<Icon
						as={InfoIcon}
						color="blue.400"
						marginLeft="1.5"
						onMouseEnter={onOpen}
						onMouseLeave={onClose}
					/>
				</Text>
			</PopoverTrigger>
			<PopoverContent
				color='white'
				bg='blue.800'
				borderColor='blue.800'
				onMouseLeave={onClose}
				maxWidth='400'
			>
				<PopoverArrow bg='blue.800' />
				<PopoverBody>
					<Box 
						flex="2"
						width="100%"
					>
						<Text marginBottom={3}>
							<h4><strong>{t("transactions.description")}:</strong></h4>
							<p>
								{bank_transaction.statementLine}<br/><br/>
								{bank_transaction.informationToAccountOwner?.replace(/\s+/g, ' ')}
							</p>
						</Text>
						<Text marginBottom={2}>
							<h4><strong>{t("transacties.tegenrekening")}:</strong></h4>
							<p>{bank_transaction.tegenRekening?.rekeninghouder || t("unknown")}</p>
						</Text>
						<Text marginBottom={2}>
							<h4><strong>{t("forms.rekeningen.fields.iban")}:</strong></h4>
							<p>{formatIBAN(bank_transaction.tegenRekening?.iban) || t("unknown")}</p>
						</Text>
					</Box>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default TransactiePopover;
