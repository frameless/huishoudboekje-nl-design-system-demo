import {Box, FormLabel, HStack, Stack, Stat, StatArrow, StatLabel, StatNumber, Switch, Text, VStack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Burger, PaymentRecord, useGetNotReconciledRecordsForAgreementsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {currencyFormat2} from "../../../utils/things";


const CitizenOpenPaymentRecordsSaldo: React.FC<{citizen: Burger}> = ({citizen}) => {
    const {t} = useTranslation("citizendetails");

    const $records = useGetNotReconciledRecordsForAgreementsQuery({
        variables: {
            input: {
                agreementIds: citizen.afspraken?.map(agreement => agreement.uuid)
            }
        },
        fetchPolicy: "cache-and-network"
    })


    return (
        <Queryable query={$records} children={(data) => {
            const records: PaymentRecord[] = data.PaymentRecordService_GetRecordsNotReconciledForAgreements.data

            let totalSaldo = 0;
            if (records != null) {
                records.forEach(record => {
                    totalSaldo += record.amount ?? 0
                });
            }

            return (
                <Stack>
                    <FormLabel>{t("openPayments")}</FormLabel>
                    <Stat>
                        {totalSaldo !== 0 && <StatArrow type={totalSaldo > 0 ? "increase" : "decrease"} />}
                        {currencyFormat2().format((totalSaldo / 100))}</Stat>
                </Stack>

            )
        }} />
    );
};

export default CitizenOpenPaymentRecordsSaldo;
