import {Text, Tabs, Stack, Tab, TabPanels, TabPanel} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {BurgerRapportage, Saldo as startSaldo, useGetBurgerRapportagesQuery, useGetSaldoClosestToQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import Saldo from "./Saldo";
import SectionContainer from "../shared/SectionContainer";
import InkomstenUitgaven from "./InkomstenUitgaven";
import d from "../../utils/dayjs";
import BalanceTable from "./BalanceTable";


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
			rubrieken: rubrieken
		}
	});

	const $saldoStart = useGetSaldoClosestToQuery({
		variables: {
			burger_ids: burgerIds,
			date: d(endDate).format("YYYY-MM-DD")
		},
		fetchPolicy: "cache-and-network"
	})

	//Return here because react gives errors if it doesnt render the same amount of hooks (the query) each time
	if (!correctDate) {
		return (
			<Text color={"red"}>{t("reports.incorrectDateRange")}</Text>
		)
	}

	return (
		<Queryable query={$rapportage} children={data => {
			if (data.burgerRapportages === null) {
				return (
					<Text color={"red"}>{t("reports.noData")}</Text>
				);
			}
			const reports: [BurgerRapportage] = data.burgerRapportages

			return (
				<Queryable query={$saldoStart} children={data => {
					const startSaldos: [startSaldo] = data.saldoClosest
					return (
						<Stack className="do-not-print">
							<SectionContainer>
								<Tabs isLazy variant={"solid"} align={"start"} colorScheme={"primary"}>
									<Stack direction={"row"} spacing={2}>
										<Tab>{t("charts.saldo.title")}</Tab>
										<Tab>{t("charts.inkomstenUitgaven.title")}</Tab>
									</Stack>
									<TabPanels>
										<TabPanel>
											<Saldo transactions={reports} startSaldos={startSaldos} />
										</TabPanel>
										<TabPanel>
											<InkomstenUitgaven transactions={reports} />
										</TabPanel>
									</TabPanels>
								</Tabs>
							</SectionContainer>
							<BalanceTable transactions={reports} startDate={d(startDate).format("L")} endDate={d(endDate).format("L")} startSaldos={startSaldos} />
						</Stack>
					)
				}} />
			)
		}} />
	);
};

export default RapportageComponent;