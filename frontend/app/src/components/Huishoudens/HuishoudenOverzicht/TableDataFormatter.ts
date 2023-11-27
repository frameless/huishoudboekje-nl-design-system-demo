import {GetHuishoudenOverzichtQuery} from "../../../generated/graphql"
import d from "../../../utils/dayjs"

export type PaymentEntry = {
	Date: string
	Amount: string
	TransactionId: string
}

export type AgreementEntry = {
	Description: string
	Payments: Record<string, PaymentEntry[]>
}

export type OrganisationEntry = {
	Organisation: string,
	Agreements: AgreementEntry[]

}


export function formatTableData(input, startDate, endDate): OrganisationEntry[] {
	const organisationEntries: OrganisationEntry[] = []
	const months: string[] = getMonthsBetween(startDate, endDate)
	for (const overviewEntry of input) {
		const organisationName = overviewEntry.rekeninghouder
		let orgIndex = organisationEntries.findIndex(entry => {entry.Organisation == organisationName})
		if (orgIndex == -1) {
			organisationEntries.push({Agreements: [], Organisation: organisationName})
			orgIndex = organisationEntries.length - 1;
		}
		const payments: Record<string, PaymentEntry[]> = {}
		for (const month of months) {
			payments[month] = []
		}
		for (const transaction of overviewEntry.transactions) {
			const monthName = getMonthName(d(transaction.transactieDatum))
			const payment: PaymentEntry = {Date: transaction.transactieDatum, Amount: transaction.bedrag, TransactionId: transaction.id}
			payments[monthName].push(payment)
		}

		const agreement: AgreementEntry = {Description: overviewEntry.omschrijving, Payments: payments}
		organisationEntries[orgIndex].Agreements.push(agreement)

	}
	organisationEntries.sort((a, b) => (a.Organisation.localeCompare(b.Organisation)))

	return organisationEntries
}


function getMonthName(date): string {
	return new Intl.DateTimeFormat('en-US', {month: 'long'}).format(date);
}

function getMonthsBetween(start, end): string[] {
	const months: string[] = [];
	const currentDate = new Date(start);
	const endDate = new Date(end)
	while (currentDate <= endDate) {
		const monthName = getMonthName(currentDate);
		months.push(monthName);
		currentDate.setMonth(currentDate.getMonth() + 1);
	}

	return months;
}