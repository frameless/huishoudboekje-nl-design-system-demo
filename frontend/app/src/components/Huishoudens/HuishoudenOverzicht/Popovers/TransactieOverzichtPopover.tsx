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
} from '@chakra-ui/react'
import React from "react";
import {useTranslation} from "react-i18next";
import {formatIBAN} from "../../../../utils/things";
import {BankTransaction} from "../../../../generated/graphql";

type TransactieOverzichtPopover = PopoverProps & {
    bank_transaction: BankTransaction
    content: any
};

const TransactieOverzichtPopover: React.FC<TransactieOverzichtPopover> = ({bank_transaction: bank_transaction, content: content, ...props}) => {
    const {t} = useTranslation();
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <Popover
            isOpen={isOpen}
            placement='bottom-end'
        >
            <PopoverTrigger>
                <Text onMouseEnter={onOpen}
                    onMouseLeave={onClose}>{content}</Text>
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
                            <Text marginBottom={3}>
                                <h4>
                                    <strong>{t("transactions.description")}:</strong>
                                </h4>
                                <p>
                                    {bank_transaction.statementLine}<br /> <br />
                                </p>
                                <Text wordBreak={"break-word"}>{bank_transaction.informationToAccountOwner?.replace(/\s+/g, ' ')}
                                </Text>

                            </Text>
                            <Text marginBottom={2}>
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
                            </Text>
                        </Box>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

export default TransactieOverzichtPopover;
