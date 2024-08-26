import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useReactSelectStyles} from "../../../../utils/things";
import {PaymentRecord} from "../../../../generated/graphql";
import PaymentRecordList from "./PaymentRecordList";

type SelectedRecordsWrapperProps = {
    startDate: number | undefined,
    endDate: number | undefined,
    paymentRecords: PaymentRecord[] | undefined,
    loading: boolean,
    count: number,
    inCache,
    updateInCache
};

const SelectedRecordsWrapper: React.FC<SelectedRecordsWrapperProps> = ({inCache, updateInCache, loading, endDate, startDate, paymentRecords, count}) => {

    const {t} = useTranslation(["paymentrecords"]);
    const reactSelectStyles = useReactSelectStyles();

    function getInitialPaymentRecordIds(): string[] {
        const recordIndex: string[] = []
        paymentRecords?.forEach((record) => {
            recordIndex.push(record.id || "")
        });
        return recordIndex;
    }

    const [selectedPaymentRecords, setSelectedPaymentRecords] = useState(getInitialPaymentRecordIds() || [])

    function onChangeSelectedPaymentRecords(value) {
        const ids: string[] = [];
        value.forEach(id => {
            ids.push(id)
        })

        setSelectedPaymentRecords(ids);
    }


    function onClickSelectAll() {
        if (selectedPaymentRecords.length != count) {
            setSelectedPaymentRecords(getInitialPaymentRecordIds())
        }
        else {
            setSelectedPaymentRecords([])
        }
    }



    return (
        <>
            {!loading && paymentRecords != undefined &&
                <PaymentRecordList onClickSelectAll={onClickSelectAll} onChangeSelectedPaymentRecords={onChangeSelectedPaymentRecords} endDate={endDate}
                    paymentRecords={paymentRecords} loading={loading} count={count} inCache={inCache} updateInCache={updateInCache} selectedPaymentRecords={selectedPaymentRecords} startDate={startDate}></PaymentRecordList>
            }
        </>

    );
};

export default SelectedRecordsWrapper;


