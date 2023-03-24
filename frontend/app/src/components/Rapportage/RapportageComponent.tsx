import {Text, Tabs, Stack, Tab, TabPanels, TabPanel} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {BurgerRapportage, useGetBurgerRapportageQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import Saldo from "./Saldo";
import {humanJoin, formatBurgerName} from "../../utils/things";
import SectionContainer from "../shared/SectionContainer";
import InkomstenUitgaven from "./InkomstenUitgaven";
import d from "../../utils/dayjs";
import BalanceTable from "./BalanceTable";


type RapportageComponentParams = {burgerIds: number[], startDate: Date, endDate: Date};

const RapportageComponent: React.FC<RapportageComponentParams> = ({burgerIds, startDate, endDate}) => {
	const {t} = useTranslation();

	//Check here because it has to be correct data for the query
	const correctDate = startDate instanceof Date && endDate instanceof Date
	if (!correctDate) {
		const today = new Date()
		startDate = today
		endDate = today
	}
	let burgerId = -1
	if (burgerIds.length === 1) {
		burgerId = burgerIds[0]
	}

	const $rapportage = useGetBurgerRapportageQuery({
		variables: {
			burger: burgerId,
			start: d(startDate).format("YYYY-MM-DD"),
			end: d(endDate).format("YYYY-MM-DD")
		}
	});

	//Return here because react gives errors if it doesnt render the same amount of hooks (the query) each time
	if (!correctDate) {
		return (
			<Text color={"red"}>{t("reports.incorrectDateRange")}</Text>
		)
	}
	if (burgerId === -1) {
		return (
			<Text color={"red"}>{t("reports.toManyBurgers")}</Text>
		)
	}
	return (
		<Queryable query={$rapportage} children={data => {

			if (data.burgerRapportage === null) {
				return (
					<Text color={"red"}>{t("reports.noData")}</Text>
				);
			}

			const reports: [BurgerRapportage] = [data.burgerRapportage]

			return (
				<>
					<SectionContainer>
						<Tabs isLazy variant={"solid"} align={"start"} colorScheme={"primary"}>
							<Stack direction={"row"} spacing={2}>
								<Tab>{t("charts.saldo.title")}</Tab>
								<Tab>{t("charts.inkomstenUitgaven.title")}</Tab>
							</Stack>
							<TabPanels>
								<TabPanel>
									<Saldo transactions={reports} />
								</TabPanel>
								<TabPanel>
									<InkomstenUitgaven transactions={reports} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</SectionContainer>
					<BalanceTable transactions={reports} startDate={d(startDate).format("L")} endDate={d(endDate).format("L")} />
				</>
			)
		}} />
	);
};

export default RapportageComponent;