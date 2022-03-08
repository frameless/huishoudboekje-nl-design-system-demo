import "@utrecht/components/dist/heading-1/bem.css";
import "@utrecht/components/dist/table/bem.css";
import React from "react";
import {Banktransactie} from "./generated/graphql";
import d from "../utils/dayjs";
import {useTranslation} from "react-i18next";
import {Box, FormLabel, Stack, Text} from "@chakra-ui/react";
import BanktransactieListItem from "./BanktransactieListItem";

const BanktransactiesList: React.FC<{ transacties: Banktransactie[] }> = ({transacties}) => {
	const {t} = useTranslation();

	const current = new Date();
	const today = current.getFullYear() + "-" + ("0" + (current.getMonth() + 1)).slice(-2) + "-" + ("0" + current.getDate()).slice(-2);
	const yesterday = current.getFullYear() + "-" + ("0" + (current.getMonth() + 1)).slice(-2) + "-" + ("0" + (current.getDate() - 1)).slice(-2);

	const bt = transacties.reduce((result, t) => {
		if (d(t.transactiedatum).year() === d().year()) {
			const trDateAsString = d(t.transactiedatum).format("dddd DD MMMM");
			return {
				...result,
				[trDateAsString]: [
					...(result[trDateAsString] || []),
					t,
				],
			};
		}
		else {
			const trDateAsString = d(t.transactiedatum).format("dddd LL");
			return {
				...result,
				[trDateAsString]: [
					...(result[trDateAsString] || []),
					t,
				],
			};
		}
	}, {});

	return (<>
		<h1 className={"utrecht-heading-1"}>Uw Huishoudboekje</h1>

		{transacties.length > 0 ? (
			<Stack>
				{Object.keys(bt).map((transactionDate, i) => {
					return (
						<Stack key={i}>
							<Box>
								<FormLabel>{
									transactionDate === today ? <Text>{t("date.today")}</Text>
										: transactionDate === yesterday ? <Text>{t("date.yesterday")}</Text>
											: transactionDate}
								</FormLabel>
							</Box>
							<Stack>
								{bt[transactionDate].map((transactie, i) => {
									return <BanktransactieListItem transactie={transactie} key={i} />;
								})}
							</Stack>
						</Stack>
					);
				})}
			</Stack>

		) : (
			<Text>Er zijn geen transacties gevonden.</Text>
		)};
	</>);
};

export default BanktransactiesList;