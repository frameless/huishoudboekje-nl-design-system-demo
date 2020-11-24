import {BoxProps, Divider, Stack} from "@chakra-ui/core";
import React from "react";
import {FaRegBuilding, GrGraphQl, MdCreditCard, RiShoppingCart2Line, RiUserLine} from "react-icons/all";
import {useTranslate} from "../../config/i18n";
import Routes from "../../config/routes";
import {isDev} from "../../utils/things";
import SidebarLink from "./SidebarLink";

const Sidebar: React.FC<BoxProps> = (props) => {
	const {t} = useTranslate();

	return (
		<Stack spacing={5} p={5} alignSelf={"center"} {...props} width="100%">
			<SidebarLink href={Routes.Burgers} icon={RiUserLine}>{t("burgers.burgers")}</SidebarLink>
			<SidebarLink href={Routes.Organizations} icon={FaRegBuilding}>{t("organizations.organizations")}</SidebarLink>
			<Stack>
				<SidebarLink exactMatch href={Routes.Transactions} icon={MdCreditCard}>{t("banking.banking")}</SidebarLink>
				<Stack ml={"28px"} pl={"32px"} borderLeft={"1px solid"} borderColor={"gray.400"}>
					<SidebarLink size={"sm"} href={Routes.CSMs}>{t("banking.customerStatementMessages")}</SidebarLink>
				</Stack>
			</Stack>
			<SidebarLink href={Routes.Balances} icon={RiShoppingCart2Line}>{t("balances.balances")}</SidebarLink>

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