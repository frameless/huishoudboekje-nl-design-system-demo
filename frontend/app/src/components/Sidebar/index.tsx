import React from "react";
import {Stack} from "@chakra-ui/core";
import SidebarLink from "./SidebarLink";
import {GrBasket, GrDashboard, GrLink, GrSettingsOption, GrUser} from "react-icons/all";
import {useTranslate} from "../../config/i18n";
import Routes from "../../config/routes";

const Sidebar = (props) => {
	const {t} = useTranslate();

	return (
		<Stack spacing={10} p={5} alignSelf={"center"} {...props}>
			<Stack spacing={5}>
				<SidebarLink disabled href={Routes.Dashboard} icon={GrDashboard}>{t("dashboard")}</SidebarLink>
				<SidebarLink disabled href={Routes.Home} icon={GrUser}>{t("balances")}</SidebarLink>
				<SidebarLink disabled href={Routes.Home} icon={GrLink}>{t("organizations")}</SidebarLink>
				<SidebarLink disabled href={Routes.Home} icon={GrBasket}>{t("banking")}</SidebarLink>
				<SidebarLink disabled href={Routes.Settings} icon={GrSettingsOption}>{t("settings")}</SidebarLink>
			</Stack>
		</Stack>
	);
};

export default Sidebar;