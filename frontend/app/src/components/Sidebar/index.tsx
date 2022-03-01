import {Badge, Box, Divider, HStack, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {BsFillHouseDoorFill, FaRegBuilding, FiActivity, GrGraphQl, MdBusAlert, MdCreditCard, RiBarChartFill, TiCog} from "react-icons/all";
import {RouteNames} from "../../config/routes";
import {useFeatureFlag} from "../../utils/features";
import {isDev} from "../../utils/things";
import SidebarLink from "./SidebarLink";
import {useLocation} from "react-router-dom";

const Sidebar = (to, exactMatch?) => {
	const {t} = useTranslation();
	const testPageEnabled = useFeatureFlag("testpage");

	const location = useLocation();
	const isActive = exactMatch ? location.pathname === to : location.pathname.includes(to);

	return (
		<Stack spacing={5} p={5} alignSelf={"center"} borderRadius={5} bg={"white"} divider={<Divider />} width={"100%"}>
			<Stack spacing={5}>
				<SidebarLink to={RouteNames.signalen} icon={MdBusAlert}>
					<HStack justify={"space-between"} w={"100%"}>
						<Text>{t("sidebar.signalen")} </Text>
						<Badge fontSize={"0.9rem"} p={1} colorScheme={isActive ? "primary" : "white"} variant={"outline"}>99+</Badge>
					</HStack>
				</SidebarLink>
				<Stack>
					<SidebarLink to={RouteNames.huishoudens} icon={BsFillHouseDoorFill}>{t("sidebar.huishoudens")}</SidebarLink>
					<Box pl={"27px"}>
						<Stack spacing={1} borderLeft={"1px solid"} borderLeftColor={"gray.400"} pl={"21px"}>
							<SidebarLink size={"sm"} to={RouteNames.burgers}>{t("sidebar.burgers")}</SidebarLink>
						</Stack>
					</Box>
				</Stack>
				<SidebarLink to={RouteNames.organisaties} icon={FaRegBuilding}>{t("sidebar.organisaties")}</SidebarLink>
				<Stack>
					<SidebarLink exactMatch to={RouteNames.bankzaken} icon={MdCreditCard}>{t("sidebar.bankzaken")}</SidebarLink>
					<Box pl={"27px"}>
						<Stack spacing={1} borderLeft={"1px solid"} borderLeftColor={"gray.400"} pl={"21px"}>
							<SidebarLink size={"sm"} to={`${RouteNames.bankzaken}/${RouteNames.transacties}`}>{t("sidebar.transacties")}</SidebarLink>
							<SidebarLink size={"sm"} to={`${RouteNames.bankzaken}/${RouteNames.bankafschriften}`}>{t("sidebar.bankafschriften")}</SidebarLink>
							<SidebarLink size={"sm"} to={`${RouteNames.bankzaken}/${RouteNames.betaalinstructies}`}>{t("sidebar.betaalinstructies")}</SidebarLink>
						</Stack>
					</Box>
				</Stack>
				<SidebarLink to={RouteNames.rapportage} icon={RiBarChartFill}>{t("sidebar.rapportage")}</SidebarLink>
				<SidebarLink to={RouteNames.gebeurtenissen} icon={FiActivity}>{t("sidebar.gebeurtenissen")}</SidebarLink>
				<SidebarLink to={RouteNames.configuratie} icon={TiCog}>{t("sidebar.configuratie")}</SidebarLink>
			</Stack>

			{(isDev || testPageEnabled) && (
				<Stack spacing={5}>
					{isDev && (<SidebarLink to={"/api/graphql"} target={"_blank"} icon={GrGraphQl}>GraphiQL</SidebarLink>)}
				</Stack>
			)}
		</Stack>
	);
};

export default Sidebar;