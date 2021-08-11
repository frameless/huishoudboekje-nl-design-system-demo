import {Box, Button, Heading, HStack, IconButton, Spinner, Stack, Text, useTheme, VStack} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {FaLock} from "react-icons/fa";
import {Redirect, Route, Switch, useLocation} from "react-router-dom";
import AfspraakRouter from "./components/Afspraken";
import CustomerStatementMessages from "./components/Bankzaken/Bankafschriften";
import Betaalinstructies from "./components/Bankzaken/Betaalinstructies";
import Transactions from "./components/Bankzaken/Transacties";
import Burgers from "./components/Burgers";
import Configuratie from "./components/Configuratie";
import Gebeurtenissen from "./components/Gebeurtenissen";
import Huishoudens from "./components/Huishoudens";
import TwoColumns from "./components/Layouts/TwoColumns";
import UserStatus from "./components/Layouts/UserStatus";
import Organisaties from "./components/Organisaties";
import PageNotFound from "./components/PageNotFound";
import Rapportage from "./components/Rapportage";
import Sidebar from "./components/Sidebar";
import SidebarContainer from "./components/Sidebar/SidebarContainer";
import StatusErrorPage from "./components/Status/StatusErrorPage";
import StatusPage from "./components/Status/StatusPage";
import Routes from "./config/routes";
import Design from "./Design";
import {isDev} from "./utils/things";
import useAuth from "./utils/useAuth";

const App = () => {
	const {t} = useTranslation();
	const {user, error, loading, reset} = useAuth();
	const location = useLocation();
	const theme = useTheme();

	useEffect(() => {
		const _mtm = window["_mtm"] || [];
		_mtm.push({ event: "PathChanged" });
	}, [location.pathname]);

	const onClickLoginButton = () => {
		/* Save the current user's page so that we can quickly navigate back after login. */
		localStorage.setItem("hhb-referer", location.pathname);
		window.location.href = "/api/login";
	};

	if (error) {
		return (
			<StatusErrorPage />
		);
	}

	if (!user) {
		return (
			<TwoColumns>
				{loading ? (
					<Spinner size={"xl"} />
				) : (
					<Stack spacing={5} maxWidth={300} alignSelf={["center", null, null, "flex-start"]}>
						<Heading size="sm">{t("messages.login.welcome", {tenantName: theme["tenantName"]})}</Heading>
						<Text fontSize={"sm"}>{t("messages.login.clickHereToContinue")}</Text>
						<Button colorScheme={"primary"} type={"submit"} onClick={onClickLoginButton}>{t("actions.login")}</Button>
					</Stack>
				)}
			</TwoColumns>
		);
	}

	if (user) {
		/* Check if the user already visited a specific URL, and navigate there. */
		const referer = localStorage.getItem("hhb-referer");
		if (referer) {
			localStorage.removeItem("hhb-referer");
			return (<Redirect to={referer} />);
		}
	}

	return (
		<VStack h={"auto"} minHeight={"100vh"} minWidth={"100%"} w={"auto"} bg={"gray.100"}>
			<HStack width={"100%"} maxWidth={"1600px"} alignItems={"flex-start"} spacing={0}>
				<SidebarContainer>
					<Sidebar />
				</SidebarContainer>

				<Box height={"100%"} minHeight={"100vh"} width={"100%"} p={5}>
					<Stack spacing={5} direction={"row"} justifyContent={"flex-end"} alignItems={"center"} pb={5}>
						<HStack spacing={5} alignItems={"center"}>
							<UserStatus name={user.email} />
							<IconButton size={"14px"} icon={
								<FaLock />} color={"gray.400"} _hover={{color: "primary.700"}} aria-label={t("actions.logout")} mr={3} onClick={reset} />
						</HStack>
					</Stack>

					<Switch>
						<Route exact path={Routes.Home} component={() => <Redirect to={Routes.Huishoudens} />} />
						<Route path={Routes.Huishoudens} component={Huishoudens} />
						<Route path={Routes.Burgers} component={Burgers} />
						<Route path={Routes.Organisaties} component={Organisaties} />
						<Route path={Routes.Afspraken} component={AfspraakRouter} />
						<Route exact path={Routes.Bankzaken} component={() => <Redirect to={Routes.Transacties} />} />
						<Route path={Routes.Transacties} component={Transactions} />
						<Route path={Routes.Bankafschriften} component={CustomerStatementMessages} />
						<Route path={Routes.Betaalinstructies} component={Betaalinstructies} />
						<Route path={Routes.Configuratie} component={Configuratie} />
						<Route path={Routes.Rapportage} component={Rapportage} />
						<Route path={Routes.Gebeurtenissen} component={Gebeurtenissen} />
						<Route exact path={Routes.Status} component={StatusPage} />
						<Route exact path={Routes.NotFound} component={PageNotFound} />
						{isDev && <Route exact path={"/design"} component={Design} />}
						<Route component={PageNotFound} />
					</Switch>
				</Box>
			</HStack>
		</VStack>
	);
};

export default App;