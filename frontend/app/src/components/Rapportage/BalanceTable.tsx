import {Box, Divider, HStack, Stack, Text, VStack} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {BurgerRapportage, RapportageTransactie} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {currencyFormat2} from "../../utils/things";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import {createBalanceTableAggregation, Transaction, Type} from "./Aggregator";

type BalanceTableProps = {transactions: BurgerRapportage[], startDate: string, endDate: string};

const BalanceTable: React.FC<BalanceTableProps> = ({transactions, startDate, endDate}) => {
	const {t} = useTranslation();
	const aggregationByOrganisatie: Transaction[] = createBalanceTableAggregation(transactions);
	const saldo = 0;

	const translatedCategory = {
		[Type.Inkomsten]: t("charts.inkomstenUitgaven.income"),
		[Type.Uitgaven]: t("charts.inkomstenUitgaven.expenses"),
	};

	return (
		<SectionContainer>

			<Section title={t("balance")}> {/* Todo: Add helperText (07-03-2022) */}
				<Stack>
					<Stack spacing={4}>
						<Text>
							<Trans i18nKey={"reports.period"} components={{strong: <strong />}} values={{
								from: startDate && d(startDate, "L").startOf("day").format("L"),
								through: endDate && d(endDate, "L").endOf("day").format("L"),
							}} />
						</Text>

						{Object.keys(aggregationByOrganisatie).map(category => {
							const total = 0;
							return (
								<Stack key={0} spacing={0}>
									<Text fontWeight={"bold"}>{translatedCategory[category]}</Text>
									{Object.keys(aggregationByOrganisatie[category]).map((rubriek, rubriekKey) => {
										return (
											<VStack alignItems={"left"} key={rubriekKey}>
												<Box flex={1}>
													<Text fontStyle={"italic"}>{rubriek === Type.Ongeboekt ? t("charts.inkomstenUitgaven.unbooked") : rubriek}</Text>
												</Box>
												{Object.keys(aggregationByOrganisatie[category][rubriek]).map((transaction, key) => {
													return (
														<Stack direction={"row"} key={key}>
															<Box flex={2} textAlign={"left"}>
																<Text >{aggregationByOrganisatie[category][rubriek][transaction].rekeninghouder}</Text>
															</Box>
															<Box flex={2} textAlign={"right"}>
																<Text fontWeight={"bold"}>{currencyFormat2(false).format(Math.abs(aggregationByOrganisatie[category][rubriek][transaction].bedrag))}</Text>
															</Box>

														</Stack>);
												})};
											</VStack>
										);
									})}
									<HStack alignItems={"center"}>
										<Divider borderColor={"black"} flex={1} pt={1} />
										<Text flex={0}>+</Text>
									</HStack>
									<Stack direction={"row"}>
										<Box flex={1}>
											<Text>{t("total")}</Text>
										</Box>
										<Box flex={2} textAlign={"right"}>
											<Text fontWeight={"bold"}>{currencyFormat2(false).format(Math.abs(total))}</Text>
										</Box>
									</Stack>
								</Stack>
							);
						})}

						<Stack direction={"row"}>
							<Box flex={1}>
								<Text>{t("saldo")}</Text>
							</Box>
							<Box flex={2} textAlign={"right"}>
								<Text fontWeight={"bold"}>{currencyFormat2(false).format(saldo)}</Text>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Section>
		</SectionContainer>
	);
};

export default BalanceTable;