import {Button, Skeleton, Table, TableRowProps, Tbody, Td, useBreakpointValue} from "@chakra-ui/react";
import React, {forwardRef, useImperativeHandle} from "react";
import {useTranslation} from "react-i18next";
import {GetPaymentRecordsByIdDocument, useGetPaymentRecordsByIdQuery, useUpdatePaymentRecordProcessingDateMutation} from "../../../../generated/graphql";
import Queryable from "../../../../utils/Queryable";
import PaymentRecordRow from "./PaymentRecordRow";

type PaymentRecordCitizenSectionProps = {
    recordIds: string[];
    endDate: number | undefined;
    updateSelectedCount: () => void;
    updateInCache,
    inCache: string[],
    sectionKey: string;
};

export interface PaymentRecordCitizenSectionHandle {
    refetchRecords: () => void;
}

const PaymentRecordCitizenSection: React.FC<PaymentRecordCitizenSectionProps> = ({inCache, updateInCache, sectionKey, recordIds, endDate, updateSelectedCount}) => {
    const {t} = useTranslation(["paymentrecords"]);
    const isMobile = useBreakpointValue([true, null, null, false]);

    const $records = useGetPaymentRecordsByIdQuery({
        fetchPolicy: "cache-first",
        variables: {
            input: {
                ids: recordIds,
            },
        },
    });


    return (
        <Queryable query={$records} loading={<Tbody>
            <Td>
                <Skeleton data-test="skeleton" h={5} w={"100%"} marginBottom={2}></Skeleton>
            </Td>
            <Td>
                <Skeleton h={5} w={"100%"} marginBottom={2}></Skeleton>
            </Td>
            <Td>
                <Skeleton h={5} w={"100%"} marginBottom={2}></Skeleton>
            </Td>
            <Td>
                <Skeleton h={5} w={"100%"} marginBottom={2}></Skeleton>
            </Td>
            <Td>
                <Skeleton h={5} w={"100%"} marginBottom={2}></Skeleton>
            </Td>
        </Tbody>}>
            {(data) => {
                if (!inCache.includes(sectionKey)) {
                    $records.refetch();
                    updateInCache(sectionKey)
                }
                const records = data.PaymentRecordService_GetPaymentRecordsById.data;

                return (
                    <Tbody>
                        {records.map((record, key) => (
                            <PaymentRecordRow
                                sectionKey={sectionKey}
                                recordIndex={key}
                                updateSelectedCount={updateSelectedCount}
                                key={record.id}
                                data-id={record.id}
                                endDate={endDate}
                                record={record}
                                py={2}
                            />
                        ))}
                    </Tbody>
                );
            }}
        </Queryable>
    );
};

export default PaymentRecordCitizenSection;
