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
import BrowserIcon from "./BrowserIcon";
import OsIcon from "./OsIcon";

// const GebruikersActiviteit2Readable = (subject) => {
// 	const [action, entity] = subject;
//
// 	let text = "";
// 	let icon: JSX.Element;
//
// 	switch (action) {
// 		case AuditTrailAction.Create: {
// 			text = `heeft een nieuwe ${entity} toegevoegd.`;
// 			break;
// 		}
// 		case AuditTrailAction.Update: {
// 			text = `heeft een ${entity} bewerkt.`;
// 			break;
// 		}
// 		default: {
// 			text = `${action} ${entity}`;
// 			break;
// 		}
// 	}
//
// 	switch (entity) {
// 		case AuditTrailEntity.Burger: {
// 			icon = <RiUserLine />;
// 			break;
// 		}
// 		case AuditTrailEntity.Organisatie: {
// 			icon = <FaRegBuilding />;
// 			break;
// 		}
// 		default: {
// 			icon = <FaQuestion />;
// 		}
// 	}
//
// 	return {
// 		icon, text
// 	};
// }

const Gebeurtenissen = () => {
	const {t} = useTranslation();
	const $gebeurtenissen = useGetGebeurtenissenQuery();

	const sortAuditTrailByTime = (a: GebruikersActiviteit, b: GebruikersActiviteit) => moment(a.timestamp).isBefore(b.timestamp) ? 1 : -1;

	return (
		<Page title={"Gebeurtenissen"}>

			<Section>
				<FormLeft title={t("Gebeurtenissen")} helperText={t("Dit is een overzicht van alle gebruikersactiviteiten.")} />
				<Queryable query={$gebeurtenissen} children={data => {
					const gs: GebruikersActiviteit[] = data.gebruikersactiviteiten || [];
					return (
						<Table>
							<Thead>
								<Tr>
									<Th>{t("Activiteit")}</Th>
									<Th>{t("Betrokken onderwerpen")}</Th>
									<Th>{t("Actie")}</Th>
									<Th>{t("Meta")}</Th>
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
													<Text>{g.gebruikerId || t("unknown")}</Text>
													<Text fontSize={"sm"} color={"gray.500"}>{moment(g.timestamp).format("L LT")}</Text>
												</Stack>
											</HStack>
										</Td>
										<Td>
											<HStack>
												{g.entities?.map(e => (
													<Text>{e.entityType} ({e.entityId})</Text>
												))}
											</HStack>
										</Td>
										<Td>
											<Text>{g.action}</Text>
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