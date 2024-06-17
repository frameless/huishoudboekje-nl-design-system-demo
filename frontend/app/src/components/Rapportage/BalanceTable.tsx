import {Box, Divider, Heading, HStack, Stack, Text, VStack} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {BurgerRapportage} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {MathOperation, currencyFormat2, floatMathOperation, formatBurgerName, getBurgerHhbId, humanJoin} from "../../utils/things";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import {createBalanceTableAggregation, createSaldos, Transaction, Type} from "./Aggregator";
import {Dayjs} from "dayjs";

type BalanceTableProps = {transactions: BurgerRapportage[], selectedBurgers, startDate: Dayjs, endDate: Dayjs, startSaldo: number};

const BalanceTable: React.FC<BalanceTableProps> = ({transactions, selectedBurgers, startDate, endDate, startSaldo}) => {
	const {t} = useTranslation();
	const aggregationByOrganisatie: Transaction[] = createBalanceTableAggregation(startDate, transactions);
	const saldos = createSaldos(transactions)
	const saldoDate = d(endDate, "L")
	const translatedCategory = {
		[Type.Inkomsten]: t("charts.inkomstenUitgaven.income"),
		[Type.Uitgaven]: t("charts.inkomstenUitgaven.expenses"),
	};
	const dataFound = Object.keys(aggregationByOrganisatie).length !== 0
	return (
		<SectionContainer minHeight={"600px"}>
			<Section> {/* Todo: Add helperText (07-03-2022) */}
				<Stack className={"print"}>
					<Stack spacing={2}>
						<Stack spacing={1}>
							<Text className={"only-show-on-print print-title"}>{t("reports.title")}</Text>
							<Text className={"only-show-on-print printweergave"} size={"sm"} fontWeight={"normal"}>{selectedBurgers.length > 0 ? humanJoin(selectedBurgers.map(b => formatBurgerName(b) + " " + getBurgerHhbId(b))) : t("allBurgers")}</Text>
							<Text className={" only-show-on-print printweergave-periode pre-wrap"}>
								<Trans i18nKey={"reports.period"} components={{strong: <strong />}} values={{
									from: startDate && d(startDate, "L").startOf("day").format("L"),
									through: endDate && d(endDate, "L").endOf("day").format("L"),
								}} />
							</Text>
						</Stack>
						{dataFound && (<>
							{Object.keys(aggregationByOrganisatie).map(category => {
								const total = saldos[category]
								return (
									<Stack key={category} spacing={3}>
										<Text fontWeight={"bold"}>{translatedCategory[category]}</Text>
										{Object.keys(aggregationByOrganisatie[category]).sort((a, b) => a.localeCompare(b)).map((rubriek, rubriekKey) => {
											return (
												<VStack alignItems={"left"} key={`${category}:${rubriekKey}`} spacing={0}>
													<Box flex={1}>
														<Text fontStyle={"italic"}>{rubriek === Type.Ongeboekt ? t("charts.inkomstenUitgaven.unbooked") : rubriek}</Text>
													</Box>
													{Object.keys(aggregationByOrganisatie[category][rubriek]
														.sort((a, b) =>
															d(a.transactieDatum).isSame(d(b.transactieDatum)) ?
																Math.abs(b.bedrag) - Math.abs(a.bedrag) :
																d(a.transactieDatum).isAfter(d(b.transactieDatum)) ? 1 : -1))
														.map((transaction, key) => {
															return (
																<Stack direction={"row"} key={`${rubriekKey}:${key}`}>
																	<Box flex={2} textAlign={"left"}>
																		<Text className={"break-line"}>{aggregationByOrganisatie[category][rubriek][transaction].rekeninghouder}</Text>
																	</Box>
																	<Box>
																		<Text>{d(aggregationByOrganisatie[category][rubriek][transaction].transactieDatum).format("DD-MM-YYYY")}</Text>
																	</Box>
																	<Box flex={2} textAlign={"right"}>
																		<Text paddingRight={"35%"}>{`€ ${currencyFormat2(false).format(Math.abs(aggregationByOrganisatie[category][rubriek][transaction].bedrag))}`}</Text>
																	</Box>
																</Stack>);
														})};
												</VStack>
											);
										})}
										<HStack w={"15%"} textAlign={"right"} position={"relative"} left={"75%"}>
											<Divider borderColor={"black"} flex={1} pt={1} />
											<Text fontWeight={"bold"} flex={0}>+</Text>
										</HStack>
										<Stack paddingBottom={5} direction={"row"}>
											<Box flex={1}>
												<Text className={"do-not-print"}>{t(`total ${category}`)}</Text>
											</Box>
											<Box flex={2} textAlign={"right"}>
												<Text paddingRight={"6%"} fontWeight={"bold"}>{`€ ${currencyFormat2(false).format(Math.abs(total))}`}</Text>
											</Box>
										</Stack>
									</Stack>
								);
							})}
							<HStack w={"15%"} textAlign={"right"} position={"relative"} left={"85%"} alignItems={"center"}>
								<Divider borderColor={"black"} flex={1} pt={1} />
								<Text fontWeight={"bold"} flex={0}>-</Text>
							</HStack>
							<Stack direction={"row"}>
								<Box flex={2}>
									<Text>{t("total income expenses in period")}</Text>
								</Box>
								<Box flex={2} textAlign={"right"} paddingRight={"6%"} >
									<Text fontWeight={"bold"}>{`€ ${currencyFormat2(false).format(saldos.Total)}`}</Text>
								</Box>
							</Stack>
						</>)}
						{!dataFound && (<Text paddingTop={"30px"} >{t("reports.noData")}</Text>)}
						<HStack direction={"row"}>
							<Box flex={1} paddingTop={"30px"}>
								<Text>{t("end saldo at") + " " + saldoDate.format("L")}:
									{` € ${currencyFormat2(false).format(floatMathOperation(startSaldo, saldos.Total, 2, MathOperation.Plus))}`}</Text>
							</Box>
						</HStack>
					</Stack>
				</Stack>
			</Section>
		</SectionContainer>
	);
};

export default BalanceTable;