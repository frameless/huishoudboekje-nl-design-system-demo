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
    DarkMode,
    Avatar,
    Badge,
    VStack,
    Divider,
} from '@chakra-ui/react'
import React, {useEffect} from "react";
import {Trans, useTranslation} from "react-i18next";
import {formatBurgerName, formatIBAN, getBurgerHhbId} from "../../../../utils/things";
import {Afspraak, BankTransaction, Burger, PaymentRecord} from "../../../../generated/graphql";
import d from "../../../../utils/dayjs";
import {useNavigate} from "react-router-dom";
import usePagination from "../../../../utils/usePagination";
import dayjs from "../../../../utils/dayjs";

type PopoverOpenPaymentRecords = PopoverProps & {
    content: any,
    paymentrecords: PaymentRecord[]
};

const PopoverOpenPaymentRecords: React.FC<PopoverOpenPaymentRecords> = ({content: content, paymentrecords, ...props}) => {
    const {t} = useTranslation(["paymentrecords"]);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const navigate = useNavigate();

    const {offset, total, page, pageSize, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: 1, iconOnly: true, colorScheme: "white"})

    useEffect(() => {
        setTotal(paymentrecords.length)
    })
    const record = paymentrecords[page - 1]

    return (
        <Popover trigger="hover">
            <PopoverTrigger>
                {content}
            </PopoverTrigger>

            <PopoverContent border="0" zIndex={4} width="400px"
                color='white'
                bg='blue.800'
                borderColor='blue.800'>
                <PopoverArrow bg={"blue.800"} />
                <VStack spacing={5} marginTop={5}>
                    <Box>
                        <h4>
                            <strong>{t("record.processAt")}</strong>
                        </h4>
                        <Text>
                            {dayjs.unix(record.processAt).format("DD-MM-YYYY")}
                        </Text>
                    </Box>
                    <Box>
                        <h4>
                            <strong>{t("record.accountholderName")}</strong>
                        </h4>
                        <Text>
                            {record.accountName}
                        </Text>
                        <Text>
                            {record.accountIban}
                        </Text>
                    </Box>
                </VStack>


                <Box marginTop={5} marginBottom={2} color={"white"}><PaginationButtons ></PaginationButtons></Box>

            </PopoverContent>
        </Popover>
    );
}
export default PopoverOpenPaymentRecords;
