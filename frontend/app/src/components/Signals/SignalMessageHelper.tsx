import {Trans, useTranslation} from "react-i18next"
import {Journaalpost, SignalData} from "../../generated/graphql"
import {currencyFormat2, formatBurgerName} from "../../utils/things"
import AuditLogLink from "../Gebeurtenissen/AuditLogLink"
import {AppRoutes} from "../../config/routes"
import {ListItem, UnorderedList} from "@chakra-ui/react"
import {t} from "i18next"

export function createSignalMessage(signal: SignalData) {
    let result = <Trans i18nKey={"signals.genericSignal"} />
    switch (signal.signalType) {
        case 1: {
            result = createDateSignalMessage(signal)
            break
        }
        case 2: {
            result = createAmountSignalMessage(signal)
            break
        }
        case 3: {
            result = createMultipleTransactionsSignalMessage(signal)
            break
        }
        case 4: {
            result = createNegativeSaldoSignalMessage(signal)
            break
        }
    }
    return result
}

function createDateSignalMessage(signal: SignalData) {
    const values = {
        agreementDescription: signal.agreement?.omschrijving,
        citizenName: formatBurgerName(signal.citizen),
    };
    const components = {
        agreementLink: getAgreementLink(signal),
        citizenLink: getCitizenLink(signal),
    };
    return <Trans i18nKey={"signals.dateSignalMessage"} values={values} components={components} />;
}

function createAmountSignalMessage(signal: SignalData) {
    const {t} = useTranslation();
    const journalEntries: Journaalpost[] = signal.journalEntries ? signal.journalEntries : []
    const journalEntry = journalEntries[0]
    const values = {
        amountDifference: signal.offByAmount ? currencyFormat2(true).format(signal.offByAmount / 100) : t("signals.amountUnknown"),
        agreementDescription: signal.agreement?.omschrijving,
        citizenName: formatBurgerName(signal.citizen),
        transactionAmount: journalEntry.transaction?.amount ? currencyFormat2(true).format(journalEntry.transaction?.amount / 100) : t("signals.amountUnknown")
    };
    const components = {
        strong: <strong />,
        agreementLink: getAgreementLink(signal),
        citizenLink: getCitizenLink(signal),
        transctionLink: getTransationLink(journalEntry),
    };
    return <Trans i18nKey={"signals.amountSignalMessage"} values={values} components={components} />;
}

function createMultipleTransactionsSignalMessage(signal: SignalData) {
    const values = {
        agreementDescription: signal.agreement?.omschrijving,
        citizenName: formatBurgerName(signal.citizen),
    };
    const components = {
        agreementLink: getAgreementLink(signal),
        citizenLink: getCitizenLink(signal),
        transctions: getTransactionLinks(signal),
    };
    return <Trans i18nKey={"signals.multipleTransactionsSignalMessage"} values={values} components={components} />;
}

function createNegativeSaldoSignalMessage(signal: SignalData) {
    const values = {
        citizenName: formatBurgerName(signal.citizen),
    };
    const components = {
        citizenLink: getCitizenLink(signal)
    };
    return <Trans i18nKey={"signals.negativeSaldoeSignalMessage"} values={values} components={components} />;
}

function getCitizenLink(signal: SignalData) {
    return <AuditLogLink to={AppRoutes.ViewBurger(String(signal.citizen?.id))}></AuditLogLink>
}

function getAgreementLink(signal: SignalData) {
    return <AuditLogLink to={AppRoutes.ViewAfspraak(String(signal.agreement?.id))}></AuditLogLink>
}

function getTransationLink(journalEntry: Journaalpost) {
    const transactionId = journalEntry.transaction?.id
    return <AuditLogLink to={AppRoutes.ViewTransactie(String(transactionId))}></AuditLogLink>
}

function getTransactionLinks(signal: SignalData) {
    const journalEntries: Journaalpost[] = signal.journalEntries ? signal.journalEntries : []
    return <UnorderedList>
        {journalEntries.map((entry) => (
            <ListItem><AuditLogLink to={AppRoutes.ViewTransactie(String(entry.transaction?.id))}>{entry.transaction?.amount ? currencyFormat2(true).format(entry.transaction?.amount / 100) : t("signals.amountUnknown")}</AuditLogLink></ListItem>
        ))}
    </UnorderedList>
}