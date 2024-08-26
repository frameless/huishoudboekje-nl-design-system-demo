import {Card, Table, Tbody, Thead, Tr, Heading, CardHeader, CardBody, Th, Accordion, AccordionItem, AccordionIcon, AccordionButton, AccordionPanel, Box, Stat, StatHelpText, StatLabel, StatNumber, Stack, HStack} from "@chakra-ui/react";
import React, {forwardRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useReactSelectStyles} from "../../../../utils/things";
import useToaster from "../../../../utils/useToaster";
import {PaymentRecord} from "../../../../generated/graphql";
import PaymentRecordRow from "./PaymentRecordRow";
import PaymentRecordCitizenSection from "./PaymentRecordCitizenSection";

type PaymentRecordAccordionItemProps = {
	selectedItems: string[],
	updateSelectedItems,
	records: PaymentRecord[],
	endDate: number | undefined,
	cardKey: string,
	toggleAccordion,
	inCache: string[],
	updateInCache
}

const PaymentRecordAccordionItem: React.FC<PaymentRecordAccordionItemProps> = ({inCache, updateInCache, selectedItems, updateSelectedItems, endDate, records, cardKey, toggleAccordion}) => {
	const {t} = useTranslation(["paymentrecords"]);
	const toast = useToaster();
	const recordIds: string[] = [];



	records.forEach(record => recordIds.push(record.id ?? ""))

	return (
		<AccordionItem data-test="expand.instructionListItem" overflow={"visible"} key={cardKey}>
			{({isExpanded}) => (
				<>
					<Box>
						<AccordionButton onClick={() => toggleAccordion(cardKey)}>
							<AccordionIcon />
							<Heading size="sm">{cardKey}</Heading>
							<Stat size={"sm"} textAlign={"right"}>
								<StatNumber fontSize={"small"} paddingEnd={8}>{selectedItems?.length ?? 0} / {records?.length}</StatNumber>
							</Stat>
						</AccordionButton>
					</Box>
					<AccordionPanel pb={4}>
						{isExpanded && (
							<Table size={"sm"} variant={"noLeftPadding"}>
								<Thead>
									<Tr>
										<Th w={"35%"} textAlign={"left"}>{t("record.agreement")}</Th>
										<Th w={"35%"} textAlign={"left"}>{t("record.accountholder")}</Th>
										<Th w={"12.5%"} textAlign={"left"}>{t("record.amount")}</Th>
										<Th w={"12.5%"} textAlign={"left"}>{t("record.processAt")}</Th>
										<Th w={"5%"} textAlign={"end"}>Exporteer</Th>
									</Tr>
								</Thead>
								<PaymentRecordCitizenSection inCache={inCache} updateInCache={updateInCache} sectionKey={cardKey} updateSelectedCount={updateSelectedItems} recordIds={recordIds} endDate={endDate} ></PaymentRecordCitizenSection>
							</Table>
						)}
					</AccordionPanel>
				</>
			)}
		</AccordionItem>

	);
};

export default PaymentRecordAccordionItem;
