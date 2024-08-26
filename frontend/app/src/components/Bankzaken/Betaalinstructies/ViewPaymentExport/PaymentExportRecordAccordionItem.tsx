import {Table, Thead, Tr, Heading, Th, AccordionItem, AccordionIcon, AccordionButton, AccordionPanel, Box, Stat, StatNumber, } from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import useToaster from "../../../../utils/useToaster";
import {PaymentRecord} from "../../../../generated/graphql";
import PaymentExportRecordCitizenSection from "./PaymentExportRecordCitizenSection";

type PaymentExportRecordAccordionItemProps = {
	records: PaymentRecord[],
	cardKey: string,
	toggleAccordion
}

const PaymentExportRecordAccordionItem: React.FC<PaymentExportRecordAccordionItemProps> = ({records, cardKey, toggleAccordion}) => {
	const {t} = useTranslation(["paymentrecords"]);
	const toast = useToaster();
	const recordIds: string[] = [];



	records.forEach(record => recordIds.push(record.id ?? ""))

	return (
		<AccordionItem overflow={"visible"} key={cardKey}>
			{({isExpanded}) => (
				<>
					<Box>
						<AccordionButton onClick={() => toggleAccordion(cardKey)}>
							<AccordionIcon />
							<Heading size="sm">{cardKey}</Heading>
							<Stat size={"sm"} textAlign={"right"}>
								<StatNumber fontSize={"small"} paddingEnd={8}>{records?.length}</StatNumber>
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
									</Tr>
								</Thead>
								<PaymentExportRecordCitizenSection records={records}/>
							</Table>
						)}
					</AccordionPanel>
				</>
			)}
		</AccordionItem>

	);
};

export default PaymentExportRecordAccordionItem;
