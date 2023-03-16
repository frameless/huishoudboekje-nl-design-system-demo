
import { BurgerRapportage, useGetBurgerRapportageQuery } from "../../generated/graphql";
import Queryable from "../../utils/Queryable";




type RapportageComponentParams = {burgerIds: number[], startDate: Date, endDate: Date};

const RapportageComponent: React.FC<RapportageComponentParams> = ({burgerIds, startDate, endDate}) => {

	if (!(startDate instanceof Date && endDate instanceof Date)){
		return (
			<p></p>
		)
	}

	if (burgerIds.length !==1){
		return (
			<p>Selecteer één burger</p>
		)
	}

	const $rapportage = useGetBurgerRapportageQuery({
		variables: {
			burger: burgerIds[0],
			start: startDate.toISOString().split('T')[0],
			end:  endDate.toISOString().split('T')[0]
		}
	});

	return (
		
				<Queryable query={$rapportage} children={data => {

					if (data.burgerRapportage === null){
						return (
							<p>Geen data</p>
						)
					}

					const reports : [BurgerRapportage] = [data.burgerRapportage]

					return (
						//Implementatie van de data weergeven volgt nog
						<p>Er is data</p>
						
						// <Heading size={"sm"} fontWeight={"normal"}>{selectedBurgers.length > 0 ? humanJoin(selectedBurgers.map(b => formatBurgerName(b))) : t("allBurgers")}</Heading>
						// <SectionContainer>
						// 	<Tabs isLazy variant={"solid"} align={"start"} colorScheme={"primary"}>
						// 		<Stack direction={"row"} as={TabList} spacing={2}>
						// 			<Tab>{t("charts.saldo.title")}</Tab>
						// 			<Tab>{t("charts.inkomstenUitgaven.title")}</Tab>
						// 		</Stack>
						// 		<TabPanels>
						// 			<TabPanel>
						// 				<Saldo transactions={filteredTransactions} />
						// 			</TabPanel>
						// 			<TabPanel>
						// 				<InkomstenUitgaven transactions={filteredTransactions} />
						// 			</TabPanel>
						// 		</TabPanels>
						// 	</Tabs>
						// </SectionContainer>
						//<BalanceTable transactions={filteredTransactions} startDate={d(dateRange.from).format("L")} endDate={d(dateRange.through).format("L")} />

					);
				}}/>
	);
};

export default RapportageComponent;