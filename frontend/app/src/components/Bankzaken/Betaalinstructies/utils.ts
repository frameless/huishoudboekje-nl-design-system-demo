/* eslint-disable indent */
import {CreatePaymentRecord, PaymentExportRecordData, PaymentRecord} from "../../../generated/graphql"
import {Dictionary, formatBurgerName, getBurgerHhbId} from "../../../utils/things";



export function groupPaymentRecordsByCitizen(records: CreatePaymentRecord[], orderBy: undefined | ((a: CreatePaymentRecord, b: CreatePaymentRecord) => number) = undefined): Dictionary<PaymentRecord> {
	const result = new Dictionary<CreatePaymentRecord>(true)
	if (orderBy != undefined) {
		records = records.sort(orderBy)
	}
	records.forEach(record => {
		if (record.agreement?.burger != undefined) {
			result.Add(getCitizenWithHHBKey(record.agreement?.burger), record)
		}
	});
	return result;
}

export function groupPaymentExportRecordsByCitizen(records: PaymentExportRecordData[], orderBy: undefined | ((a: PaymentExportRecordData, b: PaymentExportRecordData) => number) = undefined): Dictionary<PaymentExportRecordData> {
	const result = new Dictionary<PaymentExportRecordData>(true)
	if (orderBy != undefined) {
		records = records.toSorted(orderBy)
	}
	records.forEach(record => {
		if (record.agreement?.burger != undefined) {
			result.Add(getCitizenWithHHBKey(record.agreement?.burger), record)
		}
	});
	return result;
}

export function orderByCitizenFieldExport(field: string, ascending: boolean ) {
	return (a: PaymentExportRecordData, b: PaymentExportRecordData) => {
		const aValue = a.agreement?.burger?.[field];
		const bValue = b.agreement?.burger?.[field];

		if (aValue !== undefined && bValue !== undefined) {
			const comparison = aValue < bValue ? -1 : 1;
			return ascending ? comparison : -comparison;
		}
		return 0;
	};
}



export function orderByCitizenField(field: string, ascending: boolean ) {
	return (a: CreatePaymentRecord, b: CreatePaymentRecord) => {
		const aValue = a.agreement?.burger?.[field];
		const bValue = b.agreement?.burger?.[field];

		if (aValue !== undefined && bValue !== undefined) {
			const comparison = aValue < bValue ? -1 : 1;
			return ascending ? comparison : -comparison;
		}
		return 0;
	};
}

function distinct(value, index, array) {
	return array.indexOf(value) === index
}

export function getUniqueCitizenKeys(paymentRecords) {
	const keys: string[] = []
	paymentRecords.forEach(record => {
		const name = getCitizenWithHHBKey(record.agreement?.burger);
		if (keys.indexOf(name) == -1) {
			keys.push(name)
		}
	});
	return keys;
}

export function getCitizenWithHHBKey(citizen) {
	return formatBurgerName(citizen) + "-" + getBurgerHhbId(citizen);
}
