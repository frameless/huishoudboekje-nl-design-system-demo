import {Box, FormLabel, HStack, Stack, Switch, Text, VStack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Afspraak, useGetNotReconciledRecordsForAgreementsLazyQuery, useGetNotReconciledRecordsForAgreementsQuery} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import {currencyFormat2, Dictionary} from "../../../utils/things";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import AfspraakTableRow from "../../Afspraken/AfspraakTableRow";


const CitizenAgreementTable: React.FC<{agreements: Afspraak[]}> = ({agreements}) => {
    const {t} = useTranslation();

    const $records = useGetNotReconciledRecordsForAgreementsQuery({
        variables: {
            input: {
                agreementIds: agreements.map(agreement => agreement.uuid)
            }
        },
        fetchPolicy: "cache-and-network"
    })


    function sortAgreements(a: Afspraak, b: Afspraak) {
		const aStartDate = a.betaalinstructie?.startDate
		const bStartDate = b.betaalinstructie?.startDate

		const aIsOneTimeAgreement = aStartDate !== undefined && aStartDate === a.betaalinstructie?.endDate
		const bIsOneTimeAgreement = bStartDate !== undefined &&  bStartDate === b.betaalinstructie?.endDate

		// First, sort by the one time agreements
		if (aIsOneTimeAgreement !== bIsOneTimeAgreement) {
			return aIsOneTimeAgreement ? -1 : 1;
		}

		// If both are one time agreements sort by date
		if (aIsOneTimeAgreement && bIsOneTimeAgreement) {
			return  d(aStartDate).unix() - d(bStartDate).unix() ;
		}

		//If not one time agreement keep same order
		return 0;
    }



    return (
        <Queryable query={$records} children={(data) => {
            const records = data.PaymentRecordService_GetRecordsNotReconciledForAgreements.data
            const recordDictionary = new Dictionary<any>()
            if (records != null) {
                records.forEach(record => {
                    recordDictionary.Add(record.agreementUuid, record)
                });
            }

            return (
                <>
                    {agreements.length > 0 && agreements.sort(sortAgreements).map((a) => (
                        <AfspraakTableRow key={a.id} data-id={a.id} afspraak={a} py={2} openPaymentRecords={recordDictionary.ContainsKey(a.uuid) ? recordDictionary.Entries[a.uuid] : undefined} />
                    ))}
                </>
            )
        }} />
    );
};

export default CitizenAgreementTable;
