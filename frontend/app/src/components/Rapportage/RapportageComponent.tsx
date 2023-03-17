
import {Heading, Text, Stack, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {BurgerRapportage, useGetBurgerRapportageQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import Saldo from "./Saldo";
import {humanJoin, formatBurgerName} from "../../utils/things";
import SectionContainer from "../shared/SectionContainer";
import InkomstenUitgaven from "./InkomstenUitgaven";




type RapportageComponentParams = {burgerIds: number[], startDate: Date, endDate: Date};

const RapportageComponent: React.FC<RapportageComponentParams> = ({burgerIds, startDate, endDate}) => {
	const {t} = useTranslation();

	if (!(startDate instanceof Date && endDate instanceof Date)) {
		return (
			<p></p>
		)
	}

	let burgerId = -1
	if (burgerIds.length === 1) {
		burgerId = burgerIds[0]
	}

	const $rapportage = useGetBurgerRapportageQuery({
		variables: {
			burger: burgerId,
			start: startDate.toISOString().split('T')[0],
			end: endDate.toISOString().split('T')[0]
		}
	});
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
				<SectionContainer>
					<Tabs isLazy variant={"solid"} align={"start"} colorScheme={"primary"}>
						<Stack direction={"row"} as={TabList} spacing={2}>
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
				//<BalanceTable transactions={filteredTransactions} startDate={d(dateRange.from).format("L")} endDate={d(dateRange.through).format("L")} />
			)
		}} />
	);
};

export default RapportageComponent;