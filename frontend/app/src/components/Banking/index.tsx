import {Heading, PseudoBoxProps, Stack, Tab, TabList, Tabs} from "@chakra-ui/core";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink, NavLinkProps, Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import Routes from "../../config/routes";
import CustomerStatementMessages from "./CustomerStatementMessages";
import Transactions from "./Transactions";

const tabRoutes = [
	Routes.Transactions,
	Routes.CSMs
];

type TabProps = PseudoBoxProps & React.ButtonHTMLAttributes<any>;
type NavLinkTabProps = TabProps & NavLinkProps;
const NavLinkTab: React.FC<NavLinkTabProps> = React.forwardRef(
	(props: NavLinkTabProps, ref: React.Ref<any>) => {
		return <Tab ref={ref} as={NavLink} {...props} />;
	}
);

const Banking = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const location = useLocation();

	const defaultTabRoute = tabRoutes.findIndex(l => location.pathname.includes(l)) || 0;

	return (
		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"} maxWidth={1200}>
				<Stack direction={"row"} spacing={5} alignItems={"center"}>
					<Heading size={"lg"}>{t("banking.banking")}</Heading>
				</Stack>

				<Tabs defaultIndex={defaultTabRoute}>
					<TabList>
						<NavLinkTab to={tabRoutes[0]}>{t("banking.transactions")}</NavLinkTab>
						<NavLinkTab to={tabRoutes[1]}>{t("banking.customerStatementMessages")}</NavLinkTab>
					</TabList>
				</Tabs>
			</Stack>

			<Switch>
				<Route path={Routes.Transactions}>
					<Transactions />
				</Route>
				<Route path={Routes.CSMs}>
					<CustomerStatementMessages />
				</Route>
				<Route><Redirect to={tabRoutes[defaultTabRoute]} /></Route>
			</Switch>
		</Stack>
	);
};

export default Banking;