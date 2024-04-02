import {useLocation, useSearchParams} from "react-router-dom";
import _ from "lodash";
import {Burger, Huishouden, useGetHuishoudensQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import Page from "../../shared/Page";

import HuishoudenOverzicht from "./HuishoudenOverzicht";
import {useEffect, useState} from "react";
import {Box, Button, Card, FormControl, HStack, filter} from "@chakra-ui/react";
import Select from "react-select";
import {formatBurgerName, formatHuishoudenName, getBurgerHhbId, useReactSelectStyles} from "../../../utils/things";
import {useTranslation} from "react-i18next";
import d from "../../../utils/dayjs";
import {DateRange} from "../../../models/models";


const HuishoudenOverzichtIndex = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const {t} = useTranslation()
	const burgerIds = searchParams.get("burgerId")?.split(",").map(p => parseInt(p)) || JSON.parse(sessionStorage.getItem('overzicht-burgers') ?? `[]`);
	const [filterBurgerIds, setFilterBurgerIds] = useState<number[]>(burgerIds);

	const reactSelectStyles = useReactSelectStyles();
	const $huishoudens = useGetHuishoudensQuery({fetchPolicy: 'cache-and-network'});

	const {search: queryParams} = useLocation();

	useEffect(() => {
		sessionStorage.setItem('overzicht-burgers', JSON.stringify(filterBurgerIds))
	}, [filterBurgerIds])

	const range = sessionStorage.getItem('overzicht-daterange') && new URLSearchParams(queryParams).get("burgerId") == undefined ? JSON.parse(sessionStorage.getItem('overzicht-daterange') ?? '{}') : {from: d().subtract(3, 'month').startOf('month').toDate(), through: d().subtract(1, 'month').endOf('month').toDate()}

	const [dateRange, setDateRange] = useState<DateRange>(range)
	useEffect(() => {
		sessionStorage.setItem('overzicht-daterange', JSON.stringify(dateRange))
	}, [dateRange])


	return (
		<Queryable query={$huishoudens} children={data => {
			const burgers: Burger[] = data.burgers || [];
			const selectedBurgers = burgers.filter(b => filterBurgerIds.includes(b.id!));
			const burgers_filter = burgers.filter(b => filterBurgerIds.includes(b.id!)).map(b => ({
				key: b.id,
				value: b.id,
				label: formatBurgerName(b) + " " + getBurgerHhbId(b),
			}));
			const onSelectBurger = (value) => {
				setFilterBurgerIds(value ? value.map(v => v.value) : [])
				if (searchParams.has("burgerId")) {
					searchParams.delete("burgerId")
				}
			};

			return (
				<Page title="Huishouden Overzicht">
					<Card>
						<HStack margin={2}>
							<FormControl>
								<Select onChange={onSelectBurger} options={burgers.map(b => ({
									key: b.id,
									value: b.id,
									label: formatBurgerName(b) + " " + getBurgerHhbId(b),
								}))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllBurgers")} value={burgers_filter} />
							</FormControl>
							<Button paddingLeft={"2.5%"} paddingRight={"2.5%"} size={"md"} variant={"outline"} colorScheme={"primary"} onClick={((value) => setDateRange({from: d().subtract(3, 'month').startOf('month').toDate(), through: d().subtract(1, 'month').endOf('month').toDate()}))}>{t("overzicht.resetMonthView")}</Button>
						</HStack>
					</Card>
					{(selectedBurgers.length > 0) &&
						<HuishoudenOverzicht burgerIds={filterBurgerIds} burgers={selectedBurgers} dateRange={dateRange} changeDateCallback={moveMonthsByAmount}></HuishoudenOverzicht>
					}
					{(selectedBurgers.length == 0) &&
						<Box textColor={"red.500"}>
							{t("overzicht.noData")}
						</Box>
					}

				</Page>
			)
		}} />
	)
	function moveMonthsByAmount(amount: number) {
		const startDate = d(dateRange.from).subtract(amount, 'months').startOf('month').toDate()
		const endDate = d(dateRange.through).subtract(amount, 'months').endOf('month').toDate()

		setDateRange({from: startDate, through: endDate})
	}

}

export default HuishoudenOverzichtIndex;
