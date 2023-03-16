
import { useGetBurgerRapportageQuery } from "../../generated/graphql";
import Queryable from "../../utils/Queryable";




type RapportageComponentParams = {burgerIds: number[], startDate: Date, endDate: Date};

const RapportageComponent: React.FC<RapportageComponentParams> = ({burgerIds, startDate, endDate}) => {
	
	console.info(startDate.toISOString())
	console.info(endDate.toLocaleString().split(' ')[0])


	const $rapportage = useGetBurgerRapportageQuery({
		variables: {
			burger: burgerIds[0],
			start: startDate.toLocaleString().split(' ')[0],
			end:  endDate.toLocaleString().split(' ')[0]
		},
	});


	return (
		
				<Queryable query={$rapportage} children={data => {
					return (
						<p>idk</p>
						
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
						// <BalanceTable transactions={filteredTransactions} startDate={d(dateRange.from).format("L")} endDate={d(dateRange.through).format("L")} />

					);
				}}/>
	);
};

export default RapportageComponent;