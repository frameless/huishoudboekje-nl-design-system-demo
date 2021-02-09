import {Box, BoxProps, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {FaRegBuilding, FiActivity, GrGraphQl, MdCreditCard, RiBarChartFill, RiUserLine, TiCog} from "react-icons/all";
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
				<SidebarLink exactMatch to={Routes.Bankzaken} icon={MdCreditCard}>{t("sidebar.bankzaken")}</SidebarLink>
				<Box pl={"27px"}>
					<Stack spacing={1} borderLeft={"1px solid"} borderLeftColor={"gray.400"} pl={"21px"}>
						<SidebarLink size={"sm"} to={Routes.Transacties}>{t("sidebar.transacties")}</SidebarLink>
						<SidebarLink size={"sm"} to={Routes.Bronbestanden}>{t("sidebar.bronbestanden")}</SidebarLink>
						<SidebarLink size={"sm"} to={Routes.Overschrijvingen}>{t("sidebar.overschrijvingen")}</SidebarLink>
					</Stack>
				</Box>
			</Stack>
			<SidebarLink to={Routes.Rapportage} icon={RiBarChartFill}>{t("sidebar.rapportage")}</SidebarLink>
			<SidebarLink to={Routes.Gebeurtenissen} icon={FiActivity}>{t("sidebar.gebeurtenissen")}</SidebarLink>
			<SidebarLink to={Routes.Settings} icon={TiCog}>{t("sidebar.configuratie")}</SidebarLink>
		</Stack>

		{isDev && (
			<Stack spacing={5} p={5} alignSelf={"center"} borderRadius={5} bg={"white"} {...props} width={"100%"}>
				<Stack spacing={5}>
					<SidebarLink to={Routes.GraphiQL} target={"_blank"} icon={GrGraphQl}>GraphiQL</SidebarLink>
				</Stack>
			</Stack>
		)}
	</>);
};

export default Sidebar;