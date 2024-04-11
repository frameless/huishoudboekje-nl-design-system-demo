import {Text, Tabs, Stack, Tab, TabPanels, TabPanel, Box} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {BurgerRapportage, useGetBurgerRapportagesQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import SectionContainer from "../shared/SectionContainer";
import InkomstenUitgaven from "./InkomstenUitgaven";
import d from "../../utils/dayjs";
import BalanceTable from "./BalanceTable";
import { Granularity } from "./Aggregator";
import { useState } from "react";
import Saldo from "./Saldo";


type RapportageComponentParams = {burgerIds: number[], startDate: Date, endDate: Date, rubrieken: number[]};

const RapportageComponent: React.FC<RapportageComponentParams> = ({burgerIds, startDate, endDate, rubrieken}) => {
	const {t} = useTranslation();

	//Check here because it has to be correct data for the query
	const correctDate = startDate instanceof Date && endDate instanceof Date
	if (!correctDate) {
		const today = new Date()
		startDate = today
		endDate = today
	}

	const $rapportage = useGetBurgerRapportagesQuery({
		variables: {
			burgers: burgerIds,
			start: d(startDate).format("YYYY-MM-DD"),
			end: d(endDate).format("YYYY-MM-DD"),
			saldoDate: d(startDate).subtract(1, "day").format("YYYY-MM-DD"),
			rubrieken: rubrieken
		},
		fetchPolicy: "no-cache"
	});

	//Return here because react gives errors if it doesnt render the same amount of hooks (the query) each time
	if (!correctDate) {
		return (
			<Text color={"red"}>{t("reports.incorrectDateRange")}</Text>
		)
	}


	const [granularity, setGranularity] = useState<Granularity>(Granularity.Weekly);
	const granularityOptions = {
		[Granularity.Daily]: t("granularity.daily"),
		[Granularity.Weekly]: t("granularity.weekly"),
		[Granularity.Monthly]: t("granularity.monthly"),
	};

	return (
		<Queryable query={$rapportage} children={data => {
			const reports: [BurgerRapportage] = data.burgerRapportages || []
			const startSaldo: number = +data.saldo.saldo || 0
			return (
				<Box>
					<Stack className={"do-not-print"}>
						<SectionContainer>
							<Tabs isLazy variant={"solid"} align={"start"} colorScheme={"primary"}>
								<Stack direction={"row"} spacing={2}>
									<Tab>{t("balance")}</Tab>
									<Tab>{t("charts.saldo.title")}</Tab>
									<Tab>{t("charts.inkomstenUitgaven.title")}</Tab>
								</Stack>
								<TabPanels>
									<TabPanel className={"do-not-print"}>
										<BalanceTable transactions={reports} startDate={d(startDate)} endDate={d(endDate)} startSaldo={startSaldo} />
									</TabPanel>
									<TabPanel>
										<Saldo transactions={reports} startSaldo={startSaldo} granularity={granularity} setGranularity={setGranularity} granularityOptions={granularityOptions}/>
									</TabPanel>
									<TabPanel>
										<InkomstenUitgaven transactions={reports} granularity={granularity} setGranularity={setGranularity} granularityOptions={granularityOptions}/>
									</TabPanel>
								</TabPanels>
							</Tabs>
						</SectionContainer>
					</Stack>
					<Box className={"only-show-on-print print"}>
						<BalanceTable transactions={reports} startDate={d(startDate)} endDate={d(endDate)} startSaldo={startSaldo} />
					</Box>
				</Box>
			)
		}} />
	);
};

export default RapportageComponent;