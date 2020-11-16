import React from "react";
import {BoxProps, Divider, Stack} from "@chakra-ui/core";
import SidebarLink from "./SidebarLink";
import {FaRegBuilding, GrGraphQl, MdCreditCard, RiShoppingCart2Line, RiUserLine} from "react-icons/all";
import {useTranslate} from "../../config/i18n";
import Routes from "../../config/routes";
import {isDev} from "../../utils/things";

const Sidebar: React.FC<BoxProps> = (props) => {
	const {t} = useTranslate();

	return (
		<Stack spacing={5} p={5} alignSelf={"center"} {...props} width="100%">
			<SidebarLink href={Routes.Burgers} icon={RiUserLine}>{t("burgers.burgers")}</SidebarLink>
			<SidebarLink href={Routes.Organizations} icon={FaRegBuilding}>{t("organizations.organizations")}</SidebarLink>
			<SidebarLink href={Routes.Balances} icon={RiShoppingCart2Line}>{t("balances.balances")}</SidebarLink>
			<SidebarLink href={Routes.Banking} icon={MdCreditCard}>{t("banking.banking")}</SidebarLink>

			{isDev && (
				<Stack spacing={5}>
					<Divider />
					<SidebarLink as="a" cursor="pointer" href={Routes.GraphiQL} onClick={() => window.open(Routes.GraphiQL)} icon={GrGraphQl}>GraphiQL</SidebarLink>
				</Stack>
			)}
		</Stack>
	);
};

export default Sidebar;