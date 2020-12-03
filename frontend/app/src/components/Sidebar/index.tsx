import {Box, BoxProps, Divider, HStack, Stack, VStack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {FaRegBuilding, GrGraphQl, MdCreditCard, RiShoppingCart2Line, RiUserLine} from "react-icons/all";
import Routes from "../../config/routes";
import {isDev} from "../../utils/things";
import SidebarLink from "./SidebarLink";

const Sidebar: React.FC<BoxProps> = (props) => {
	const {t} = useTranslation();

	return (
		<Stack spacing={5} p={5} alignSelf={"center"} {...props} width={"100%"}>
			<SidebarLink href={Routes.Burgers} icon={RiUserLine}>{t("burgers.burgers")}</SidebarLink>
			<SidebarLink href={Routes.Organizations} icon={FaRegBuilding}>{t("organizations.organizations")}</SidebarLink>
			<Stack>
				<SidebarLink exactMatch href={Routes.Transactions} icon={MdCreditCard}>{t("banking.banking")}</SidebarLink>
				<HStack direction={"row"}>
					<Box pl={5} ml={7}>&nbsp;</Box>
					<VStack>
						<SidebarLink size={"sm"} href={Routes.CSMs}>{t("banking.customerStatementMessages")}</SidebarLink>
						<SidebarLink size={"sm"} href={Routes.BookingsExport}>{t("banking.exports.exports")}</SidebarLink>
					</VStack>
				</HStack>
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