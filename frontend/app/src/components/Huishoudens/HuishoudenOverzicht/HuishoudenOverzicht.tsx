import {
	Button, Card, Flex, Spacer, Stack, Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer, Tag, useDisclosure, IconButton, Text, Box, useTheme, VStack
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useLocation, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Burger, Huishouden, useGetHuishoudenOverzichtQuery, useGetHuishoudenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {currencyFormat2, formatHuishoudenName} from "../../../utils/things";
import BackButton from "../../shared/BackButton";
import Page from "../../shared/Page";
import {ArrowLeftIcon, ArrowRightIcon} from "@chakra-ui/icons";
import d from "../../../utils/dayjs";
import {formatTableData, AgreementEntry, PaymentEntry, OrganisationEntry, getMonthsBetween, getMonthByNumber} from "./TableDataFormatter";
import {DateRange} from "../../../models/models";
import TransactieOverzichtPopover from "./Popovers/TransactieOverzichtPopover";
import AfspraakOverzichtPopover from "./Popovers/AfspraakOverzichtPopover";


type BalanceTableProps = {burgerIds: number[], burgers: Burger[]};

const HuishoudenOverzicht: React.FC<BalanceTableProps> = ({burgerIds, burgers}) => {
	const {t} = useTranslation();
	const {search: queryParams} = useLocation();

	const range = sessionStorage.getItem('overzicht-daterange') ? JSON.parse(sessionStorage.getItem('overzicht-daterange') ?? '{}') : {from: d().subtract(4, 'month').startOf('month').toDate(), through: d().subtract(0, 'month').endOf('month').toDate()}

	// This table shows 3 months, but we eager load 5 months here so that there is a smooth transition to the next month
	const [dateRange, setDateRange] = useState<DateRange>(range)

	const $overzicht = useGetHuishoudenOverzichtQuery({fetchPolicy: 'cache-and-network', variables: {burgers: burgerIds, start: d(dateRange.from).format('YYYY-MM-DD'), end: d(dateRange.through).format('YYYY-MM-DD')}})
	const months = getMonthsBetween(d(dateRange.from).format('YYYY-MM-DD'), d(dateRange.through).format('YYYY-MM-DD'))

	useEffect(() => {
		sessionStorage.setItem('overzicht-daterange', JSON.stringify(dateRange))
	}, [dateRange])

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

	function getPaymentRowWithStyling(payments: Record<string, PaymentEntry[]>, index, isLastInAgreements, isLastInOrganisations) {
		const paymentRow: JSX.Element[] = []
		paymentRow.push(stylePaymentRow(getPaymentAmountOrEmpty(payments[months[1].name], index), getCorrectTextColorFromPayments(payments[months[1].name], index), isLastInAgreements, isLastInOrganisations))
		paymentRow.push(stylePaymentRow(getPaymentAmountOrEmpty(payments[months[2].name], index), getCorrectTextColorFromPayments(payments[months[2].name], index), isLastInAgreements, isLastInOrganisations))
		paymentRow.push(stylePaymentRow(getPaymentAmountOrEmpty(payments[months[3].name], index), getCorrectTextColorFromPayments(payments[months[3].name], index), isLastInAgreements, isLastInOrganisations))

		return paymentRow;
	}

	function moveMonthsByAmount(amount: number) {
		const startDate = d(dateRange.from).subtract(amount, 'months').toDate()
		const endDate = d(dateRange.through).subtract(amount, 'months').toDate()

		setDateRange({from: startDate, through: endDate})
	}


	return (
		<Queryable query={$overzicht} children={data => {

			// we only want the months 2 till 4 from the data formatted. This function will check if the afspraak is active within these months
			const formattedData: OrganisationEntry[] = formatTableData(data.overzicht.afspraken, d(dateRange.from).subtract(-1, 'month').startOf('month').format('YYYY-MM-DD'), d(dateRange.through).subtract(1, 'month').endOf('month').format('YYYY-MM-DD'))
			const saldos = data.overzicht.saldos

			// HTML is dymanically generated here because of JSX limitations. For the use of rowSpan it is necesary that the next <Tr> is defined with only the not-yet-filled
			// columns in the row. This EXCLUDES rows that are filled by rowSpan. This is not an issue if a <Tr> could be dynamically closed. Unfortunately, this is not possible.
			// A <Tr> requires a </Tr> in the same scope, it is not possible to close it dynamically when needed (with say an if statement). So every row has to be dynamically generated
			// based on it's conditions instead... This goes for inline-ts/html and for pushing <Tr>'s into an array. That said, why start generating all the way at the payment section:
			// The conditions are such that if a payment is the first of an agreement, this requires a new agreement column. The same for agreements and organisations
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


			return (
				<Card w={'100%'}>
					<TableContainer>
						<Table variant="unstyled" className="table-overzicht">
							<Thead>
								<Tr>
									<Th textAlign={"left"}>Tegenrekening</Th>
									<Th textAlign={"left"}>Afspraak</Th>
									<Th className="small"><IconButton aria-label="move left" onClick={(value) => moveMonthsByAmount(1)} icon={<ArrowLeftIcon />}></IconButton></Th>
									<Th textAlign={"right"}><VStack><Box>{months[1].name}</Box><Box fontWeight={"semibold"}>{months[1].year}</Box></VStack></Th>
									<Th textAlign={"right"}><VStack><Box>{months[2].name}</Box><Box fontWeight={"semibold"}>{months[2].year}</Box></VStack></Th>
									<Th textAlign={"right"}><VStack><Box>{months[3].name}</Box><Box fontWeight={"semibold"}>{months[3].year}</Box></VStack></Th>
									<Th className="small"><IconButton aria-label="move right" onClick={(value) => moveMonthsByAmount(-1)} icon={<ArrowRightIcon />}></IconButton></Th>
								</Tr>
							</Thead>
							<Tbody >
								{renderTableRows(formattedData)}

								<Tr className="divider-dark-top">
									<Td fontWeight={"bold"} className="divider-light">Mutaties in periode</Td>
									<Td className="divider-light"></Td>
									<Td className="divider-light"></Td>
									<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[1].mutatie)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[1].mutatie)}</Td>
									<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[2].mutatie)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[2].mutatie)}</Td>
									<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[3].mutatie)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[3].mutatie)}</Td>
									<Td className="divider-light"></Td>
								</Tr>
								<Tr className="divider-light" >
									<Td fontWeight={"bold"} className="divider-light" >Saldo start van periode</Td>
									<Td className="divider-light" ></Td>
									<Td className="divider-light" ></Td>
									<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[1].startSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[1].startSaldo)}</Td>
									<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[2].startSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[2].startSaldo)}</Td>
									<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[3].startSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[3].startSaldo)}</Td>
									<Td fontWeight={"bold"} className="divider-light"></Td>
								</Tr>
								<Tr className="divider-dark-top">
									<Td fontWeight={"bold"} className="divider-light" >Saldo einde van periode</Td>
									<Td className="divider-light" ></Td>
									<Td className="divider-light" ></Td>
									<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[1].eindSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[1].eindSaldo)}</Td>
									<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[2].eindSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[2].eindSaldo)}</Td>
									<Td fontWeight={"bold"} textColor={getCorrectTextColorFromAmount(saldos[3].eindSaldo)} className="divider-light" textAlign={"right"}>€ {currencyFormat2(false).format(saldos[3].eindSaldo)}</Td>
									<Td className="divider-light" ></Td>

								</Tr>

							</Tbody>
						</Table>
					</TableContainer>
				</Card>
			)
		}} />
	);
}


export default HuishoudenOverzicht;