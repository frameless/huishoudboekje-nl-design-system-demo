import PaymentRecordAccordionItem from "./PaymentRecordAccordionItem";
import {Accordion} from "@chakra-ui/react";
import {useState} from "react";

type PaymentRecordAccordionProps = {
	endDate: number | undefined
	setTotal,
	pageSize,
	page,
	inCache,
	updateInCache,
	selectedItemsPerCitizen,
	setSelectedItemsPerCitizen,
	groupedPaymentRecords
};

const PaymentRecordAccordion: React.FC<PaymentRecordAccordionProps> = ({groupedPaymentRecords, selectedItemsPerCitizen, setSelectedItemsPerCitizen, inCache, updateInCache, endDate, setTotal, pageSize, page}) => {



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

	function changeSelected(key, value) {
		if (selectedItemsPerCitizen.GetKeys().includes(key) && selectedItemsPerCitizen.Entries[key].includes(value)) {
			selectedItemsPerCitizen.Remove(key, value);
		}
		else {
			selectedItemsPerCitizen.Add(key, value)
		}
		setSelectedItemsPerCitizen(selectedItemsPerCitizen)
	}

	return (
		<Accordion index={getIndices()} allowMultiple>
			{getPage().map(key => (
				<PaymentRecordAccordionItem inCache={inCache} updateInCache={updateInCache} toggleAccordion={toggleAccordionItem} selectedItems={selectedItemsPerCitizen.Entries[key]}
					updateSelectedItems={changeSelected} key={key} cardKey={key} data-id={key} endDate={endDate} records={groupedPaymentRecords.Entries[key]} />
			))}
		</Accordion>
	)
};

export default PaymentRecordAccordion;
