import React, {useEffect} from "react";
import {Box, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, PseudoBox, Stack, Text} from "@chakra-ui/core";
import {useSession} from "./utils/hooks";
import LoginPage from "./components/LoginPage";
import {observer} from "mobx-react";
import SidebarContainer from "./components/Sidebar/SidebarContainer";
import {useIsMobile} from "react-grapple";
import {Redirect, Route, Switch, useLocation} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import UserStatus from "./components/UserStatus";
import {FaLock} from "react-icons/all";
import Routes from "./config/routes";
import Citizens from "./components/Burgers";
import PageNotFound from "./components/PageNotFound";
import {isDev, TABLET_BREAKPOINT} from "./utils/things";
import {useTranslation} from "react-i18next";
import {sampleData} from "./config/sampleData/sampleData";
import Organizations from "./components/Organizations";

const App = () => {
	const {t} = useTranslation();
	const isMobile = useIsMobile(TABLET_BREAKPOINT);
	const session = useSession();
	const location = useLocation();

	if (!session.user) {
		session.setReferer(location.pathname);
	}

	const onClickLogoutButton = () => {
		session.reset();
	};

	return (
		<Switch>
			<Route path={Routes.Login} component={LoginPage} />

			{!session.user && <Redirect push to={Routes.Login} />}
			{session.user && (
				<Route>
					<Flex h={"auto"} minHeight={"100vh"} minWidth={"100%"} w={"auto"} bg={"gray.100"}>
						<Stack width={"100%"} direction={isMobile ? "column" : "row"} justifyContent={"flex-start"} alignItems={"flex-start"} spacing={30}>
							<SidebarContainer>
								<Sidebar />
							</SidebarContainer>

							<Box height={"100%"} minHeight={"100vh"} width={"100%"} p={5}>
								<Stack spacing={10} direction={"row"} justifyContent={"flex-end"} alignItems={"center"} pb={5}>
									<Menu>
										<MenuButton as={Box}>
											<Stack direction={"row"} spacing={5} alignItems={"center"}>
												<UserStatus name={session.user.fullName} role={session.user.role} />
												<IconButton icon="chevron-down" variant={"solid"} aria-label="Open menu" />
											</Stack>
										</MenuButton>
										<MenuList zIndex={3}>
											<MenuItem onClick={onClickLogoutButton}>
												<PseudoBox size={"16px"} as={FaLock} color={"gray.400"} _hover={{color: "primary.700"}} aria-label={t("actions.logout")} mr={3} />
												<Text>{t("actions.logout")}</Text>
											</MenuItem>
										</MenuList>
									</Menu>
								</Stack>

								<Switch>
									<Route path={Routes.Citizens} component={Citizens} />
									<Route path={Routes.Organizations} component={Organizations} />
									{/*<Route path={ROUTEPATH} component={BANK_COMPONENT} />*/}
									{/*<Route path={ROUTEPATH} component={SETTINGS_COMPONENT} />*/}
									<Route exact path={Routes.NotFound} component={PageNotFound} />
									<Route component={PageNotFound} />
								</Switch>
							</Box>
						</Stack>
					</Flex>
				</Route>
			)}
		</Switch>
	);
};

export default observer(App);