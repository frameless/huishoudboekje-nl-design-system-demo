import React from "react";
import {Box, Flex, IconButton, Stack} from "@chakra-ui/core";
import {useSession} from "./utils/hooks";
import LoginPage from "./components/LoginPage";
import {observer} from "mobx-react";
import SidebarContainer from "./components/Sidebar/SidebarContainer";
import {useIsMobile} from "react-grapple";
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import UserStatus from "./components/UserStatus";
import {GrLock} from "react-icons/all";

const App = () => {
	const isMobile = useIsMobile();
	const session = useSession();

	return (
		<Router>
			<Route path={"/login"} component={LoginPage} />
			<Route path={"/"}>{
				session.user ? (
					<Flex h={"auto"} minHeight={"100vh"} minWidth={"100%"} w={"auto"} bg={"gray.100"}>
						<Stack width={"100%"} direction={isMobile ? "column" : "row"} justifyContent={"flex-start"} alignItems={"flex-start"} spacing={30}>
							<SidebarContainer>
								<Sidebar />
							</SidebarContainer>
							<Box height={"100%"} minHeight={"100vh"} width={"100%"} p={5}>

								<Stack spacing={10} direction={"row"} justifyContent={"flex-end"} pb={5}>
									<UserStatus name={session.user.fullName} role={session.user.role} />
									<IconButton size={"sm"} icon={GrLock} variant={"outline"} variantColor={"black"} aria-label={"Uitloggen"} onClick={() => session.reset()} />
								</Stack>

								<Router>
									{/*<Route path={"/"} component={Dashboard} />*/}
									{/*<Route path={"/deelnemers"} component={Deelnemers} />*/}
									{/*<Route path={"/ketenpartners"} component={Ketenpartners} />*/}
									{/*<Route path={"/bankzaken"} component={Bankzaken} />*/}
									{/*<Route path={"/instellingen"} component={Settings} />*/}
									{/*<Route component={PageNotFound} />*/}
								</Router>

							</Box>
						</Stack>
					</Flex>
				) : (
					<Redirect to={"/login"} />
				)
			}</Route>
		</Router>
	);
};

export default observer(App);