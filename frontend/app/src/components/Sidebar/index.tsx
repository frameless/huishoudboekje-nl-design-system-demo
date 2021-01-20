import {Box, BoxProps, HStack, Stack, VStack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {FaRegBuilding, GrGraphQl, MdCreditCard, RiBarChartFill, RiUserLine, TiCog} from "react-icons/all";
import Routes from "../../config/routes";
import {isDev} from "../../utils/things";
import SidebarLink from "./SidebarLink";

const Sidebar: React.FC<BoxProps> = (props) => {
	const {t} = useTranslation();

	return (<>
		<Stack spacing={5} p={5} alignSelf={"center"} borderRadius={5} bg={"white"} {...props} width={"100%"}>
			<SidebarLink to={Routes.Burgers} icon={RiUserLine}>{t("sidebar.burgers")}</SidebarLink>
			<SidebarLink to={Routes.Organisaties} icon={FaRegBuilding}>{t("sidebar.organisaties")}</SidebarLink>
			<Stack>
				<SidebarLink exactMatch to={Routes.Transactions} icon={MdCreditCard}>{t("sidebar.bankzaken")}</SidebarLink>
				<HStack direction={"row"}>
					<Box pl={5} ml={7}>&nbsp;</Box>
					<VStack>
						<SidebarLink size={"sm"} to={Routes.CSMs}>{t("sidebar.bronbestanden")}</SidebarLink>
						<SidebarLink size={"sm"} to={Routes.BookingsExport}>{t("sidebar.overschrijvingen")}</SidebarLink>
					</VStack>
				</HStack>
			</Stack>
			<Stack>
				<SidebarLink exactMatch to={Routes.Rapportages} icon={RiBarChartFill}>{t("sidebar.rapportages")}</SidebarLink>
				<HStack direction={"row"}>
					<Box pl={5} ml={7}>&nbsp;</Box>
					<VStack>
						<SidebarLink size={"sm"} to={Routes.RapportagesInkomstenUitgaven}>{t("sidebar.rapportageInkomstenUitgaven")}</SidebarLink>
						{isDev && <SidebarLink size={"sm"} to={Routes.RapportagesSaldo}>{t("sidebar.rapportageSaldo")}</SidebarLink>}
					</VStack>
				</HStack>
			</Stack>
			<SidebarLink to={Routes.Settings} icon={TiCog}>{t("sidebar.configuratie")}</SidebarLink>
		</Stack>

		{isDev && (
			<Stack spacing={5} p={5} alignSelf={"center"} borderRadius={5} bg={"white"} {...props} width={"100%"}>
				<Stack spacing={5}>
					<SidebarLink to={Routes.GraphiQL} target={"_blank"} icon={GrGraphQl}>GraphiQL</SidebarLink>
				</Stack>
			</Stack>
		)}
	</>
	);
};

export default Sidebar;