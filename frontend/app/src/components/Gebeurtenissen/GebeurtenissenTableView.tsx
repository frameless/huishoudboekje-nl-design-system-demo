import {Table, TableProps, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {GebruikersActiviteit} from "../../generated/graphql";
import {sortAuditTrailByTime} from "../../utils/things";
import GebeurtenisTableRow from "./GebeurtenisTableRow";

const GebeurtenissenTableView: React.FC<TableProps & {gebeurtenissen: GebruikersActiviteit[]}> = ({gebeurtenissen: gs, ...props}) => {
	const {t} = useTranslation();

	return (
		<Table size={"sm"} {...props}>
			<Thead>
				<Tr>
					<Th>{t("pages.gebeurtenissen.activity")}</Th>
				</Tr>
			</Thead>
			<Tbody>
				{[...gs].sort(sortAuditTrailByTime).map((g, i) => (
					<GebeurtenisTableRow gebeurtenis={g} key={i} />
				))}
			</Tbody>
		</Table>
	);
};

export default GebeurtenissenTableView;