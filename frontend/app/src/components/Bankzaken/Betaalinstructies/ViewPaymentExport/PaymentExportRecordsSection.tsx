import {Text, Stack, HStack, FormControl} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {useTranslation} from "react-i18next";
import Section from "../../../shared/Section";
import SectionContainer from "../../../shared/SectionContainer";
import { useReactSelectStyles } from "../../../../utils/things";
import PaymentRecordsSortingButtons, { SortingValue, startValuesSorting } from "../sortingButtons";
import { PaymentExportRecordData } from "../../../../generated/graphql";
import { getCitizenWithHHBKey, getUniqueCitizenKeys, groupPaymentExportRecordsByCitizen, orderByCitizenField, orderByCitizenFieldExport } from "../utils";
import PaymentExportRecordAccordion from "./PaymentExportRecordAccordion";
import usePagination from "../../../../utils/usePagination";


type PaymentExportRecordsSectionProps = {
	paymentRecords: PaymentExportRecordData[]
};

const PaymentExportRecordsSection: React.FC<PaymentExportRecordsSectionProps> = ({paymentRecords}) => {
    const {t} = useTranslation(["paymentrecords"]);
	const reactSelectStyles = useReactSelectStyles();

	const selected: string[] = []
    const disctinctCitizens = getUniqueCitizenKeys(paymentRecords)

    const [sortingFilter, setSortingFilter] = useState(startValuesSorting)
	const [filterCitizen, setFilterCitizen] = useState(selected)
    
	const {offset, total, page, pageSize, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: 25});



    useEffect(() => {
        setGroupedPaymentRecords(getGroupedAndFilteredPaymentRecords(filterCitizen, sortingFilter.orderField, sortingFilter.ascending));
      }, [sortingFilter, filterCitizen]);


	const [groupedPaymentRecords, setGroupedPaymentRecords] = useState(getGroupedAndFilteredPaymentRecords(filterCitizen, sortingFilter.orderField, sortingFilter.ascending))

    function getGroupedAndFilteredPaymentRecords(filter, orderField, ascending) {
		if (filter.length == 0) {
			return groupPaymentExportRecordsByCitizen(paymentRecords, orderByCitizenFieldExport(orderField, ascending))
		}
		else {
			return groupPaymentExportRecordsByCitizen(paymentRecords.filter(record => filter.includes(getCitizenWithHHBKey(record.agreement?.burger))), orderByCitizenFieldExport(orderField, ascending))
		}
	}


	function handleSortingButtonClick(sortValue: SortingValue){
		setSortingFilter(sortValue)
	}

	function onSelectCitizen(value) {
		const result: string[] = []
		value.forEach(selected => {
			result.push(selected.value)
		});
		setFilterCitizen(result)
	}
	
	return (
        <SectionContainer>
            <Section>
                <Stack>
                    <FormControl w={"70%"}>
                        <Select 
                            onChange={onSelectCitizen} 
                            isClearable={true}
                            styles={reactSelectStyles.default}
                            isMulti
                            options={disctinctCitizens.map(citizen => ({
                                label: citizen,
                                value: citizen
                            }))}
							placeholder={t("filter.allBurgers")}
                        />
                    </FormControl>
                    <PaymentRecordsSortingButtons onClick={handleSortingButtonClick}/>
					<PaymentExportRecordAccordion groupedPaymentRecords={groupedPaymentRecords} page={page} pageSize={pageSize} setTotal={setTotal}/>
				</Stack>
                <HStack justify={"center"}>
				    <PaginationButtons />
                </HStack>
            </Section>
        </SectionContainer>
    );
};

export default PaymentExportRecordsSection;
