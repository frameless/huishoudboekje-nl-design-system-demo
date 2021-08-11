import {Box, Divider, HStack, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {BankTransaction} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {currencyFormat2} from "../../utils/things";
import {FormLeft, FormRight} from "../Layouts/Forms";
import {createAggregation, Type} from "./Aggregator";

type BalanceTableProps = {transactions: BankTransaction[], startDate: string, endDate: string};

const BalanceTable: React.FC<BalanceTableProps> = ({transactions, startDate, endDate}) => {
	const {t} = useTranslation();
	const [, aggregationByOrganisatie, saldo] = createAggregation(transactions);

	const translatedCategory = {
		[Type.Inkomsten]: t("charts.inkomstenUitgaven.income"),
		[Type.Uitgaven]: t("charts.inkomstenUitgaven.expenses"),
	};

	return (
		<Stack direction={["column", "row"]}>
			<FormLeft title={t("balance")} />
			<FormRight>
				<Stack spacing={4}>
					<Text>
						<Trans i18nKey={"reports.period"} components={{strong: <strong />}} values={{
							from: d(startDate, "L").startOf("day").format("L"),
							through: d(endDate, "L").endOf("day").format("L"),
						}} />
					</Text>

					{Object.keys(aggregationByOrganisatie).map(c => {
						const categories = Object.keys(aggregationByOrganisatie[c]).sort();
						let total = 0;
						return (
							<Stack key={c} spacing={0}>
								<Text fontWeight={"bold"}>{translatedCategory[c]}</Text>
								{categories.map((r, i) => {
									total += aggregationByOrganisatie[c][r];
									return (
										<Stack direction={"row"} key={i}>
											<Box flex={2}>
												<Text>{r === Type.Ongeboekt ? t("charts.inkomstenUitgaven.unbooked") : r}</Text>
											</Box>
											<Box flex={1} textAlign={"right"}>
												<Text fontWeight={"bold"}>{currencyFormat2(false).format(Math.abs(aggregationByOrganisatie[c][r]))}</Text>
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
		</Stack>
	);
};

export default BalanceTable;