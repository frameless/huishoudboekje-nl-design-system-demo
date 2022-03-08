import "@utrecht/components/dist/heading-1/bem.css";
import "@utrecht/components/dist/table/bem.css";
import React from "react";
import {Banktransactie} from "./generated/graphql";
import d from "../utils/dayjs";
import {Box, FormLabel, Stack, Text} from "@chakra-ui/react";
import BanktransactieListItem from "./BanktransactieListItem";

const BanktransactiesList: React.FC<{ transacties: Banktransactie[] }> = ({transacties}) => {
	const bt = transacties.reduce((result, t) => {
		const trDateAsString = d(t.transactiedatum).format("dddd LL");
		return {
			...result,
			[trDateAsString]: [
				...(result[trDateAsString] || []),
				t,
			],
		};
	}, {});

	return (<>
		<h1 className={"utrecht-heading-1"}>Uw Huishoudboekje</h1>

		{transacties.length > 0 ? (
			<Stack>
				{Object.keys(bt).map((transactionDate, i) => {
					return (
						<Stack key={i}>
							<Box>
								<FormLabel>{transactionDate}</FormLabel>
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