import {
	Card,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer, IconButton, Box, VStack
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";
import {Burger, useGetHuishoudenOverzichtQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {currencyFormat2} from "../../../utils/things";
import {ArrowLeftIcon, ArrowRightIcon} from "@chakra-ui/icons";
import d from "../../../utils/dayjs";
import {formatTableData, AgreementEntry, PaymentEntry, OrganisationEntry, getMonthsBetween, getMonthName, Month} from "./TableDataFormatter";
import {DateRange} from "../../../models/models";
import TransactieOverzichtPopover from "./Popovers/TransactieOverzichtPopover";
import AfspraakOverzichtPopover from "./Popovers/AfspraakOverzichtPopover";


type OverzichtTableProps = {afspraken: any[], saldos: any[], loading: boolean, months: Month[], daterange: DateRange, burgers: Burger[]};

const HuishoudenOverzichtTable: React.FC<OverzichtTableProps> = ({afspraken, saldos, loading, months, daterange, burgers}) => {
	const {t} = useTranslation();

	function renderTableRows(data: OrganisationEntry[]) {
		const tableRows: any[] = []
		for (const organisation of data) {
			const organisatieRowspan = getRowspanForOrganisation(organisation)
			for (const agreementKey in organisation.Agreements) {
				const agreement = organisation.Agreements[agreementKey]
				const agreementRowspan = getRowspanForAfspraak(agreement)
				const isLastAgreementInOrganisation = +agreementKey + 1 == organisation.Agreements.length
				for (let paymentIndex = 0; paymentIndex < agreementRowspan; paymentIndex++) {
					const isLastBetalingInAgreement = paymentIndex === (agreementRowspan - 1);
					const isLastBetalingInOrganisation = isLastBetalingInAgreement && isLastAgreementInOrganisation
					const paymentRow = getPaymentRowWithStyling(agreement.Payments, paymentIndex, isLastBetalingInAgreement, isLastBetalingInOrganisation)
					// First payment && first agreement means we have reached a new organisation and must render the entire row
					if (+agreementKey === 0 && paymentIndex === 0) {
						tableRows.push(
							<Tr>
								<Td textAlign={"left"} verticalAlign={"top"} padding={5} rowSpan={organisatieRowspan} fontWeight={"bold"} className="divider-light">{organisation.Organisation}</Td>
								<Td textAlign={"left"} verticalAlign={"top"} padding={5} rowSpan={agreementRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}><AfspraakOverzichtPopover afspraak={agreement.Agreement} content={agreement.Description} burger={burgers.find(x => x.id == agreement.BurgerId)} /></Td>
								<Td textAlign={"left"} verticalAlign={"top"} padding={5} rowSpan={agreementRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}></Td>
								{paymentRow}
								<Td textAlign={"left"} verticalAlign={"top"} padding={5} rowSpan={agreementRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}></Td>
							</Tr>
						)
					}
					// If this is not the first agreement, but it is the first of an agreement section we must render the agreement column in the row
					else if (paymentIndex === 0) {
						tableRows.push(
							<Tr>
								<Td textAlign={"left"} verticalAlign={"top"} padding={5} rowSpan={agreementRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}><AfspraakOverzichtPopover afspraak={agreement.Agreement} content={agreement.Description} burger={burgers.find(x => x.id == agreement.BurgerId)} /></Td>
								<Td rowSpan={agreementRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}></Td>
								{paymentRow}
								<Td rowSpan={agreementRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}></Td>
							</Tr>
						)
					}
					// if it's not the first payment in an agreement section, and also not the first agreement in the organisation
					else {
						tableRows.push(
							<Tr>
								{paymentRow}
							</Tr>
						)
					}
				}
			}
		}
		return tableRows
	}
	const tableRows = renderTableRows(afspraken)

	return (
		<Tbody>
			{tableRows}
			<Tr className="divider-dark-top">
				<Td fontWeight={"bold"} className="divider-light">Mutaties in periode</Td>
				<Td className="divider-light"></Td>
				<Td className="divider-light"></Td>
				<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[0].mutatie)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[0].mutatie)}</Td>
				<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[1].mutatie)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[1].mutatie)}</Td>
				<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[2].mutatie)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[2].mutatie)}</Td>
				<Td className="divider-light"></Td>
			</Tr>
			<Tr className="divider-light" >
				<Td fontWeight={"bold"} className="divider-light" >Saldo start van periode</Td>
				<Td className="divider-light" ></Td>
				<Td className="divider-light" ></Td>
				<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[0].startSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[0].startSaldo)}</Td>
				<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[1].startSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[1].startSaldo)}</Td>
				<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[2].startSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[2].startSaldo)}</Td>
				<Td fontWeight={"bold"} className="divider-light"></Td>
			</Tr>
			<Tr className="divider-dark-top">
				<Td fontWeight={"bold"} className="divider-light" >Saldo einde van periode</Td>
				<Td className="divider-light" ></Td>
				<Td className="divider-light" ></Td>
				<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[0].eindSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[0].eindSaldo)}</Td>
				<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[1].eindSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[1].eindSaldo)}</Td>
				<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[2].eindSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[2].eindSaldo)}</Td>
				<Td className="divider-light" ></Td>
			</Tr>
		</Tbody>
	)

	function getPaymentRowWithStyling(payments: Record<string, PaymentEntry[]>, index, isLastInAgreements, isLastInOrganisations) {
		const paymentRow: JSX.Element[] = []
		paymentRow.push(stylePaymentRow(getPaymentAmountOrEmpty(payments[months[0].name], index), getCorrectTextColorFromPayments(payments[months[0].name], index), isLastInAgreements, isLastInOrganisations))
		paymentRow.push(stylePaymentRow(getPaymentAmountOrEmpty(payments[months[1].name], index), getCorrectTextColorFromPayments(payments[months[1].name], index), isLastInAgreements, isLastInOrganisations))
		paymentRow.push(stylePaymentRow(getPaymentAmountOrEmpty(payments[months[2].name], index), getCorrectTextColorFromPayments(payments[months[2].name], index), isLastInAgreements, isLastInOrganisations))

		return paymentRow;
	}

	function getRowspanForOrganisation(organisationData: OrganisationEntry) {
		let maxRowSpan = 0;
		for (const agreement of organisationData.Agreements) {
			maxRowSpan += getRowspanForAfspraak(agreement)
		}

		return Math.max(maxRowSpan, 1)
	}

	function getRowspanForAfspraak(agreementData: AgreementEntry) {
		let maxAgreementRowSpan = 0
		for (const key in agreementData.Payments) {
			const paymentCount = agreementData.Payments[key].length
			if (maxAgreementRowSpan < paymentCount) {
				maxAgreementRowSpan = paymentCount
			}
		}

		return Math.max(maxAgreementRowSpan, 1)
	}

	function getPaymentAmountOrEmpty(payments: PaymentEntry[], index) {
		if (payments) {
			if (payments.length > index) {
				const elements: any[] = [];
				elements.push(<TransactieOverzichtPopover bank_transaction={payments[index].Transaction} content={`€ ${currencyFormat2(false).format(+payments[index].Amount)}`} />)
				return elements
			}
		}
		return ""
	}

	function getCorrectDividerClass(isLastInAgreements, isLastInOrganisations) {
		if (isLastInAgreements || isLastInOrganisations) {
			return "divider-light"
		}
		return ""
	}

	function stylePaymentRow(content, textColor, isLastInAgreements, isLastInOrganisations) {
		const classes = getCorrectDividerClass(isLastInAgreements, isLastInOrganisations)
		return <Td textAlign={"right"} textColor={textColor} className={classes}>{content}</Td>
	}

	function getCorrectTextColorFromAmount(amount: number) {
		return amount > 0 ? "undefined" : "red.500"
	}

	function getCorrectTextColorFromPayments(payments, index) {
		if (payments) {
			if (payments.length > index) {
				return getCorrectTextColorFromAmount(+payments[index].Amount)
			}
		}
		return "undefined"
	}
}

export default HuishoudenOverzichtTable;