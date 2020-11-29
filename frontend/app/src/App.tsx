import {ChevronDownIcon, WarningIcon} from "@chakra-ui/icons";
import {Box, Button, Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Spinner, Stack, Text, useTheme, useToast} from "@chakra-ui/react";
import {observer} from "mobx-react";
import React, {useEffect, useState} from "react";
import {useIsMobile, useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {FaLock} from "react-icons/all";
import {Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
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
import {useSession} from "./utils/hooks";
import {TABLET_BREAKPOINT} from "./utils/things";

const App = () => {
	const {t} = useTranslation();
	const isMobile = useIsMobile(TABLET_BREAKPOINT);
	const session = useSession();
	const location = useLocation();
	const [isLoading, toggleLoading] = useToggle(true);
	const toast = useToast();
	const theme = useTheme();
	const {push} = useHistory();
	const [backendError, setBackendError] = useState();

	const onClickLoginButton = () => {
		/* Save the current user's page so that we can quickly navigate back after login. */
		localStorage.setItem("hhb-referer", location.pathname);
		window.location.href = "/api/login";
	};

	const onClickLogoutButton = () => {
		fetch("/api/logout")
			.then(() => session.reset());
	}

	useEffect(() => {
		if (backendError) {
			return;
		}

		fetch("/api/me")
			.then(result => result.json())
			.then(result => {
				if (!result.message) {
					/* Todo: the full user profile (firstName, lastName, role etc) should come from the API.
					 * For now, we just set a local user to make this work. */
					session.setUser({
						"email": "koen.brouwer@vng.nl",
						"firstName": "Koen",
						"lastName": "Brouwer",
						"role": "VNG Realisatie"
					});

					/* Check if the user already visited a specific URL, and navigate there. */
					const referer = localStorage.getItem("hhb-referer");
					if (referer) {
						localStorage.removeItem("hhb-referer");
						push(referer);
					}
				}

				toggleLoading(false);
			})
			.catch(err => {
				setBackendError(err);
			});
	}, [backendError, push, session, toast, toggleLoading]);

	if (backendError) {
		return (
			<TwoColumns>
				<Stack spacing={5} maxWidth={300} direction={"row"} alignItems={"center"}>
					<WarningIcon color={"red.500"} />
					<Text color={"red.600"}>{t("messages.backendError")}</Text>
				</Stack>
			</TwoColumns>
		)
	}

	if (!session.user) {
		return (
			<TwoColumns>
				{isLoading ? (
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
							<Stack spacing={10} direction={"row"} justifyContent={"flex-end"} alignItems={"center"} pb={5}>
								<Menu>
									<MenuButton as={Box}>
										<Stack direction={"row"} spacing={5} alignItems={"center"}>
											<UserStatus name={session.user.fullName} role={session.user.role} />
											<IconButton icon={<ChevronDownIcon />} variant={"solid"} aria-label="Open menu" />
										</Stack>
									</MenuButton>
									<MenuList zIndex={3}>
										<MenuItem onClick={onClickLogoutButton}>
											<Box size={"16px"} as={FaLock} color={"gray.400"} _hover={{color: "primary.700"}} aria-label={t("actions.logout")}
											     mr={3} />
											<Text>{t("actions.logout")}</Text>
										</MenuItem>
									</MenuList>
								</Menu>
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