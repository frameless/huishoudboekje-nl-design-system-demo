import {Box, Stack, Text} from "@chakra-ui/react";
import "@utrecht/components/dist/heading-1/bem.css";
import "@utrecht/components/dist/table/bem.css";
import React from "react";
import {useTranslation} from "react-i18next";
import d from "../utils/dayjs";
import BanktransactieListItem from "./BanktransactieListItem";
import {Banktransactie} from "../../generated/graphql";
import Divider from "@gemeente-denhaag/divider";

const BanktransactiesList: React.FC<{ transacties: Banktransactie[] }> = ({transacties}) => {
	const {t} = useTranslation();

	const bt = transacties.reduce((result, t) => {
		const trDateAsString = d(t.transactiedatum).format("YYYY-MM-DD");
		return {
			...result,
			[trDateAsString]: [
				...(result[trDateAsString] || []),
				t,
			],
		};
	}, {});

	const dateString = (date: Date): string => {
		const _date = d(date).startOf("day");
		const today = d().startOf("day");

		if (_date.isSame(today)) {
			return t("date.today");
		}

		if (_date.isSame(today.subtract(1, "day"))) {
			return t("date.yesterday");
		}

		const format = _date.year() !== d().year() ? "dddd D MMMM YYYY" : "dddd D MMMM";
		return d(date).format(format);
	};

	return (<>
		{transacties.length > 0 ? (
			<Stack pt={4}>
				{Object.keys(bt).map((transactionDate, i) => {
					return (
						<Stack key={i}>
							<Box>
								<Text color={"gray"} fontSize={"sm"}>{dateString(d(transactionDate, "YYYY-MM-DD").toDate())}</Text>
							</Box>
							<Stack>
								{bt[transactionDate].map((transactie, i) => {
									return <BanktransactieListItem transactie={transactie} key={i} />;
								})}
							</Stack>
							<Divider orientation={"horizontal"} />
						</Stack>
					);
				})}
			</Stack>

		) : (
			<Text>{t("message.zeroTransactions")}</Text>
		)};
	</>);
};

export default BanktransactiesList;