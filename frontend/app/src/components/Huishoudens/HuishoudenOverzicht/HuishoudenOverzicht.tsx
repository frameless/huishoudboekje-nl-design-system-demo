import {
	Card,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer, IconButton, Box, VStack, Spinner
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";
import {Burger, GetHuishoudenOverzichtDocument, useGetHuishoudenOverzichtLazyQuery, useGetHuishoudenOverzichtQuery} from "../../../generated/graphql";
import Queryable, {Loading} from "../../../utils/Queryable";
import {currencyFormat2} from "../../../utils/things";
import {ArrowLeftIcon, ArrowRightIcon} from "@chakra-ui/icons";
import d from "../../../utils/dayjs";
import {formatTableData, AgreementEntry, PaymentEntry, OrganisationEntry, getMonthsBetween, getMonthName} from "./TableDataFormatter";
import {DateRange} from "../../../models/models";
import TransactieOverzichtPopover from "./Popovers/TransactieOverzichtPopover";
import AfspraakOverzichtPopover from "./Popovers/AfspraakOverzichtPopover";
import HuishoudenOverzichtTable from "./HuishoudenOverzichtTable";
import {useLazyQuery, useQuery} from "@apollo/client";


type BalanceTableProps = {burgerIds: number[], burgers: Burger[]};

const HuishoudenOverzicht: React.FC<BalanceTableProps> = ({burgerIds, burgers}) => {
	const {t} = useTranslation();
	const {search: queryParams} = useLocation();
	const [isLoading, setIsLoading] = useState<boolean>(false)


	const range = sessionStorage.getItem('overzicht-daterange') && new URLSearchParams(queryParams).get("burgerId") == undefined ? JSON.parse(sessionStorage.getItem('overzicht-daterange') ?? '{}') : {from: d().subtract(3, 'month').startOf('month').toDate(), through: d().subtract(1, 'month').endOf('month').toDate()}

	const [dateRange, setDateRange] = useState<DateRange>(range)

	const {loading, error, data} = useQuery(GetHuishoudenOverzichtDocument, {variables: {burgers: burgerIds, start: d(dateRange.from).format('YYYY-MM-DD'), end: d(dateRange.through).format('YYYY-MM-DD')}, fetchPolicy: "network-only"})
	const months = getMonthsBetween(d(dateRange.from).format('YYYY-MM-DD'), d(dateRange.through).format('YYYY-MM-DD'))
	let columnCount = 1

	useEffect(() => {
		sessionStorage.setItem('overzicht-daterange', JSON.stringify(dateRange))
	}, [dateRange])

	function getFormattedData(data) {
		const formatted = formatTableData(data.overzicht.afspraken, d(dateRange.from).startOf('month').format('YYYY-MM-DD'), d(dateRange.through).endOf('month').format('YYYY-MM-DD'))
		columnCount = formatted.length
		return formatted
	}
	return (
		<Card w={'65vw'}>
			<TableContainer>
				<Table variant="unstyled" className="table-overzicht">
					<Thead>
						<Tr>
							<Th w={"20vw"} textAlign={"left"}>{t("overzicht.tegenrekening")}</Th>
							<Th w={"20vw"} textAlign={"left"}>{t("overzicht.afspraak")}</Th>
							<Th w={"5vw"} className="small"><IconButton aria-label="move left" onClick={(value) => moveMonthsByAmount(1)} icon={<ArrowLeftIcon />}></IconButton></Th>
							<Th w={"5vw"} textAlign={"right"}><VStack><Box>{months[0].name}</Box><Box fontWeight={"semibold"}>{months[0].year}</Box></VStack></Th>
							<Th w={"5vw"} textAlign={"right"}><VStack><Box>{months[1].name}</Box><Box fontWeight={"semibold"}>{months[1].year}</Box></VStack></Th>
							<Th w={"5vw"} textAlign={"right"}><VStack><Box>{months[2].name}</Box><Box fontWeight={"semibold"}>{months[2].year}</Box></VStack></Th>
							<Th w={"5vw"} className="small"><IconButton aria-label="move right" onClick={(value) => moveMonthsByAmount(-1)} icon={<ArrowRightIcon />}></IconButton></Th>
						</Tr>
					</Thead>
					{!loading &&
						< HuishoudenOverzichtTable
							afspraken={getFormattedData(data)}
							saldos={data.overzicht.saldos}
							daterange={dateRange}
							burgers={burgers}
							loading={false}
							months={months} />
					}
					{loading &&
						<Tbody>
							<Tr>
								<Td>
									<Box>
										<Spinner
											thickness='4px'
											speed='0.65s'
											emptyColor='gray.200'
											color='blue.500'
											size="xl"
										/>
									</Box>
								</Td>
							</Tr>
						</Tbody>
					}
				</Table>
			</TableContainer>
		</Card>
	);

	function moveMonthsByAmount(amount: number) {
		setIsLoading(true)
		const startDate = d(dateRange.from).subtract(amount, 'months').toDate()
		const endDate = d(dateRange.through).subtract(amount, 'months').toDate()

		setDateRange({from: startDate, through: endDate})
	}

}

export default HuishoudenOverzicht;