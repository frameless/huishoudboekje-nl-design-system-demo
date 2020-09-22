import React from "react";
import {BoxProps, Stack} from "@chakra-ui/core";
import SidebarLink from "./SidebarLink";
import {MdAccountBalance, MdCreditCard, MdDashboard, MdPerson, MdSettings, MdShoppingCart} from "react-icons/all";
import {useTranslate} from "../../config/i18n";
import Routes from "../../config/routes";

const Sidebar: React.FC<BoxProps> = (props) => {
	const {t} = useTranslate();

	return (
		<Stack spacing={10} p={5} alignSelf={"center"} {...props}>
			<SidebarLink exactMatch href={Routes.Dashboard} icon={MdDashboard}>{t("dashboard")}</SidebarLink>
			<SidebarLink href={Routes.Citizens} icon={MdPerson}>{t("citizens")}</SidebarLink>
			<SidebarLink href={Routes.Balances} icon={MdShoppingCart}>{t("balances")}</SidebarLink>
			<SidebarLink href={Routes.Organizations} icon={MdAccountBalance}>{t("organizations")}</SidebarLink>
			<SidebarLink href={Routes.Banking} icon={MdCreditCard}>{t("banking")}</SidebarLink>
			<SidebarLink exactMatch href={Routes.Settings} icon={MdSettings}>{t("settings")}</SidebarLink>
		</Stack>
	);
};

export default Sidebar;