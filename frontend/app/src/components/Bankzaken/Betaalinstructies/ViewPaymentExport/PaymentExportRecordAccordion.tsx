import {Accordion} from "@chakra-ui/react";
import {useState} from "react";
import PaymentExportRecordAccordionItem from "./PaymentExportRecordAccordionItem";

type PaymentExportRecordAccordionProps = {
	setTotal,
	pageSize,
	page,
	groupedPaymentRecords
};

const PaymentExportRecordAccordion: React.FC<PaymentExportRecordAccordionProps> = ({groupedPaymentRecords, setTotal, pageSize, page}) => {



	const initial: string[] = []
	const [openItems, setOpenItems] = useState(initial);

	function toggleAccordionItem(key) {
		const index = openItems.indexOf(key)
		if (index == -1) {
			setOpenItems(openItems.concat([key]))
		}
		else {
			setOpenItems(openItems.filter(item => item != key))
		}
	}

	function getIndices() {
		const keys = getPage()
		const result: number[] = []
		openItems.forEach(item => {
			result.push(keys.findIndex((key) => key == item))
		});
		return result;
	}
	setTotal(groupedPaymentRecords.GetKeys().length)

	function getPage() {
		const start = (page - 1) * pageSize
		const end = start + pageSize
		const keys = groupedPaymentRecords.GetKeys().slice(start, end)
		return keys
	}

	return (
		<Accordion index={getIndices()} allowMultiple>
			{getPage().map(key => (
				<PaymentExportRecordAccordionItem toggleAccordion={toggleAccordionItem} key={key} cardKey={key} data-id={key} records={groupedPaymentRecords.Entries[key]} />
			))}
		</Accordion>
	)
};

export default PaymentExportRecordAccordion;
