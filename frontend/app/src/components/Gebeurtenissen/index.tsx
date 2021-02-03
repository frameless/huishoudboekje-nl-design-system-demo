import {HStack, Stack, Table, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import {useTranslation} from "react-i18next";
import {FiActivity} from "react-icons/all";
import {GebruikersActiviteit, useGetGebeurtenissenQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {FormLeft} from "../Forms/FormLeftRight";
import Page from "../Layouts/Page";
import RoundIcon from "../Layouts/RoundIcon";
import Section from "../Layouts/Section";
import AuditLogText from "./AuditLogText";
import BrowserIcon from "./BrowserIcon";
import OsIcon from "./OsIcon";

const Gebeurtenissen = () => {
	const {t} = useTranslation();
	const $gebeurtenissen = useGetGebeurtenissenQuery({
		fetchPolicy: "no-cache"
	});

	const sortAuditTrailByTime = (a: GebruikersActiviteit, b: GebruikersActiviteit) => moment(a.timestamp).isBefore(b.timestamp) ? 1 : -1;

	return (
		<Page title={t("pages.gebeurtenissen.title")}>

			<Section>
				<FormLeft title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperText")} />
				<Queryable query={$gebeurtenissen} children={data => {
					const gs: GebruikersActiviteit[] = data.gebruikersactiviteiten || [];
					return (
						<Table>
							<Thead>
								<Tr>
									<Th>{t("pages.gebeurtenissen.activity")}</Th>
									<Th>{t("pages.gebeurtenissen.meta")}</Th>
								</Tr>
							</Thead>
							<Tbody>
								{[...gs].sort(sortAuditTrailByTime).map(g => (
									<Tr alignItems={"center"} key={g.id}>
										<Td>
											<HStack>
												<RoundIcon>
													<FiActivity />
												</RoundIcon>
												<Stack spacing={0}>
													<AuditLogText g={g} />
													<Text fontSize={"sm"} color={"gray.500"}>{moment(g.timestamp).format("L LT")}</Text>
												</Stack>
											</HStack>
										</Td>
										<Td>
											<HStack>
												<BrowserIcon userAgent={g.meta?.userAgent} />
												<OsIcon userAgent={g.meta?.userAgent} />
											</HStack>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					);
				}} />
			</Section>

		</Page>
	);
};

export default Gebeurtenissen;