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
import {formatBurgerName, formatIBAN, getBurgerHhbId} from "../../../../utils/things";
import {Afspraak, BankTransaction, Burger} from "../../../../generated/graphql";
import d from "../../../../utils/dayjs";

type AfspraakOverzichtPopover = PopoverProps & {
    afspraak: Afspraak
    burger
    content: any
};

const AfspraakOverzichtPopover: React.FC<AfspraakOverzichtPopover> = ({afspraak: afspraak, content: content, burger: burger, ...props}) => {
    const {t} = useTranslation();
    const {isOpen, onOpen, onClose} = useDisclosure();
    // id
    // burgerId
    // organisatieId
    // omschrijving
    // rekeninghouder
    // tegenRekeningId
    // validFrom
    // validThrough
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
                                <Text>
                                    {afspraak.omschrijving}<br /> <br />
                                </Text>

                            </Text>
                            <Text marginBottom={2}>
                                <h4>
                                    <strong>{t("forms.rekeningen.fields.accountHolder")}:</strong>
                                </h4>
                                <p>
                                    {formatBurgerName(burger) + " " + getBurgerHhbId(burger) || t("unknown")}
                                </p>
                                <h4>
                                    <strong>{t("forms.rekeningen.fields.iban")}:</strong>
                                </h4>
                                <p>
                                    {d(afspraak.validFrom).format("DD-MM-YYYY") || t("unknown")} - {afspraak.validThrough != undefined ? d(afspraak.validThrough).format("DD-MM-YYYY") : `∞`}
                                </p>
                                <p>

                                </p>
                            </Text>
                        </Box>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

export default AfspraakOverzichtPopover;
