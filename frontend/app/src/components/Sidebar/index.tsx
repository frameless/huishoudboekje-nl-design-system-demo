import React from "react";
import {BoxProps, Divider, Heading, Stack} from "@chakra-ui/core";
import SidebarLink from "./SidebarLink";
import {FaRegBuilding, GrGraphQl, MdCreditCard, RiDashboardLine, RiShoppingCart2Line, RiUserLine} from "react-icons/all";
import {useTranslate} from "../../config/i18n";
import Routes from "../../config/routes";
import {isDev} from "../../utils/things";

const Sidebar: React.FC<BoxProps> = (props) => {
	const {t} = useTranslate();

	return (
		<Stack spacing={5} p={5} alignSelf={"center"} {...props} width="100%">
			<SidebarLink exactMatch href={Routes.Dashboard} icon={RiDashboardLine}>{t("dashboard")}</SidebarLink>
			<SidebarLink href={Routes.Citizens} icon={RiUserLine}>{t("citizens")}</SidebarLink>
			<SidebarLink href={Routes.Organizations} icon={FaRegBuilding}>{t("organizations")}</SidebarLink>
			<SidebarLink href={Routes.Balances} icon={RiShoppingCart2Line}>{t("balances")}</SidebarLink>
			<SidebarLink href={Routes.Banking} icon={MdCreditCard}>{t("banking")}</SidebarLink>

			{isDev && (<>
				<Divider />
				<Stack spacing={5}>
					<Heading size={"xs"}>Developer menu</Heading>
					<SidebarLink as="a" cursor="pointer" href={Routes.GraphiQL} onClick={() => window.open("/api/graphql")} icon={GrGraphQl}>GraphiQL</SidebarLink>
				</Stack>
			</>)}
		</Stack>
	);
};

export default Sidebar;