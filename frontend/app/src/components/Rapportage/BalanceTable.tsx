import {Box, Divider, HStack, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {BankTransaction, Burger} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {currencyFormat2, formatBurgerName, humanJoin} from "../../utils/things";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Section from "../Layouts/Section";
import {createAggregation, Type} from "./Aggregator";

type BalanceTableProps = {transactions: BankTransaction[], selectedBurgers: Burger[], startDate: string, endDate: string};

const BalanceTable: React.FC<BalanceTableProps> = ({transactions, selectedBurgers, startDate, endDate}) => {
	const {t} = useTranslation();
	const burgerNamesList: string[] = selectedBurgers.map(b => formatBurgerName(b));
	const [, aggregationByRubriek, saldo] = createAggregation(transactions);

	const translatedCategory = {
		[Type.Inkomsten]: t("charts.inkomstenUitgaven.income"),
		[Type.Uitgaven]: t("charts.inkomstenUitgaven.expenses"),
	};

	return (
		<Section direction={["column", "row"]}>
			<FormLeft title={t("balance")} helperText={selectedBurgers.length > 0 ? humanJoin(burgerNamesList) : t("allBurgers")} />
			<FormRight>
				<Stack spacing={4}>
					<Text>
						<Trans i18nKey={"reports.period"} components={{strong: <strong />}} values={{
							from: d(startDate, "L").startOf("day").format("L"),
							through: d(endDate, "L").endOf("day").format("L"),
						}} />
					</Text>

					{Object.keys(aggregationByRubriek).map(c => {
						const categories = Object.keys(aggregationByRubriek[c]);
						let total = 0;
						return (
							<Stack key={c} spacing={0}>
								<Text fontWeight={"bold"}>{translatedCategory[c]}</Text>
								{categories.map((r, i) => {
									total += aggregationByRubriek[c][r];
									return (
										<Stack direction={"row"} key={i}>
											<Box flex={1}>
												<Text>{r === Type.Ongeboekt ? t("charts.inkomstenUitgaven.unbooked") : r}</Text>
											</Box>
											<Box flex={2} textAlign={"right"}>
												<Text fontWeight={"bold"}>{currencyFormat2(false).format(Math.abs(aggregationByRubriek[c][r]))}</Text>
											</Box>
										</Stack>
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
			</FormRight>
		</Section>
	);
};

export default BalanceTable;