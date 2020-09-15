import React from "react";
import {Box, Flex, Stack} from "@chakra-ui/core";
import User from "./components/User";
import {useSession} from "./utils/hooks";
import LoginPage from "./components/LoginPage";
import {observer} from "mobx-react";
import Sidebar from "./components/Sidebar";
import users from "./config/users.json";
import {useIsMobile} from "react-grapple";
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";

const App = () => {
	const isMobile = useIsMobile();
	const session = useSession();

	useEffect(() => {
		session.setUser(users[0]);
	}, [session])

	return (
		<Router>
			<Route path={"/login"} component={LoginPage} />
			<Route path={"/"} component={() => {
				if (!session.user) {
					return <Redirect to={"/login"} />
				} else {
					return (
						<Flex h={"auto"} minHeight={"100vh"} minWidth={"100%"} w={"auto"} bg={isMobile ? "white" : "gray.100"}>
							<Stack width={"100%"} direction={isMobile ? "column" : "row"} justifyContent={"flex-start"} alignItems={"flex-start"} spacing={30}>

								<Sidebar />
								<Box alignSelf={isMobile ? "center" : "flex-start"} p={5}>
									<User />
								</Box>

							</Stack>
						</Flex>
					)
				}
			}} />
		</Router>
	);
};

export default observer(App);
