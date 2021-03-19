import {WarningIcon} from "@chakra-ui/icons";
import {Box, Button, Heading, HStack, IconButton, Spinner, Stack, Text, useTheme, VStack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {FaLock} from "react-icons/fa";
import {Redirect, Route, Switch, useLocation} from "react-router-dom";
import Afspraken from "./components/Afspraken";
import EditAfspraak from "./components/Afspraken/EditAfspraak";
import CustomerStatementMessages from "./components/Bankzaken/Bronbestanden";
import OverschrijvingenExport from "./components/Bankzaken/OverschrijvingenExport";
import Transactions from "./components/Bankzaken/Transacties";
import Gebeurtenissen from "./components/Gebeurtenissen";
import Burgers from "./components/Burgers";
import Configuratie from "./components/Configuratie";
import TwoColumns from "./components/Layouts/TwoColumns";
import Organisaties from "./components/Organisaties";
import PageNotFound from "./components/PageNotFound";
import Rapportage from "./components/Rapportage";
import Sidebar from "./components/Sidebar";
import SidebarContainer from "./components/Sidebar/SidebarContainer";
import UserStatus from "./components/UserStatus";
import Routes from "./config/routes";
import useAuth from "./utils/useAuth";

const App = () => {
	const {t} = useTranslation();
	const {user, error, loading, reset} = useAuth();
	const location = useLocation();
	const theme = useTheme();

	const onClickLoginButton = () => {
		/* Save the current user's page so that we can quickly navigate back after login. */
		localStorage.setItem("hhb-referer", location.pathname);
		window.location.href = "/api/login";
	};

	if (error) {
		return (
			<TwoColumns>
				<Stack spacing={5} maxWidth={300} direction={"row"} alignItems={"center"}>
					<WarningIcon color={"red.500"} />
					<Text color={"red.600"}>{t("messages.backendError")}</Text>
				</Stack>
			</TwoColumns>
		)
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
							<IconButton size={"14px"} icon={<FaLock />} color={"gray.400"} _hover={{color: "primary.700"}} aria-label={t("actions.logout")} mr={3} onClick={reset} />
						</HStack>
					</Stack>

					<Switch>
						<Route exact path={Routes.Home} component={() => <Redirect to={Routes.Burgers} />} />
						<Route path={Routes.Burgers} component={Burgers} />
						<Route path={Routes.Organisaties} component={Organisaties} />
						<Route path={Routes.EditAfspraak()} component={EditAfspraak} />
						<Route path={Routes.Afspraken} component={Afspraken} />
						<Route exact path={Routes.Bankzaken} component={() => <Redirect to={Routes.Transacties} />} />
						<Route path={Routes.Transacties} component={Transactions} />
						<Route path={Routes.Bronbestanden} component={CustomerStatementMessages} />
						<Route path={Routes.Overschrijvingen} component={OverschrijvingenExport} />
						<Route path={Routes.Settings} component={Configuratie} />
						<Route path={Routes.Rapportage} component={Rapportage} />
						<Route path={Routes.Gebeurtenissen} component={Gebeurtenissen} />

						<Route exact path={Routes.NotFound} component={PageNotFound} />
						<Route component={PageNotFound} />
					</Switch>
				</Box>
			</HStack>
		</VStack>
	);
};

export default App;