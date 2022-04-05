import {Box, Stack, Text} from "@chakra-ui/react";
import Divider from "@gemeente-denhaag/divider";
import "@utrecht/components/dist/heading-1/bem.css";
import "@utrecht/components/dist/table/bem.css";
import React from "react";
import {Banktransactie} from "../../../generated/graphql";
import {dateString} from "../../utils/dateFormat";
import d from "../../utils/dayjs";
import BanktransactieListItem from "./BanktransactieListItem";

const BanktransactiesList: React.FC<{ transacties: Banktransactie[] }> = ({transacties}) => {
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

	return (
		<Stack>
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
	);
};

export default BanktransactiesList;