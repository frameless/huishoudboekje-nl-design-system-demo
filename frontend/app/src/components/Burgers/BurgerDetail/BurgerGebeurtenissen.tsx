import {HStack, Stack, StackProps, Table, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import {useTranslation} from "react-i18next";
import {FiActivity} from "react-icons/all";
import {Gebruiker, GebruikersActiviteit, useGetGebeurtenissenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {FormLeft} from "../../Forms/FormLeftRight";
import AuditLogText from "../../Gebeurtenissen/AuditLogText";
import BrowserIcon from "../../Gebeurtenissen/BrowserIcon";
import OsIcon from "../../Gebeurtenissen/OsIcon";
import RoundIcon from "../../Layouts/RoundIcon";

const BurgerGebeurtenissen: React.FC<StackProps & { burger: Gebruiker }> = ({burger, ...props}) => {
	const {t} = useTranslation();
	const $gebeurtenissen = useGetGebeurtenissenQuery({
		fetchPolicy: "no-cache"
	});
	const sortAuditTrailByTime = (a: GebruikersActiviteit, b: GebruikersActiviteit) => moment(a.timestamp).isBefore(b.timestamp) ? 1 : -1;

	return (
		<Stack {...props}>
			<FormLeft title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperTextBurger")} />
			<Queryable query={$gebeurtenissen} children={data => {
				const gs: GebruikersActiviteit[] = data.gebruikersactiviteiten || [];

				// Find only Gebruikersactiviteiten that have an entity for the current burger.
				const burgerGs = gs.filter(g => {
					const burgerEntities = g.entities?.filter(e => e.entityType === "burger" && e.entityId === burger.id) || [];
					return burgerEntities.length > 0;
				});

				return (
					<Table>
						<Thead>
							<Tr>
								<Th>{t("pages.gebeurtenissen.activity")}</Th>
								<Th>{t("pages.gebeurtenissen.meta")}</Th>
							</Tr>
						</Thead>
						<Tbody>
							{[...burgerGs].sort(sortAuditTrailByTime).map(g => (
								<Tr alignItems={"center"} key={g.id}>
									<Td>
										<HStack>
											<RoundIcon display={["none", null, "flex"]}>
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
		</Stack>
	);
};

export default BurgerGebeurtenissen;