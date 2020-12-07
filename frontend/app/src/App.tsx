import {WarningIcon} from "@chakra-ui/icons";
import {Box, Button, Flex, Heading, HStack, IconButton, Spinner, Stack, Text, useTheme} from "@chakra-ui/react";
import {observer} from "mobx-react";
import React from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {FaLock} from "react-icons/fa";
import {Redirect, Route, Switch, useLocation} from "react-router-dom";
import EditAgreement from "./components/Agreements/EditAgreement";
import Banking from "./components/Banking";
import Burgers from "./components/Burgers";
import TwoColumns from "./components/Layouts/TwoColumns";
import Organisaties from "./components/Organisaties";
import PageNotFound from "./components/PageNotFound";
import Sidebar from "./components/Sidebar";
import SidebarContainer from "./components/Sidebar/SidebarContainer";
import UserStatus from "./components/UserStatus";
import Routes from "./config/routes";
import Test from "./Test";
import {useAuth} from "./utils/hooks";
import {TABLET_BREAKPOINT} from "./utils/things";

const App = () => {
	const {t} = useTranslation();
	const isMobile = useIsMobile(TABLET_BREAKPOINT);
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
					<Stack spacing={5} maxWidth={300} alignSelf={isMobile ? "center" : "flex-start"}>
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
		<Switch>
			<Route>
				<Flex h={"auto"} minHeight={"100vh"} minWidth={"100%"} w={"auto"} bg={"gray.100"}>
					<Flex width={"100%"} justifyContent={"flex-start"} alignItems={"flex-start"} spacing={5}>
						<SidebarContainer>
							<Sidebar />
						</SidebarContainer>

						<Box height={"100%"} minHeight={"100vh"} width={"100%"} p={5}>
							<Stack spacing={5} direction={"row"} justifyContent={"flex-end"} alignItems={"center"} pb={5}>
								<HStack spacing={5} alignItems={"center"}>
									<UserStatus name={user.fullName} role={user.role} />
									<IconButton size={"14px"} icon={<FaLock />} color={"gray.400"} _hover={{color: "primary.700"}} aria-label={t("actions.logout")} mr={3}
									            onClick={reset} />
								</HStack>
							</Stack>

							<Switch>
								<Route exact path={Routes.Home}>
									<Redirect to={Routes.Burgers} />
								</Route>
								<Route path={Routes.Burgers} component={Burgers} />
								<Route path={Routes.Organisaties} component={Organisaties} />
								<Route path={Routes.EditAgreement()} component={EditAgreement} />
								<Route path={Routes.Banking} component={Banking} />
								{/*<Route path={ROUTEPATH} component={SETTINGS_COMPONENT} />*/}
								<Route path={"/test"} component={Test} />
								<Route exact path={Routes.NotFound} component={PageNotFound} />
								<Route component={PageNotFound} />
							</Switch>
						</Box>
					</Flex>
				</Flex>
			</Route>
		</Switch>
	);
};

export default observer(App);