import {Box, Divider, HStack, Stack, Text, VStack} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {BurgerRapportage, Saldo} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {currencyFormat2} from "../../utils/things";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import {createBalanceTableAggregation, createSaldos, Offsets, Transaction, Type} from "./Aggregator";
import { Dayjs } from "dayjs";

type BalanceTableProps = {transactions: BurgerRapportage[], startDate: Dayjs, endDate: Dayjs, startSaldo: number, offsets: Offsets};

const BalanceTable: React.FC<BalanceTableProps> = ({transactions, startDate, endDate, startSaldo, offsets}) => {
	const {t} = useTranslation();
	const aggregationByOrganisatie: Transaction[] = createBalanceTableAggregation(startDate, transactions);
	const saldos = createSaldos(transactions, offsets)
	const saldoDate = d(endDate, "L")
	const translatedCategory = {
		[Type.Inkomsten]: t("charts.inkomstenUitgaven.income"),
		[Type.Uitgaven]: t("charts.inkomstenUitgaven.expenses"),
	};

	return (
		<SectionContainer>
			<Section title={t("balance")}> {/* Todo: Add helperText (07-03-2022) */}
				<Stack className={"print"}>
					<Stack spacing={2}>
						<Text className={"printweergave-space-bottom"}>
							<Trans i18nKey={"reports.period"} components={{strong: <strong />}} values={{
								from: startDate && d(startDate, "L").startOf("day").format("L"),
								through: endDate && d(endDate, "L").endOf("day").format("L"),
							}} />
						</Text>

						{Object.keys(aggregationByOrganisatie).map(category => {
							const total = saldos[category]
							return (
								<Stack key={category} spacing={3}>
									<Text fontWeight={"bold"}>{translatedCategory[category]}</Text>
									{Object.keys(aggregationByOrganisatie[category]).map((rubriek, rubriekKey) => {
										return (
											<VStack alignItems={"left"} key={`${category}:${rubriekKey}`} spacing={0}>
												<Box flex={1}>
													<Text fontStyle={"italic"}>{rubriek === Type.Ongeboekt ? t("charts.inkomstenUitgaven.unbooked") : rubriek}</Text>
												</Box>
												{Object.keys(aggregationByOrganisatie[category][rubriek]).map((transaction, key) => {
													return (
														<Stack direction={"row"} key={`${rubriekKey}:${key}`}>
															<Box flex={2} textAlign={"left"}>
																<Text >{aggregationByOrganisatie[category][rubriek][transaction].rekeninghouder}</Text>
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
									<HStack w="15%" textAlign={"right"} position={"relative"} left={"75%"}>
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
						<HStack w="15%" textAlign={"right"} position={"relative"} left={"85%"} alignItems={"center"}>
							<Divider borderColor={"black"} flex={1} pt={1} />
							<Text fontWeight={"bold"} flex={0}>-</Text>
						</HStack>
						<Stack direction={"row"}>
							<Box flex={2}>
								<Text>{t("total income expenses in period")}</Text>
							</Box>
							<Box flex={2} textAlign={"right"} paddingRight={"6%"} >
								<Text fontWeight={"bold"}>{`€ ${currencyFormat2(false).format(saldos['Total'])}`}</Text>
							</Box>
						</Stack>
						<HStack direction={"row"}>
							<Box flex={1} paddingTop={"30px"}>
								<Text>{t("end saldo at") + " " + saldoDate.format("L")}:
									{` € ${currencyFormat2(false).format(startSaldo + saldos['Total'])}`}</Text>
							</Box>
						</HStack>
					</Stack>
				</Stack>
			</Section>
		</SectionContainer>
	);
};

export default BalanceTable;