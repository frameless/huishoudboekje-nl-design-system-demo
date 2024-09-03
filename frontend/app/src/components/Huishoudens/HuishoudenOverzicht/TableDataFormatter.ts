import {date} from "zod"
import {Afspraak, BankTransaction, GetHuishoudenOverzichtQuery} from "../../../generated/graphql"
import d from "../../../utils/dayjs"

export type PaymentEntry = {
    Date: string
    Amount: string
    TransactionId: string
    Transaction: BankTransaction
}

export type AgreementEntry = {
    Description: string
    Agreement: Afspraak
    BurgerId: number
    Payments: Record<string, PaymentEntry[]>
}

export type OrganisationEntry = {
    Organisation: string,
    Agreements: AgreementEntry[]

}

export type Month = {
    name: string
    year: string
}


export function formatTableData(input, startDate, endDate): OrganisationEntry[] {
    const organisationEntries: OrganisationEntry[] = []
    const months: Month[] = getMonthsBetween(startDate, endDate)
    for (const overviewEntry of input) {
        const organisationName = overviewEntry.rekeninghouder
        if (d(overviewEntry.validFrom).format('YYYY-MM-DD') <= endDate && (overviewEntry.validThrough == null ? true : d(overviewEntry.validThrough).format('YYYY-MM-DD') >= startDate)) {
            let orgIndex = organisationEntries.findIndex(entry => entry.Organisation === organisationName)
            if (orgIndex == -1) {
                organisationEntries.push({Agreements: [], Organisation: organisationName})
                orgIndex = organisationEntries.length - 1;
            }
            const payments: Record<string, PaymentEntry[]> = {}
            for (const month of months) {
                payments[month.name] = []
            }
            for (const transaction of overviewEntry.transactions) {
                const monthName = getMonthName(d(transaction.transactieDatum))
                const payment: PaymentEntry = {Date: transaction.transactieDatum, Amount: transaction.bedrag, TransactionId: transaction.uuid, Transaction: transaction}
                if (payments[monthName] != undefined) {
                    payments[monthName].push(payment)
                }
            }
            const agreement: AgreementEntry = {Agreement: overviewEntry, Description: overviewEntry.omschrijving, Payments: payments, BurgerId: overviewEntry.burgerId}
            organisationEntries[orgIndex].Agreements.push(agreement)
            organisationEntries[orgIndex].Agreements.sort((a, b) => a.Agreement.omschrijving?.localeCompare(b.Agreement.omschrijving ?? "") ?? 0)
        }

    }
    organisationEntries.sort((a, b) => (a.Organisation.localeCompare(b.Organisation)))
    return organisationEntries
}


export function getMonthName(date): string {
    return new Intl.DateTimeFormat('nl-NL', {month: 'long'}).format(date)
}

function getMonthYear(date): string {
    return new Intl.DateTimeFormat('nl-NL', {year: 'numeric'}).format(date)
}

export function getMonthByNumber(month: number): Month {
    const date = new Date().setMonth(month - 1)
    return {name: getMonthName(date), year: getMonthYear(date)}
}

export function getMonthsBetween(start, end): Month[] {
    const months: Month[] = [];
    const currentDate = new Date(start);
    const endDate = new Date(end)
    while (currentDate <= endDate) {
        const monthName = getMonthName(currentDate);
        const year = getMonthYear(currentDate)
        months.push({name: monthName, year: year});
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
}