import {Box, Stack, Text, Tbody, Td, Tr, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {PaymentExportRecordData} from "../../../../generated/graphql";
import dayjs from "../../../../utils/dayjs";
import { currencyFormat2 } from "../../../../utils/things";

type PaymentExportRecordCitizenSectionProps = {
    records: PaymentExportRecordData[];
};


const PaymentRecordCitizenSection: React.FC<PaymentExportRecordCitizenSectionProps> = ({records}) => {
    return (
        <Tbody>
            {records.map((record, key) => (
                <Tr>
                    <Td verticalAlign={"center"}>
                        <Text>{record.agreement?.omschrijving}</Text>
                    </Td>
                    <Td verticalAlign={"center"}>
                        <Text>{record.agreement?.tegenRekening?.rekeninghouder}</Text>
                    </Td>
                    <Td verticalAlign={"center"}>
                        <Stack spacing={1} flex={1} align={"flex-start"} justify={"center"}>
                            <Box textAlign={"left"}>{record.amount ? currencyFormat2().format(record.amount / 100) : ""}</Box>
                        </Stack>
                    </Td>
                    <Td verticalAlign={"center"}>
                        <Text>{dayjs.unix(record.processAt).format("DD-MM-YYYY")}</Text>
                    </Td>
                </Tr>
            ))}
        </Tbody>
    );
};

export default PaymentRecordCitizenSection;
