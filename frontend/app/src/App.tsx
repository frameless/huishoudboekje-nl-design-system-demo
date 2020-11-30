import {WarningIcon} from "@chakra-ui/icons";
import {Box, Button, Flex, Heading, HStack, IconButton, Spinner, Stack, Text, useTheme} from "@chakra-ui/react";
import {observer} from "mobx-react";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useIsMobile, useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {FaLock} from "react-icons/fa";
import {Redirect, Route, Switch, useLocation} from "react-router-dom";
import EditAgreement from "./components/Agreements/EditAgreement";
import Banking from "./components/Banking";
import Burgers from "./components/Burgers";
import TwoColumns from "./components/Layouts/TwoColumns";
import Organizations from "./components/Organizations";
import PageNotFound from "./components/PageNotFound";
import Sidebar from "./components/Sidebar";
import SidebarContainer from "./components/Sidebar/SidebarContainer";
import UserStatus from "./components/UserStatus";
import Routes from "./config/routes";
import {TABLET_BREAKPOINT} from "./utils/things";

type IUser = {
	email: string,
	fullName: string,
	role: string,
}

const useAuth = () => {
	const [user, setUser] = useState<IUser>();
	const [error, setError] = useToggle(false);
	const [loading, toggleLoading] = useToggle(true);

	const reset = useCallback(() => {
		fetch("/api/logout")
			.then(() => {
				setUser(undefined);
			})
			.catch(err => {
				console.error(err);
				setError(true);
				setUser(undefined);
			});
	}, [setError]);

	useEffect(() => {
		fetch("/api/me")
			.then(result => result.json())
			.then(result => {
				const {email} = result;

				if (email) {
					setUser({
						email: "koen.brouwer@vng.nl",
						fullName: "Koen Brouwer",
						role: "VNG Realisatie"
					});
				}

				toggleLoading(false);
			})
			.catch(err => {
				console.error(err);
				setError(true);
				toggleLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return useMemo(() => ({
		user, error, loading, reset
	}), [user, error, loading, reset]);
}

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
								<Route path={Routes.Organizations} component={Organizations} />
								<Route path={Routes.EditAgreement()} component={EditAgreement} />
								<Route path={Routes.Banking} component={Banking} />
								{/*<Route path={ROUTEPATH} component={SETTINGS_COMPONENT} />*/}
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