import React from "react";
import {Box, Flex, IconButton, Stack} from "@chakra-ui/core";
import {useSession} from "./utils/hooks";
import LoginPage from "./components/LoginPage";
import {observer} from "mobx-react";
import SidebarContainer from "./components/Sidebar/SidebarContainer";
import {useIsMobile} from "react-grapple";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import UserStatus from "./components/UserStatus";
import {GrLock} from "react-icons/all";
import Routes from "./config/routes";
import Citizens from "./components/Citizens";
import users from "./config/users.json";

const App = () => {
	const isMobile = useIsMobile();
	const session = useSession();

	return (
		<Router>
			<Switch>
				<Route path={Routes.Login} component={LoginPage} />

				{!session.user && <Redirect to={Routes.Login} />}
				{session.user && (
					<Route>
						<Flex h={"auto"} minHeight={"100vh"} minWidth={"100%"} w={"auto"} bg={"gray.100"}>
							<Stack width={"100%"} direction={isMobile ? "column" : "row"} justifyContent={"flex-start"} alignItems={"flex-start"} spacing={30}>
								<SidebarContainer>
									<Sidebar />
								</SidebarContainer>
								<Box height={"100%"} minHeight={"100vh"} width={"100%"} p={5}>

									<Stack spacing={10} direction={"row"} justifyContent={"flex-end"} alignItems={"center"} pb={5}>
										<UserStatus name={session.user.fullName} role={session.user.role} />
										<IconButton size={"sm"} icon={GrLock} variant={"outline"} variantColor={"red"} aria-label={"Uitloggen"} onClick={() => session.reset()} />
									</Stack>

									<Router>
										{/*<Route path={"/"} component={Dashboard} />*/}
										<Route path={Routes.Citizens} component={Citizens} />
										{/*<Route path={"/ketenpartners"} component={Ketenpartners} />*/}
										{/*<Route path={"/bankzaken"} component={Bankzaken} />*/}
										{/*<Route path={"/instellingen"} component={Settings} />*/}
										{/*<Route component={PageNotFound} />*/}
									</Router>

								</Box>
							</Stack>
						</Flex>
					</Route>
				)}
			</Switch>
		</Router>
	);
};

export default observer(App);